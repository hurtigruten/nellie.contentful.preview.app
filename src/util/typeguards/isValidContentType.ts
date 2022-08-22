export const isValidContentType = (
  contentTypeId: string,
  supportedContentTypes: AppInstallationParameters["supportedContentTypes"]
) => !!supportedContentTypes?.map((s) => s.contentId).includes(contentTypeId);
