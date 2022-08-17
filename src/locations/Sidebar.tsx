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

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();

  const previewBaseUrl = sdk.parameters.installation["targetWebsite"] ?? "";
  const localhostUrl = `http://localhost:${
    sdk.parameters.installation["localhostPort"] ?? "3000"
  }`;
  const slugLocales = sdk.entry.fields["slug"].locales;
  const numberOfPopulatedSlugs = slugLocales
    .map((l) => sdk.entry.fields["slug"].getForLocale(l).getValue())
    .filter(Boolean).length;
  const slugHasLocalizedValues = numberOfPopulatedSlugs > 1;

  const [website, setWebsite] = useState(previewBaseUrl);
  const [isFallbackEnabled, setIsFallbackEnabled] = useState(
    !slugHasLocalizedValues
  );

  const contentType = sdk.entry.getSys().contentType.sys.id;
  if (!isValidContentType(contentType)) {
    return (
      <Paragraph>
        Localized preview app has not been configured for {contentType}. Please
        contact a developer to enable it.
      </Paragraph>
    );
  }

  const contentfulLocales = sdk.locales.available;
  const previewLocales = enabledLocales.filter((locale) => {
    const firstFallbackLocale = getFallbackLocale(locale);
    const secondFallbackLocale = getFallbackLocale(firstFallbackLocale);

    if (!isFallbackEnabled) {
      return (
        contentfulLocales.includes(locale) &&
        slugLocales.includes(locale) &&
        sdk.entry.fields["slug"].getForLocale(locale).getValue()
      );
    }

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
        contentType,
        slug: getSlug(sdk, locale),
        website,
      })
    )
    .filter(Boolean);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {!previewBaseUrl && (
          <NotificationItem variant="negative">
            Preview website has not been configured.
          </NotificationItem>
        )}
        {previewLocales.map((locale, i) => (
          <Button>
            <TextLink
              title={!previewUrls[i] ? "Missing slug" : "Preview"}
              isDisabled={!previewBaseUrl || !previewUrls[i]}
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
          onChange={() =>
            website === localhostUrl
              ? setWebsite(previewBaseUrl)
              : setWebsite(localhostUrl)
          }
        ></Checkbox>
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <FormLabel>Use fallback for slug</FormLabel>
        <Checkbox
          isChecked={isFallbackEnabled}
          onChange={() => setIsFallbackEnabled(!isFallbackEnabled)}
        ></Checkbox>
      </div>
    </>
  );
};

export default Sidebar;
