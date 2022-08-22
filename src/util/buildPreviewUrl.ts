import { mapContentfulLocaleToUrlLocale } from "./locale";

export const buildPreviewUrl = ({
  locale,
  path,
  slug,
  website,
}: {
  locale: ContentfulLocale;
  path: string | null;
  slug: string | null;
  website: string;
}) => {
  if (!slug || !path) {
    return null;
  }

  const urlLocale = mapContentfulLocaleToUrlLocale(locale);
  const baseUrl = `${website}/api/preview?secret=3C9D16D6739915329F4B12F5EEE6B&slug=/${urlLocale}/expeditions/`;
  return `${baseUrl}${path}/${slug}`;
};
