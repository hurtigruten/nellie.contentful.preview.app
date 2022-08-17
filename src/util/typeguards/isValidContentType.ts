const validContentTypes: ContentType[] = [
  "offerPage",
  "destination",
  "voyage",
  "ship",
  "excursion",
  "program",
  "inspirationArticle",
  "campaign",
  "campaignType2",
];

export const isValidContentType = (
  contentType: any
): contentType is ContentType => validContentTypes.includes(contentType);
