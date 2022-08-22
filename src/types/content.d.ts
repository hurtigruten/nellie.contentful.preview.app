type ContentType =
  | "offerPage"
  | "destination"
  | "voyage"
  | "ship"
  | "excursion"
  | "program"
  | "inspirationArticle"
  | "campaign"
  | "campaignType2";

type ContentTypeConfiguration = {
  _id: number;
  contentId: string;
  path: string;
};

type InitialContentTypeConfiguration = Omit<ContentTypeConfiguration, "_id">;
