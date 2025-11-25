import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
// 📁 src/types/section.ts

export interface Heading {
  title: string;
  subTitle?: string;
}

export interface SectionData<T = any> {
  heading?: Heading;
  data?: T;
  moreVideosUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  groupedData?: Record<string, SectionData<T>>;
}
export interface HeroSection {
  heading: string;
  subheading: string;
  image: string;
}

export interface AboutSection {
  heading: string;
  description: string;
  image: string;
}

export interface WebsiteData {
  herosection: HeroSection;
  aboutsection: AboutSection;
  videosection: any;
  socialsection: any;
  educationsection: any;
  achievementsection: any;
  photosection: any;
  testimonialsection: any;
  certificatesection: any;
  contactsection: any;
  teamsection: any;
  organizationsection: any;
}
