import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDraggable,
} from "@heroui/react";
import { Divider } from "antd";
import { useRef } from "react";

import sanitizeHtml from "sanitize-html";
export default function ExplainModal({
  isOpen,
  onOpenChange,
  questionExplanation,
  questionAnswer,
}) {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <div className="">
      <Modal
        ref={targetRef}
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                <p className="text-center font-6xl solaimanlipi">
                  প্রশ্নের ব্যাখ্যা/উত্তর
                </p>
              </ModalHeader>
              <ModalBody>
                <p className="solaimanlipi text-xl font-semibold flex-row">
                  উত্তর:{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(questionAnswer || ""),
                    }}
                  />
                  <Divider />
                  <p className="solaimanlipi text-xl font-semibold flex-row">
                    ব্যাখ্যা:{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(questionExplanation || ""),
                      }}
                    />
                  </p>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  <p className="solaimanlipi text-xl">বন্ধ করুন</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
