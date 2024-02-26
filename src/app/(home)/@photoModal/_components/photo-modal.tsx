"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PhotoModalProps = {
  username: string;
  postId: string;
  photoIndex: string;
};

const PhotoModal = ({ username, postId, photoIndex }: PhotoModalProps) => {
  const router = useRouter();

  const onDismiss = () => {
    router.back();
  };
  return (
    <Modal isOpen={true} onClose={onDismiss}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              WIP
              <p>{photoIndex}</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default PhotoModal;
