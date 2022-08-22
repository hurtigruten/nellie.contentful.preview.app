import React, { useCallback, useState, useEffect } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  FormLabel,
  TextInput,
  EntityList,
  MenuSectionTitle,
  MenuItem,
  Button,
} from "@contentful/f36-components";
import { css } from "emotion";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import ContentTypeModal from "../components/ContentTypeModal";

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    targetWebsite: "",
    localhostPort: 3000,
    supportedContentTypes: [],
  });
  const sdk = useSDK<AppExtensionSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentContentType, setCurrentContentType] = useState<{
    _id: number;
    contentId: string;
    path: string;
  } | null>(null);

  const openAddNewModal = () => {
    setCurrentContentType(null);
    setIsModalVisible(true);
  };

  const openEditModal = (ct: ContentTypeConfiguration) => {
    setCurrentContentType(ct);
    setIsModalVisible(true);
  };

  const deleteContentType = (id: number) =>
    setParameters({
      ...parameters,
      supportedContentTypes:
        parameters.supportedContentTypes?.filter(({ _id }) => _id !== id) ?? [],
    });

  const addOrEditContentType = (ct: InitialContentTypeConfiguration) => {
    const isContentTypeAdded = currentContentType === null;
    const oldContentTypes = isContentTypeAdded
      ? parameters.supportedContentTypes ?? []
      : parameters.supportedContentTypes?.filter(
          ({ _id }) => _id !== currentContentType._id
        ) ?? [];

    const latestId =
      Math.max(
        ...(parameters.supportedContentTypes?.map(({ _id }) => _id) ?? [0])
      ) + 1;
    const _id = isContentTypeAdded ? latestId : currentContentType._id;
    const newCt: ContentTypeConfiguration = { ...ct, _id };

    setParameters({
      ...parameters,
      supportedContentTypes: [...oldContentTypes, newCt],
    });
    console.log([...oldContentTypes, newCt]);

    setIsModalVisible(false);
  };

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <ContentTypeModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        contentType={currentContentType}
        onDone={addOrEditContentType}
      />
      <Form>
        <Flex flexDirection="column" gap="spacingS">
          <Heading>Localized preview</Heading>
          <Paragraph>
            Adds a preview button for each active locale to entries
          </Paragraph>
          <FormLabel>Target website</FormLabel>
          <TextInput
            value={parameters.targetWebsite}
            placeholder="https://nellie-dev.azurewebsites.net"
            onChange={(e) =>
              setParameters({ ...parameters, targetWebsite: e.target.value })
            }
          />
          <FormLabel>Localhost port</FormLabel>
          <TextInput
            value={parameters.localhostPort?.toString()}
            placeholder="3000"
            onChange={(e) =>
              setParameters({
                ...parameters,
                localhostPort: Number(e.target.value),
              })
            }
          />
          <Flex flexDirection="column" gap="spacingS">
            <FormLabel>Configure content types</FormLabel>
            {!parameters.supportedContentTypes?.length && (
              <Paragraph>No content types added (yet!)</Paragraph>
            )}
            {!!parameters.supportedContentTypes?.length && (
              <EntityList>
                {parameters.supportedContentTypes.map((ct) => (
                  <EntityList.Item
                    title={ct.contentId}
                    description={`Path: ${ct.path}`}
                    actions={[
                      <MenuSectionTitle key="title">Actions</MenuSectionTitle>,
                      <MenuItem onClick={() => openEditModal(ct)} key="edit">
                        Edit
                      </MenuItem>,
                      <MenuItem
                        onClick={() => deleteContentType(ct._id)}
                        key="remove"
                      >
                        Remove
                      </MenuItem>,
                    ]}
                  />
                ))}
              </EntityList>
            )}
            <Button onClick={openAddNewModal}>Add new content type</Button>
          </Flex>
        </Flex>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
