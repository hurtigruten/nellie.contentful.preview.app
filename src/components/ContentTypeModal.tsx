import {
  Button,
  Flex,
  Form,
  FormLabel,
  Modal,
  TextInput,
} from "@contentful/f36-components";
import { useEffect, useState } from "react";

interface ContentTypeModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  contentType: InitialContentTypeConfiguration | null;
  onDone: (ct: InitialContentTypeConfiguration) => void;
}

const ContentTypeModal = ({
  isModalVisible,
  setIsModalVisible,
  contentType,
  onDone,
}: ContentTypeModalProps) => {
  const isAddModal = contentType === null;
  const [currentContentType, setCurrentContentType] =
    useState<InitialContentTypeConfiguration>(
      contentType ?? { contentId: "", path: "" }
    );

  useEffect(() => {
    setCurrentContentType(contentType ?? { contentId: "", path: "" });
  }, [contentType]);

  return (
    <Modal onClose={() => setIsModalVisible(false)} isShown={isModalVisible}>
      <>
        <Modal.Header
          title={
            contentType === null ? "Add content type" : "Edit content type"
          }
          onClose={() => setIsModalVisible(false)}
        />
        <Modal.Content>
          <Form>
            <Flex flexDirection="column" gap="spacingM">
              <div>
                <FormLabel>Content type</FormLabel>
                <TextInput
                  value={currentContentType?.contentId}
                  onChange={(e) =>
                    setCurrentContentType({
                      path: currentContentType?.path ?? "",
                      contentId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>Path</FormLabel>
                <TextInput
                  value={currentContentType?.path}
                  onChange={(e) =>
                    setCurrentContentType({
                      path: e.target.value,
                      contentId: currentContentType?.contentId ?? "",
                    })
                  }
                />
              </div>
              <Flex flexDirection="row" gap="spacingM">
                <Button
                  isDisabled={
                    !currentContentType?.contentId || !currentContentType?.path
                  }
                  onClick={() => onDone(currentContentType!)}
                >
                  {isAddModal ? "Add" : "Done"}
                </Button>
                <Button
                  onClick={() => setIsModalVisible(false)}
                  variant="negative"
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Modal.Content>
      </>
    </Modal>
  );
};

export default ContentTypeModal;
