import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { getFallbackLocale } from "./locale";

// Locale may not be present for the slug - but one of its fallbacks may be.
export const getSlug = (sdk: SidebarExtensionSDK, locale: ContentfulLocale) => {
  const locales = [
    locale,
    getFallbackLocale(locale),
    getFallbackLocale(getFallbackLocale(locale)),
  ];

  for (const locale_ of locales) {
    if (!sdk.entry.fields["slug"].locales.includes(locale_)) {
      continue;
    }

    const slug = sdk.entry.fields["slug"].getForLocale(locale_).getValue();
    if (!slug) {
      continue;
    }

    return slug;
  }

  return null;
};
