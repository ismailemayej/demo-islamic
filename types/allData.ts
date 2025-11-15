import exp from "constants";

export interface Heading {
  title: string;
  subTitle: string;
}

export interface WebsiteData {
  section: string;
  heading: Heading;
  data: any;
  _id?: string;
  moreVideosUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UseSectionDataResult {
  data: WebsiteData | null;
  loading: boolean;
  error: string | null;
}
// Common heading structure
export interface Heading {
  title: string;
  subTitle: string;
}

// Blog Section
export interface BlogData {
  id: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

export interface BlogSection {
  heading: Heading;
  _id: string;
  section: "blogsection";
  data: BlogData[];
  updatedAt: string;
}

// Gallery Section
export interface GalleryData {
  id: number;
  title: string;
  image: string;
}

export interface GallerySection {
  heading: Heading;
  _id: string;
  section: "gallerysection";
  data: GalleryData[];
  updatedAt: string;
}

// Website Section
export interface WebsiteData {
  ownerName: string;
  description: string;
  profileImage: string;
}

export interface WebsiteSection {
  _id: string;
  section: "websitesection";
  data: WebsiteData;
  updatedAt: string;
}

// Organization Section
export interface OrganizationData {
  id: number;
  possition: string;
  name: string;
  address: string;
  img: string;
  details: string;
}

export interface OrganizationSection {
  heading: Heading;
  _id: string;
  section: "organizationsection";
  data: OrganizationData[];
  updatedAt: string;
}

// Achievement Section
export interface AchievementData {
  id: number;
  title: string;
  year?: string;
  count: number;
  icon: string;
}

export interface AchievementSection {
  heading: Heading;
  _id: string;
  section: "achievementsection";
  data: AchievementData[];
  updatedAt: string;
}

// Hero Section
export interface HeroData {
  title: string;
  subTitle: string;
  description: string;
  buttonText: string;
  image: string;
}

export interface HeroSection {
  _id: string;
  section: "herosection";
  data: HeroData;
  updatedAt: string;
}

// Certificate Section
interface CertificateData {
  id: number | string;
  degree: string;
  institution: string;
  board: string;
  year: string;
  gpa: string;
}

export interface CertificateSection {
  heading: Heading;
  _id: string;
  section: "certificatesection";
  data: CertificateData[];
  updatedAt: string;
}

// YouTube Video Section
export interface VideoData {
  id: number;
  title: string;
  url: string;
}

export interface YoutubeVideoSection {
  heading: Heading;
  _id: string;
  section: "youtubevideosection";
  data: VideoData[];
  morevideourl?: string;
  updatedAt: string;
}

// About Section
export interface AboutData {
  title: string;
  description: string;
  image: string;
}

export interface AboutSectionData {
  heading: Heading;
  _id: string;
  section: "aboutsection";
  data: AboutData;
  updatedAt: string;
}

// Contact Section
export interface ContactData {
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}

export interface ContactSection {
  heading: Heading;
  _id: string;
  section: "contactsection";
  data: ContactData;
  updatedAt: string;
}

// Program Section
export interface ProgramData {
  id: number;
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

export interface ProgramSection {
  heading: Heading;
  _id: string;
  section: "programsection";
  data: ProgramData[];
  updatedAt: string;
}

// Union type for all sections
export type Section =
  | BlogSection
  | GallerySection
  | WebsiteSection
  | OrganizationSection
  | AchievementSection
  | HeroSection
  | CertificateSection
  | YoutubeVideoSection
  | AboutSectionData
  | ContactSection
  | ProgramSection;

// Example JSON would be typed as:
const sections: Section[] = [
  /* your JSON data here */
];
