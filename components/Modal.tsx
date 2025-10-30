"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface ReusableModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const OpenModal: React.FC<ReusableModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  size = "md",
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size={size}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h3 className="text-xl font-bold bangla">{title}</h3>
            </ModalHeader>
            <ModalBody className="bangla">{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
