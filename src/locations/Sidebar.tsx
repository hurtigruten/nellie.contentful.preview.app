import {
  Button,
  Checkbox,
  FormLabel,
  NotificationItem,
  Paragraph,
  TextLink,
} from "@contentful/f36-components";
import { ExternalLinkIcon } from "@contentful/f36-icons";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { enabledLocales, getFallbackLocale } from "../util/locale";
import { useState } from "react";
import { buildPreviewUrl } from "../util/buildPreviewUrl";
import { isValidContentType } from "../util/typeguards/isValidContentType";
import { getSlug } from "../util/getSlug";
import { getPathForContentType } from "../util/getPathForContentType";

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();
  const [useLocalhost, setUseLocalhost] = useState(false);

  const appParameters: AppInstallationParameters = sdk.parameters.installation;
  const urlPattern = appParameters["urlPattern"] ?? "";
  const urlPatternForLocalhost = urlPattern.replace(
    /.*\/\/[^\/]*/,
    `http://localhost:${appParameters["localhostPort"] ?? 3000}`
  );

  const contentType = sdk.entry.getSys().contentType.sys.id;
  if (
    !isValidContentType(contentType, appParameters["supportedContentTypes"])
  ) {
    return (
      <Paragraph>
        Localized preview app has not been configured for {contentType}. Go to
        App Configuration to enable it.
      </Paragraph>
    );
  }

  const slugLocales = sdk.entry.fields["slug"].locales;
  const contentfulLocales = sdk.locales.available;
  const previewLocales = enabledLocales.filter((locale) => {
    const firstFallbackLocale = getFallbackLocale(locale);
    const secondFallbackLocale = getFallbackLocale(firstFallbackLocale);

    const slugHasLocaleOrFallback =
      slugLocales.includes(locale) ||
      slugLocales.includes(firstFallbackLocale) ||
      slugLocales.includes(secondFallbackLocale);

    return contentfulLocales.includes(locale) && slugHasLocaleOrFallback;
  });

  const previewUrls = previewLocales
    .map((locale) =>
      buildPreviewUrl({
        locale,
        path: getPathForContentType(
          contentType,
          appParameters["supportedContentTypes"]
        ),
        slug: getSlug(sdk, locale),
        urlPattern: useLocalhost ? urlPatternForLocalhost : urlPattern,
      })
    )
    .filter(Boolean);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {!urlPattern && (
          <NotificationItem variant="negative">
            Preview URL pattern has not been configured.
          </NotificationItem>
        )}
        {previewLocales.map((locale, i) => (
          <Button>
            <TextLink
              title={!previewUrls[i] ? "Missing slug" : "Preview"}
              isDisabled={!urlPattern || !previewUrls[i]}
              icon={<ExternalLinkIcon />}
              alignIcon="end"
              href={previewUrls[i] ?? ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale}
            </TextLink>
          </Button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <FormLabel>Preview on localhost</FormLabel>
        <Checkbox
          isChecked={useLocalhost}
          onChange={() => setUseLocalhost(!useLocalhost)}
        ></Checkbox>
      </div>
    </>
  );
};

export default Sidebar;
