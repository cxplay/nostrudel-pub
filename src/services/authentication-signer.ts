import { Nip07Interface } from "applesauce-signers";
import { EventTemplate, NostrEvent } from "nostr-tools";
import { ConnectionState, EventSigner } from "rx-nostr";
import { BehaviorSubject } from "rxjs";
import { createDefer, Deferred } from "applesauce-core/promise";
import { unixNow } from "applesauce-core/helpers";
import * as Nostr from "nostr-typedef";

import accounts from "./accounts";
import { logger } from "../helpers/debug";
import localSettings from "./local-settings";

export type RelayAuthMode = "always" | "ask" | "never";

type HasChallenge = { template: EventTemplate; challenge: string };
export type RelayAuthDormantState = { status: "dormant" };
export type RelayAuthRequestedState = { status: "requested"; promise: Deferred<NostrEvent> } & HasChallenge;
export type RelayAuthSigningState = { status: "signing"; promise: Deferred<NostrEvent> };
export type RelayAuthRejectedState = { status: "rejected"; reason: string };
export type RelayAuthSuccessState = { status: "success" };

export type RelayAuthState =
  | RelayAuthDormantState
  | RelayAuthRequestedState
  | RelayAuthSigningState
  | RelayAuthRejectedState
  | RelayAuthSuccessState;

class AuthenticationSigner implements EventSigner {
  protected log = logger.extend("AuthenticationSigner");

  relayState$ = new BehaviorSubject<Record<string, RelayAuthState>>({});
  get relayState() {
    return this.relayState$.value;
  }

  protected get signer() {
    if (this.upstream instanceof BehaviorSubject) return this.upstream.value;
    else return this.upstream;
  }
  constructor(protected upstream: Nip07Interface | BehaviorSubject<Nip07Interface | undefined>) {}

  defaultMode: RelayAuthMode = "ask";
  relayMode = new Map<string, RelayAuthMode>();

  /** manually sign an authenticate request */
  authenticate(relay: string) {
    const state = this.getRelayState(relay);

    if (state?.status === "signing") return state.promise;

    // TODO: maybe throw here?
    if (state?.status !== "requested") return;

    const signer = this.signer;
    if (!signer) throw new Error("找不到签名器");

    const log = this.log.extend(relay);
    log(`正在请求签名`);

    const promise = createDefer<NostrEvent>();
    this.setRelayState(relay, { status: "signing", promise });

    // update status after signing is complete
    const request = state.promise;
    promise.then(
      (event) => {
        log(`与 ${relay} 进行认证`);
        this.setRelayState(relay, { status: "success" });
        request.resolve(event);
      },
      (err) => {
        if (err instanceof Error) {
          log(`失败 ${err.message}`);
          this.setRelayState(relay, { status: "rejected", reason: err.message });
        } else this.setRelayState(relay, { status: "rejected", reason: "Unknown" });

        request.reject(err);
      },
    );

    try {
      // start signing request
      const result = signer.signEvent(state.template);

      if (result instanceof Promise) {
        result.then(
          (event) => promise.resolve(event),
          (err) => promise.reject(err),
        );
      } else {
        promise.resolve(result);
      }
    } catch (error) {
      promise.reject(error);
    }
  }

  /** cancel a pending authentication request */
  cancel(relay: string) {
    const state = this.getRelayState(relay);
    if (!state) return;

    const log = this.log.extend(relay);
    log(`正在取消`);

    // reject the promise if it exists
    if (state.status === "requested" || state.status === "signing") state.promise.reject(new Error("已取消"));

    this.clearRelayState(relay);
  }

  getRelayState(relay: string): RelayAuthState | undefined {
    return this.relayState$.value[relay];
  }
  protected setRelayState(relay: string, state: RelayAuthState) {
    this.relayState$.next({ ...this.relayState$.value, [relay]: state });
  }
  protected clearRelayState(relay: string) {
    if (!this.relayState$.value[relay]) return;

    this.setRelayState(relay, { status: "dormant" });
  }

  protected getRelayAuthMode(relay: string): RelayAuthMode {
    return this.relayMode.get(relay) || this.defaultMode;
  }

  /** handle relay state changes */
  handleRelayConnectionState(packet: { from: string; state: ConnectionState }) {
    const from = new URL(packet.from).toString();

    // if the state is anything but connected, cancel any pending requests
    if (packet.state !== "connected") this.cancel(from);
  }

  /** intercept sign requests and save them for later */
  signEvent<K extends number>(draft: Nostr.EventParameters<K>): Promise<Nostr.Event<K>> {
    if (!draft.tags) throw new Error("缺少标签");

    let relay = draft.tags.find((t) => t[0] === "relay" && t[1])?.[1];
    if (!relay) throw new Error("缺少中继标签");

    // fix relay formatting
    relay = new URL(relay).toString();

    const log = this.log.extend(relay);

    log(`从 ${relay} 获取请求`);
    const mode = this.getRelayAuthMode(relay);

    // throw if mode is set to "never"
    if (mode === "never") {
      log(`自动拒绝中`);
      this.setRelayState(relay, { status: "rejected", reason: "已取消" });
      return Promise.reject(new Error("认证已拒绝"));
    }

    const challenge = draft.tags.find((t) => t[0] === "challenge" && t[1])?.[1];
    if (!challenge) throw new Error("缺少 challenge 标签");

    const promise = createDefer<NostrEvent>();

    // add to pending
    const template: EventTemplate = {
      tags: [],
      created_at: unixNow(),
      ...draft,
    };
    this.setRelayState(relay, { status: "requested", template, challenge, promise });

    // start the authentication process imminently if set to "always"
    if (mode === "always") {
      log(`自动认证中`);
      this.authenticate(relay);
    }

    // @ts-expect-error
    return promise;
  }

  async getPublicKey(): Promise<string> {
    if (!this.signer) throw new Error("找不到签名器");
    return await this.signer.getPublicKey();
  }
}

const authenticationSigner = new AuthenticationSigner(accounts.active$ as BehaviorSubject<Nip07Interface | undefined>);

// update signer based on local settings
localSettings.defaultAuthenticationMode.subscribe((mode) => (authenticationSigner.defaultMode = mode as RelayAuthMode));
localSettings.relayAuthenticationMode.subscribe((relays) => {
  authenticationSigner.relayMode.clear();

  for (const { relay, mode } of relays) {
    authenticationSigner.relayMode.set(relay, mode);
  }
});

export default authenticationSigner;
