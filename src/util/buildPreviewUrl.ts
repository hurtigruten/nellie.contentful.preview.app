import { mapContentfulLocaleToUrlLocale } from "./locale";

export const buildPreviewUrl = ({
  locale,
  path,
  slug,
  urlPattern,
}: {
  locale: ContentfulLocale;
  path: string | null;
  slug: string | null;
  urlPattern: string;
}) => {
  if (!slug || !path) {
    return null;
  }

  const urlLocale = mapContentfulLocaleToUrlLocale(locale);
  return urlPattern
    .replace("{locale}", urlLocale)
    .replace("{path}", path)
    .replace("{slug}", slug);
};
