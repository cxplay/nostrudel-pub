import { useCallback } from "react";
import { Button, Card, CardBody, CardHeader, CardProps, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useActiveAccount, useObservable } from "applesauce-react/hooks";
import { getEventUID } from "applesauce-core/helpers";
import { kinds, NostrEvent } from "nostr-tools";

import KeyboardShortcut from "../../../components/keyboard-shortcut";
import NotificationItem from "../../notifications/components/notification-item";
import { ErrorBoundary } from "../../../components/error-boundary";
import notifications$, { NotificationType, NotificationTypeSymbol } from "../../../services/notifications";
import useSimpleSubscription from "../../../hooks/use-forward-subscription";
import useUserMailboxes from "../../../hooks/use-user-mailboxes";
import { useReadRelays } from "../../../hooks/use-client-relays";

export default function NotificationsCard({ ...props }: Omit<CardProps, "children">) {
  const navigate = useNavigate();

  const account = useActiveAccount();
  const mailboxes = useUserMailboxes(account?.pubkey);
  const readRelays = useReadRelays(mailboxes?.inboxes);
  useSimpleSubscription(
    readRelays,
    account
      ? {
          "#p": [account.pubkey],
          kinds: [
            kinds.ShortTextNote,
            kinds.Repost,
            kinds.GenericRepost,
            kinds.Reaction,
            kinds.Zap,
            kinds.LongFormArticle,
            kinds.EncryptedDirectMessage,
          ],
        }
      : undefined,
  );

  const events =
    useObservable(notifications$)?.filter(
      (event) =>
        event[NotificationTypeSymbol] === NotificationType.Mention ||
        event[NotificationTypeSymbol] === NotificationType.Reply ||
        event[NotificationTypeSymbol] === NotificationType.Zap,
    ) ?? [];

  const limit = events.length > 20 ? events.slice(0, 20) : events;

  const handleClick = useCallback(
    (event: NostrEvent) => {
      navigate("/notifications", { state: { focused: event.id } });
    },
    [navigate],
  );

  return (
    <Card variant="outline" {...props}>
      <CardHeader display="flex" justifyContent="space-between" alignItems="center" pb="2">
        <Heading size="lg">
          <Link as={RouterLink} to="/notifications">
            通知
          </Link>
        </Heading>
        <KeyboardShortcut letter="i" requireMeta ml="auto" onPress={() => navigate("/notifications")} />
      </CardHeader>
      <CardBody overflowX="hidden" overflowY="auto" pt="4" display="flex" flexDirection="column">
        {limit.map((event) => (
          <ErrorBoundary key={getEventUID(event)} event={event}>
            <NotificationItem event={event} onClick={handleClick} visible />
          </ErrorBoundary>
        ))}
        <Button as={RouterLink} to="/notifications" flexShrink={0} variant="link" size="lg" py="4">
          查看更多
        </Button>
      </CardBody>
    </Card>
  );
}
