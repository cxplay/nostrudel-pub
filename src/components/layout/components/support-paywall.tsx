import { useObservableState } from "applesauce-react/hooks";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { unixNow } from "applesauce-core/helpers";
import { useMatch } from "react-router-dom";
import { PAYWALL_MESSAGE } from "../../../env";
import { hidePaywall, paywall } from "../../../services/paywall";
import { LightningIcon } from "../../icons";
import RouterLink from "../../router-link";

export default function SupportPaywall() {
  const isSupportPage = useMatch("/support");
  const paid = useObservableState(paywall);

  const dismiss = () => {
    hidePaywall.next(unixNow() + 60 * 60 * 24);
  };

  if (!paid && !isSupportPage)
    return (
      <Modal isOpen={!paid} onClose={dismiss} size="lg" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>支持该应用</ModalHeader>
          <ModalBody>
            {PAYWALL_MESSAGE || "如果你喜欢这款应用, 请考虑通过捐赠一些聪(Sat)来支持开发者."}
          </ModalBody>

          <ModalFooter gap="2">
            <Button variant="link" px="4" py="2" onClick={dismiss}>
              Dismiss for a day
            </Button>
            <Button
              colorScheme="primary"
              as={RouterLink}
              to="/support"
              leftIcon={<LightningIcon color="yellow.400" boxSize={5} />}
            >
              支持
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  else return null;
}
