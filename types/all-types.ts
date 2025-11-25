export interface THeroSection {
  title: string;
  subTitle: string;
  description: string;
  image: string;
}

export interface VideoItem {
  title: string;
  url: string;
}

export interface TVideoSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: VideoItem[];
  moreVideosUrl?: string;
}
export interface SocialMediaItem {
  id: number;
  name: string;
  iconName: string;
  url: string;
}

export interface TSocialMediaSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: SocialMediaItem[];
}
export interface RecentProgramItem {
  id: number;
  image: string;
  programName: string;
  date: string;
  name: string;
  day: string;
  location: string;
}

export interface TProgramSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: RecentProgramItem[];
}
export interface PhotoItem {
  image: string;
  title: string;
  id: number;
}

export interface TPhotoSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: PhotoItem[];
}

export interface OrganizationItem {
  id: number;
  name: string;
  possition: string;
  address: string;
  img: string;
  details: string;
}

export interface TOrganizationSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: OrganizationItem[];
}
export interface BookItem {
  productImage: string;
  title: string;
  authorName: string;
  publishedDate: string;
  describtion: string;
  price: string;
  link: string;
}

export interface TBookSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: BookItem[];
}
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  comment: string;
  image?: string;
}

export interface TTestimonialsSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: TestimonialItem[];
}
export interface EducationItem {
  id: number;
  examName: string;
  institution: string;
  year: string;
  result: string;
  duration: string;
}

export interface TEducationSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: EducationItem[];
}
export interface AchievementItem {
  id: string;
  title: string;
  count: number;
  icon: string;
}

export interface TAchievementsSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: AchievementItem[];
}
export interface ArticleItem {
  id: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

export interface TArticlesSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: ArticleItem[];
}
export interface CertificateItem {
  degree?: string;
  institution?: string;
  board?: string;
  year?: string;
  gpa?: string;
}

export interface TCertificateSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: CertificateItem[];
}
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  imageurl: string;
  number: string;
}

export interface TTeamSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: TeamMember[];
}
export interface BookingItem {
  orginalPrice: string;
  salePrice: string;
  name: string;
  times: string;
}

export interface TBookingSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: BookingItem[];
}
export interface ServiceItem {
  id: string;
  icon: string;
  image: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

export interface TServiceSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: ServiceItem[];
}
