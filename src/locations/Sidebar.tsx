import {
  Button,
  Checkbox,
  FormLabel,
  Paragraph,
  TextLink,
} from "@contentful/f36-components";
import { ExternalLinkIcon } from "@contentful/f36-icons";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import {
  enabledLocales,
  getFallbackLocale,
  mapContentfulLocaleToUrlLocale,
} from "../util/locale";
import { useState } from "react";

type ContentType = "offerPage";

const validContentTypes: ContentType[] = ["offerPage"];
const isValidContentType = (contentType: any): contentType is ContentType =>
  validContentTypes.includes(contentType);

const getUrl = ({
  locale,
  contentType,
  slug,
  website,
}: {
  locale: ContentfulLocale;
  contentType: ContentType;
  slug: string;
  website: string;
}) => {
  if (!slug) {
    return null;
  }

  const urlLocale = mapContentfulLocaleToUrlLocale(locale);
  const baseUrl = `${website}/api/preview?secret=3C9D16D6739915329F4B12F5EEE6B&slug=/${urlLocale}/expeditions/`;

  let path = "";
  switch (contentType) {
    case "offerPage":
      path = "offers/";
      break;
    default:
      ((_: never) => _)(contentType);
      throw new Error(`Unrecognized content type ${contentType}`);
  }

  return baseUrl + path + slug;
};

const getSlug = (sdk: SidebarExtensionSDK, locale: ContentfulLocale) =>
  sdk.entry.fields["slug"].getForLocale(locale).getValue() ||
  sdk.entry.fields["slug"].getForLocale(getFallbackLocale(locale)).getValue() ||
  sdk.entry.fields["slug"]
    .getForLocale(getFallbackLocale(getFallbackLocale(locale)))
    .getValue() ||
  "";

const Sidebar = () => {
  const nellieDev = "https://nellie-dev.azurewebsites.net";
  const localhost = "http://localhost:3000";

  const [website, setWebsite] = useState(nellieDev);
  const sdk = useSDK<SidebarExtensionSDK>();

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
  const previewLocales = enabledLocales.filter((locale) =>
    contentfulLocales.includes(locale)
  );
  const previewUrls = previewLocales.map((locale) =>
    getUrl({ locale, contentType, slug: getSlug(sdk, locale), website })
  );

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {previewLocales.map((locale, i) => (
          <Button>
            <TextLink
              title={!previewUrls[i] ? "Missing slug" : "Preview"}
              isDisabled={!previewUrls[i]}
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
        <FormLabel>Preview locally</FormLabel>
        <Checkbox
          onChange={() =>
            website === localhost
              ? setWebsite(nellieDev)
              : setWebsite(localhost)
          }
        ></Checkbox>
      </div>
    </>
  );
};

export default Sidebar;
