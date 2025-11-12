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
