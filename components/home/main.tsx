"use client";
import { WebsiteData } from "@/types/allData";
import { AboutSection } from "./About";
import { AchievementsSection } from "./Achievements";
import { ArticlesSection } from "./Blog";
import { AppointmentSection } from "./Booking";
import { BookSection } from "./Books";
import { CertificateSection } from "./Certificate";
import { ContactSection } from "./Contact";
import { EducationSection } from "./Education";
import { GallerySection } from "./Gellery";
import { HeroSection } from "./HeroSection";
import { RecentProgramsSection } from "./LastProggram";
import { OrganizationSection } from "./Organization";
import { ServiceSection } from "./Services";
import { SocialMediaSection } from "./SocialMedia";
import { TeamSection } from "./Team";
import { TestimonialsSection } from "./Testimonials";
import { YouTubeVideosSection } from "./YTvideos";
import Loader from "../loader";
import SkillsSection from "./Skills";
import ChatWrapper from "../chat/chatwraper";
export default function Main({ data }: { data: WebsiteData[] }) {
  // Helper method → any section data
  const getSection = (name: string) =>
    data.find((item) => item.section === name);
  if (!data) return <Loader />;

  return (
    <main className="flex flex-col lg:gap-5 gap-2 w-full container mx-auto font-sans">
      <ChatWrapper />
      {/* Hero */}
      <section className="w-full">
        <HeroSection section={getSection("herosection")?.data} />
      </section>
      {/* About */}
      <section className="w-full">
        <AboutSection section={getSection("aboutsection")} />
      </section>
      {/* Programs */}
      <section className="w-full">
        <RecentProgramsSection section={getSection("programsection")} />
      </section>
      {/* YouTube */}
      <section className="w-full">
        <YouTubeVideosSection data={getSection("youtubevideosection")} />
      </section>
      {/* Social Media */}
      <section className="w-full">
        <SocialMediaSection section={getSection("socialmediasection")} />
      </section>
      {/* Services */}
      <section className="w-full">
        <ServiceSection section={getSection("servicesection")} />
      </section>
      {/* Gallery */}
      <section className="w-full">
        <GallerySection section={getSection("gallerysection")} />
      </section>
      {/* Contact */}
      <section className="w-full">
        <ContactSection section={getSection("contactsection")} />
      </section>
      {/* Organization */}
      <section className="w-full">
        <OrganizationSection section={getSection("organizationsection")} />
      </section>
      {/* Books */}
      <section className="w-full">
        <BookSection section={getSection("booksection")} />
      </section>
      {/* Testimonials */}
      <section className="w-full">
        <TestimonialsSection section={getSection("testimonialsection")} />
      </section>
      {/* Education */}
      <section className="w-full">
        <EducationSection section={getSection("educationsection")} />
      </section>
      {/* Achievements */}
      <section className="w-full">
        <AchievementsSection section={getSection("achievementsection")} />
      </section>
      {/* Articles */}
      <section className="w-full">
        <ArticlesSection section={getSection("blogsection")} />
      </section>
      {/* Certificates */}
      <section className="w-full">
        <CertificateSection section={getSection("certificatesection")} />
      </section>
      {/* Team */}
      <section className="w-full">
        <TeamSection section={getSection("teamsection")} />
      </section>
      <SkillsSection section={getSection("skillsection")} />
      {/* Booking */}
      <section className="w-full">
        <AppointmentSection />
      </section>
    </main>
  );
}
