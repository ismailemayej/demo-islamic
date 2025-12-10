"use client";

import dynamic from "next/dynamic";
import { WebsiteData } from "@/types/allData";
import Loader from "../loader";

// Dynamic imports for sections
const HeroSection = dynamic(
  () => import("./HeroSection").then((mod) => mod.HeroSection),
  { loading: () => <Loader /> }
);
const AboutSection = dynamic(
  () => import("./About").then((mod) => mod.AboutSection),
  { loading: () => <Loader /> }
);
const RecentProgramsSection = dynamic(
  () => import("./LastProggram").then((mod) => mod.RecentProgramsSection),
  { loading: () => <Loader /> }
);
const YouTubeVideosSection = dynamic(
  () => import("./YTvideos").then((mod) => mod.YouTubeVideosSection),
  { loading: () => <Loader /> }
);
const SocialMediaSection = dynamic(
  () => import("./SocialMedia").then((mod) => mod.SocialMediaSection),
  { loading: () => <Loader /> }
);
const ServiceSection = dynamic(
  () => import("./Services").then((mod) => mod.ServiceSection),
  { loading: () => <Loader /> }
);
const GallerySection = dynamic(
  () => import("./Gellery").then((mod) => mod.GallerySection),
  { loading: () => <Loader /> }
);
const ContactSection = dynamic(
  () => import("./Contact").then((mod) => mod.ContactSection),
  { loading: () => <Loader /> }
);
const OrganizationSection = dynamic(
  () => import("./Organization").then((mod) => mod.OrganizationSection),
  { loading: () => <Loader /> }
);
const BookSection = dynamic(
  () => import("./Books").then((mod) => mod.BookSection),
  { loading: () => <Loader /> }
);
const TestimonialsSection = dynamic(
  () => import("./Testimonials").then((mod) => mod.TestimonialsSection),
  { loading: () => <Loader /> }
);
const EducationSection = dynamic(
  () => import("./Education").then((mod) => mod.EducationSection),
  { loading: () => <Loader /> }
);
const AchievementsSection = dynamic(
  () => import("./Achievements").then((mod) => mod.AchievementsSection),
  { loading: () => <Loader /> }
);
const ArticlesSection = dynamic(
  () => import("./Blog").then((mod) => mod.ArticlesSection),
  { loading: () => <Loader /> }
);
const CertificateSection = dynamic(
  () => import("./Certificate").then((mod) => mod.CertificateSection),
  { loading: () => <Loader /> }
);
const TeamSection = dynamic(
  () => import("./Team").then((mod) => mod.TeamSection),
  { loading: () => <Loader /> }
);
const SkillsSection = dynamic(
  () => import("./Skills").then((mod) => mod.default),
  { loading: () => <Loader /> }
);
const AppointmentSection = dynamic(
  () => import("./Booking").then((mod) => mod.AppointmentSection),
  { loading: () => <Loader /> }
);

import ChatWrapper from "../chat/chatwraper";

export default function Main({ data }: { data: WebsiteData[] }) {
  const getSection = (name: string) =>
    data.find((item) => item.section === name);
  if (!data) return <Loader />;

  return (
    <main className="flex flex-col lg:gap-5 gap-2 w-full container mx-auto font-sans">
      <ChatWrapper />

      <section className="w-full">
        <HeroSection section={getSection("herosection")?.data} />
      </section>

      <section className="w-full">
        <AboutSection section={getSection("aboutsection")} />
      </section>

      <section className="w-full">
        <RecentProgramsSection section={getSection("programsection")} />
      </section>

      <section className="w-full">
        <YouTubeVideosSection data={getSection("youtubevideosection")} />
      </section>

      <section className="w-full">
        <SocialMediaSection section={getSection("socialmediasection")} />
      </section>

      <section className="w-full">
        <ServiceSection section={getSection("servicesection")} />
      </section>

      <section className="w-full">
        <GallerySection section={getSection("gallerysection")} />
      </section>

      <section className="w-full">
        <ContactSection section={getSection("contactsection")} />
      </section>

      <section className="w-full">
        <OrganizationSection section={getSection("organizationsection")} />
      </section>

      <section className="w-full">
        <BookSection section={getSection("booksection")} />
      </section>

      <section className="w-full">
        <TestimonialsSection section={getSection("testimonialsection")} />
      </section>

      <section className="w-full">
        <EducationSection section={getSection("educationsection")} />
      </section>

      <section className="w-full">
        <AchievementsSection section={getSection("achievementsection")} />
      </section>

      <section className="w-full">
        <ArticlesSection section={getSection("blogsection")} />
      </section>

      <section className="w-full">
        <CertificateSection section={getSection("certificatesection")} />
      </section>

      <section className="w-full">
        <TeamSection section={getSection("teamsection")} />
      </section>

      <SkillsSection section={getSection("skillsection")} />

      <section className="w-full">
        <AppointmentSection />
      </section>
    </main>
  );
}
