import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTopicUpdateMutation } from "../../../../redux/api/slices/topicsSlice";
export default function UpdateTopicModal({ isOpen2, onOpenChange2, topic }) {
  const [topicsName, setTopicsName] = useState("");
  const [topicUpdate, { isLoading }] = useTopicUpdateMutation();

  useEffect(() => {
    if (topic) {
      setTopicsName(topic?.topicsName);
    }
  }, [topic]);

  const handleUpdate = async () => {
    const updateData = { topicsName };
    try {
      const res = await topicUpdate({ updateData, topicId: topic?._id });
      console.log("res", res);
      if (res?.data) {
        Swal.fire({
          title: "Updated!",
          text: "Topic updated successfully.",
          icon: "success",
        });
        onOpenChange2(false);
      } else {
        Swal.fire({
          title: "Error",
          text: res?.error?.data?.message || res?.error?.error,
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    }
  };
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen2}
      onOpenChange={onOpenChange2}
    >
      <ModalContent>
        <ModalHeader>Edit Topic</ModalHeader>
        <ModalBody>
          <Input
            label="Topic Name"
            value={topicsName}
            onChange={(e) => setTopicsName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => onOpenChange2(false)}
          >
            Cancel
          </Button>
          <Button isLoading={isLoading} color="success" onPress={handleUpdate}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
