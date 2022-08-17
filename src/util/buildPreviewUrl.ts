import { mapContentfulLocaleToUrlLocale } from "./locale";

export const buildPreviewUrl = ({
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
    case "destination":
      path = "destinations/";
      break;
    case "campaign":
    case "campaignType2":
      path = "campaigns/";
      break;
    case "voyage":
      path = "cruises/";
      break;
    case "excursion":
    case "program":
      path = "enhance-your-cruise/catalog/";
      break;
    case "ship":
      path = "ships/";
      break;
    case "inspirationArticle":
      path = "stories/";
      break;
    default:
      ((_: never) => _)(contentType);
      throw new Error(`Unrecognized content type ${contentType}`);
  }

  return baseUrl + path + slug;
};
