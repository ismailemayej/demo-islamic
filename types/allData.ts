export interface Heading {
  title: string;
  subTitle: string;
}

export interface WebsiteData {
  section: string;
  heading: Heading;
  data: any;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UseSectionDataResult {
  data: WebsiteData | null;
  loading: boolean;
  error: string | null;
}
