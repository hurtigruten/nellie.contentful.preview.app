import { mapContentfulLocaleToUrlLocale } from "./locale";

export const buildPreviewUrl = ({
  locale,
  path,
  slug,
  urlPattern,
}: {
  locale: ContentfulLocale;
  path: string;
  slug: string;
  urlPattern: string;
}) => {
  const urlLocale = mapContentfulLocaleToUrlLocale(locale);
  return urlPattern
    .replace("{locale}", urlLocale)
    .replace("{path}", path)
    .replace("{slug}", slug);
};
