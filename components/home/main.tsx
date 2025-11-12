"use client";
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
import { SocialMediaSection } from "./SocialMedia";
import { TeamSection } from "./Team";
import { TestimonialsSection } from "./Testimonials";
import { YouTubeVideosSection } from "./YTvideos";

export default function Main() {
  return (
    <main className="flex flex-col lg:gap-5 gap-2 items-center justify-center w-full overflow-hidden transition-colors duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="w-full transition-colors duration-500">
        <HeroSection />
      </section>
      {/* About */}
      <section className="w-full transition-colors duration-500">
        <AboutSection />
      </section>
      {/* Programs */}
      <section className="w-full  transition-colors duration-500">
        <RecentProgramsSection />
      </section>
      {/* YouTube Videos */}
      <section className="w-full transition-colors duration-500">
        <YouTubeVideosSection />
      </section>

      {/* Social Media */}
      <section className="w-full transition-colors duration-500">
        <SocialMediaSection />
      </section>

      {/* Gallery */}
      <section className="w-full transition-colors duration-500">
        <GallerySection />
      </section>
      {/* Contact */}
      <section className="w-full transition-colors duration-500">
        <ContactSection />
      </section>
      {/* Organization */}
      <section className="w-full transition-colors duration-500">
        <OrganizationSection />
      </section>
      {/* Booksection */}
      <section className="w-full transition-colors duration-500">
        <BookSection />
      </section>
      {/* Testimonials */}
      <section className="w-full transition-colors duration-500">
        <TestimonialsSection />
      </section>
      {/* Education */}
      <section className="w-full transition-colors duration-500">
        <EducationSection />
      </section>

      {/* Achievements */}
      <section className="w-full transition-colors duration-500">
        <AchievementsSection />
      </section>

      {/* Articles */}
      <section className="w-full transition-colors duration-500">
        <ArticlesSection />
      </section>

      {/* Certificates */}
      <section className="w-full transition-colors duration-500">
        <CertificateSection />
      </section>

      {/* TEAM */}
      <section className="w-full transition-colors duration-500">
        <TeamSection />
      </section>

      {/* Booking */}
      <section className="w-full transition-colors duration-500">
        <AppointmentSection />
      </section>
    </main>
  );
}
