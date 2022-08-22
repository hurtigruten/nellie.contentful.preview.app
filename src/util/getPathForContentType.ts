export const getPathForContentType = (
  contentTypeId: string,
  supportedContentTypes: AppInstallationParameters["supportedContentTypes"]
) => {
  const contentTypeConfig = supportedContentTypes?.find(
    (ct) => ct.contentId === contentTypeId
  );
  if (!contentTypeConfig) {
    return null;
  }
  return contentTypeConfig.path;
};
