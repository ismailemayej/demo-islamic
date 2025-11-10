"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HeroSection } from "./home/HeroSection";
import { AboutSection } from "./home/About";
import { YouTubeVideosSection } from "./home/YTvideos";
import { RecentProgramsSection } from "./home/LastProggram";
import { SocialMediaSection } from "./home/SocialMedia";
import { EducationSection } from "./home/Education";
import { AchievementsSection } from "./home/Achievements";
import { GallerySection } from "./home/Gellery";
import { TestimonialsSection } from "./home/Testimonials";
import { ArticlesSection } from "./home/Blog";
import { CertificateSection } from "./home/Certificate";
import { ContactSection } from "./home/Contact";
import { TeamSection } from "./home/Team";
import { OrganizationSection } from "./home/Organization";
import { AppointmentSection } from "./home/Booking";

const sectionComponents: Record<string, React.FC> = {
  HeroSection,
  AboutSection,
  YouTubeVideosSection,
  RecentProgramsSection,
  SocialMediaSection,
  EducationSection,
  AchievementsSection,
  GallerySection,
  TestimonialsSection,
  ArticlesSection,
  CertificateSection,
  ContactSection,
  TeamSection,
  OrganizationSection,
  AppointmentSection,
};

interface SectionItemProps {
  id: string;
  children: React.ReactNode;
  isDraggable: boolean;
}

function SectionItem({ id, children, isDraggable }: SectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: isDraggable ? CSS.Transform.toString(transform) : undefined,
    transition: isDraggable ? transition : undefined,
    cursor: isDraggable ? "grab" : "default",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? attributes : {})}
      {...(isDraggable ? listeners : {})}
    >
      {children}
    </div>
  );
}

interface UIManagerProps {
  user: string; // এখানে ইউজারের নাম পাঠানো হবে
}

export default function UIManager({ user }: UIManagerProps) {
  const [sections, setSections] = useState<string[]>([
    "HeroSection",
    "AboutSection",
    "YouTubeVideosSection",
    "RecentProgramsSection",
    "SocialMediaSection",
    "EducationSection",
    "AchievementsSection",
    "GallerySection",
    "TestimonialsSection",
    "ArticlesSection",
    "CertificateSection",
    "ContactSection",
    "TeamSection",
    "OrganizationSection",
    "AppointmentSection",
  ]);

  const isDraggable = user === "ismaile"; // শুধুমাত্র ismaile ড্র্যাগ করতে পারবে

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragEnd = (event: any) => {
    if (!isDraggable) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div>
          {sections.map((sectionId) => {
            const SectionComponent = sectionComponents[sectionId];
            return (
              <SectionItem
                key={sectionId}
                id={sectionId}
                isDraggable={isDraggable}
              >
                <div>
                  <SectionComponent />
                </div>
              </SectionItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
