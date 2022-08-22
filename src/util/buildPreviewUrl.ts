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

// http://nellie-dev.azurewebsites.net/api/preview?secret=3C9D16D6739915329F4B12F5EEE6B&slug=/{locale}/expeditions/{path}/{slug}
