export const defaultUrlLocale = "en-au";

export const enabledLocales: ContentfulLocale[] = [
  "en-AU",
  "en-GB",
  "en-US",
  "de-DE",
  "gsw-CH",
];

export const getFallbackLocale = (
  contentfulLocale: ContentfulLocale
): ContentfulLocale => {
  switch (contentfulLocale) {
    case "en":
    case "en-AU":
    case "en-GB":
    case "en-US":
    case "de-DE":
      return "en";
    case "gsw-CH":
      return "de-DE";
    default:
      ((_: never) => _)(contentfulLocale);
      throw new Error(`Unrecognized contentful locale: ${contentfulLocale}`);
  }
};

export const mapContentfulLocaleToUrlLocale = (
  contentfulLocale: ContentfulLocale
): UrlLocale => {
  switch (contentfulLocale) {
    case "en":
      return defaultUrlLocale;
    case "en-AU":
      return "en-au";
    case "en-GB":
      return "en-gb";
    case "en-US":
      return "en-us";
    case "de-DE":
      return "de-de";
    case "gsw-CH":
      return "ch-de";
    default:
      ((_: never) => _)(contentfulLocale);
      throw new Error(`Unrecognized contentful locale: ${contentfulLocale}`);
  }
};
