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
import { ScrollShadow } from "@heroui/scroll-shadow";

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
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size={size}
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[92vh]", // Modal মোট উচ্চতা বাড়ানো হল
      }}
    >
      <ModalContent
        className="bg-gradient-to-br 
          from-blue-50 via-cyan-50 to-blue-100
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        {() => (
          <>
            {/* Header - সবসময় পুরো দেখা যাবে */}
            <ModalHeader className="px-4 pt-4 pb-2">
              <h3 className="text-xl font-bold bangla dark:text-white whitespace-normal">
                {title}
              </h3>
            </ModalHeader>

            {/* ScrollArea শুধুমাত্র Body অংশ */}
            <ModalBody className="px-2">
              <ScrollShadow hideScrollBar={false} className="max-h-[65vh] pr-1">
                {children}
              </ScrollShadow>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="px-4">
              <button onClick={onClose}>Close</button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
