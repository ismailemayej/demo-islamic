"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
// import Loader from "@/components/loader"; // Assuming this Loader component exists

// --- ICON IMPORTS ---
import { BiLayer, BiRocket, BiTimeFive, BiHash, BiLink } from "react-icons/bi";
import {
  MdOutlineDashboard,
  MdOutlineVisibility,
  MdContactMail,
  MdOutlineHome,
} from "react-icons/md";
import {
  FaBook,
  FaYoutube,
  FaUsers,
  FaTasks,
  FaBullhorn,
  FaImages,
  FaBuilding,
  FaUserCircle,
  FaLaptopCode,
  FaWrench,
  FaSitemap,
} from "react-icons/fa";
import { GiGavel, GiGraduateCap } from "react-icons/gi";
import Loader from "@/components/loader";
import Background from "@/components/background";

// ------------------- TYPES -------------------
interface SectionValue {
  heading?: { title: string; subtitle?: string };
  data?: any[] | object;
  moreVideosUrl?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GroupedData {
  [section: string]: SectionValue;
}

interface WebsiteData {
  section: string;
  heading: { title: string; subtitle?: string };
  data: any[] | object;
  moreVideosUrl: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// NextUI's expected color type
type NextUIColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "default";

/**
 * Function to map section names to icons.
 */
const getSectionIcon = (section: string) => {
  const lowerCaseSection = section.toLowerCase();
  switch (lowerCaseSection) {
    case "youtubevideosection":
      return <FaYoutube className="text-2xl text-danger" />;
    case "booksection":
      return <FaBook className="text-2xl text-warning" />;
    case "testimonialsection":
      return <FaBullhorn className="text-2xl text-success" />;
    case "teamsection":
      return <FaUsers className="text-2xl text-secondary" />;
    case "certificatesection":
      return <GiGavel className="text-2xl text-orange-500" />;
    case "programsection":
      return <FaTasks className="text-2xl text-cyan-500" />;
    case "educationsection":
      return <GiGraduateCap className="text-2xl text-blue-500" />;
    case "blogsection":
      return <BiLayer className="text-2xl text-indigo-500" />;
    case "gallerysection":
      return <FaImages className="text-2xl text-pink-500" />;
    case "websitesection":
      return <FaLaptopCode className="text-2xl text-teal-500" />;
    case "organizationsection":
      return <FaBuilding className="text-2xl text-amber-500" />;
    case "achievementsection":
      return <BiRocket className="text-2xl text-lime-500" />;
    case "herosection":
      return <MdOutlineHome className="text-2xl text-rose-500" />;
    case "aboutsection":
      return <FaUserCircle className="text-2xl text-sky-500" />;
    case "contactsection":
      return <MdContactMail className="text-2xl text-danger-700" />;
    case "socialmediasection":
      return <BiLink className="text-2xl text-primary-700" />;
    case "skillsection":
      return <FaWrench className="text-2xl text-gray-500" />;
    case "servicesection":
      return <FaSitemap className="text-2xl text-success-700" />;
    case "usersection":
      return <FaUsers className="text-2xl text-purple-700" />;
    default:
      return <BiHash className="text-2xl text-gray-500" />;
  }
};

/**
 * Function to cycle through NextUI colors. (TypeScript fix applied)
 */
const getColorForSection = (index: number): NextUIColor => {
  const colors: NextUIColor[] = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "default",
  ];
  return colors[index % colors.length];
};

// ------------------- COMPONENT -------------------
export default function DashboardHome() {
  const [data, setData] = useState<WebsiteData[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to determine data length for both arrays and single objects
  const getDataLength = (data: any[] | object) => {
    if (Array.isArray(data)) {
      return data.length;
    }
    // Single entries (herosection, aboutsection, etc.) are counted as 1 item
    return 1;
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        // --- MOCK DATA FOR DEMONSTRATION ---
        // Replace this block with your actual API fetch logic when ready
        const uploadedData = [
          { section: "blogsection", data: [{}, {}, {}, {}] },
          { section: "gallerysection", data: [{}, {}, {}, {}, {}, {}] },

          { section: "organizationsection", data: [{}, {}, {}] },
          { section: "achievementsection", data: [{}, {}, {}, {}] },

          { section: "certificatesection", data: [{}, {}, {}] },
          {
            section: "youtubevideosection",
            data: [{}, {}, {}, {}],
            moreVideosUrl: "...",
          },
          { section: "aboutsection", data: {} }, // Single item
          { section: "contactsection", data: {} }, // Single item
          { section: "programsection", data: [{}, {}, {}, {}, {}, {}] },
          { section: "educationsection", data: [{}, {}, {}, {}, {}] },
          { section: "socialmediasection", data: [{}, {}, {}, {}, {}] },
          { section: "testimonialsection", data: [{}, {}, {}, {}] },
          { section: "teamsection", data: [{}, {}, {}, {}, {}] },
          { section: "booksection", data: [{}, {}, {}, {}, {}] },
          { section: "servicesection", data: [{}, {}, {}, {}] },
          { section: "skillsection", data: [{}, {}, {}, {}, {}] },
        ] as WebsiteData[];

        setData(
          uploadedData.map((item) => ({
            ...item,
            heading: item.heading || {
              title: item.section.replace("section", ""),
              subtitle: "",
            },
            moreVideosUrl: item.moreVideosUrl || "",
          }))
        );
        // --- END MOCK DATA ---

        // // --- ACTUAL API CALL (Uncomment and configure your NEXT_PUBLIC_SITE_URL) ---
        // const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data`, { next: { revalidate: 60 } });
        // if (!res.ok) throw new Error("Failed to fetch website data");
        // const json = await res.json();
        // const grouped: GroupedData = json.groupedData || {};
        // const finalData: WebsiteData[] = Object.entries(grouped).map(
        //   ([section, value]) => ({
        //     section,
        //     heading: value.heading || { title: "", subtitle: "" },
        //     data: value.data || [],
        //     moreVideosUrl: value.moreVideosUrl || "",
        //     _id: value._id,
        //     createdAt: value.createdAt,
        //     updatedAt: value.updatedAt,
        //   })
        // );
        // setData(finalData);
        // // --- END API CALL ---
      } catch (error) {
        console.error("❌ Dashboard Fetch Error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <Loader />;
  if (!data || data.length === 0)
    return (
      <div className="p-6 text-center text-lg text-gray-600 dark:text-gray-400 min-h-screen bg-background">
        ❌ No data found. Please ensure the API/mock data is correctly
        configured.
      </div>
    );

  // Calculation Metrics
  const totalSections = data.length;
  const totalItems = data.reduce(
    (sum, section) => sum + getDataLength(section.data),
    0
  );

  // Mock Target/Goal
  const maxGoal = 100;
  const completionPercentage = Math.min(100, (totalItems / maxGoal) * 100);

  return (
    <Background id="">
      <div className="p-4 sm:p-8 space-y-10 min-h-screen">
        {/* Header Section */}
        <Card className="shadow-2xl bg-content1 border-t-6 border-primary/80">
          <CardBody className="py-6 px-6 sm:px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl lg:text-4xl font-extrabold text-primary flex items-center gap-3">
                  <MdOutlineDashboard className="text-4xl" /> Admin Dashboard
                </h1>
                <p className="text-default-500 mt-1 text-sm lg:text-lg">
                  Quick summary of website content and data.
                </p>
              </div>
              <Chip
                color="primary"
                variant="flat"
                className="font-semibold text-sm hidden sm:flex"
                startContent={<BiTimeFive />}
              >
                Real-time View
              </Chip>
            </div>
          </CardBody>
        </Card>
        {/* Primary Metrics (Total Items & Completion) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sections */}
          <Card className="shadow-lg bg-default-50/70 border-b-4 border-indigo-500 dark:border-indigo-400 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-1">
              <BiRocket className="text-xl text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-default-600 uppercase">
                Total Sections
              </span>
            </CardHeader>
            <CardBody className="px-6 pb-5 pt-0">
              <p className="text-5xl font-extrabold text-default-900">
                {totalSections}
              </p>
            </CardBody>
          </Card>

          {/* Total Items */}
          <Card className="shadow-lg bg-default-50/70 border-b-4 border-success-500 dark:border-success-400 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-1">
              <FaTasks className="text-xl text-success-600 dark:text-success-400" />
              <span className="text-sm font-semibold text-default-600 uppercase">
                Total Items
              </span>
            </CardHeader>
            <CardBody className="px-6 pb-5 pt-0">
              <p className="text-5xl font-extrabold text-default-900">
                {totalItems}
              </p>
            </CardBody>
          </Card>

          {/* Goal Completion */}
          <Card className="shadow-lg bg-default-50/70 border-b-4 border-warning-500 dark:border-warning-400 transition-transform hover:scale-[1.02]">
            <CardHeader className="flex items-center gap-2 px-6 pt-5 pb-1">
              <MdOutlineVisibility className="text-xl text-warning-600 dark:text-warning-400" />
              <span className="text-sm font-semibold text-default-600 uppercase">
                Goal Completion (Mock)
              </span>
            </CardHeader>
            <CardBody className="px-6 pb-5 pt-0">
              <Progress
                size="lg"
                aria-label="Content Completion"
                value={completionPercentage}
                color={completionPercentage > 80 ? "success" : "warning"}
                showValueLabel={true}
                className="max-w-md"
                label={`Goal: ${maxGoal} items`}
              />
            </CardBody>
          </Card>
        </div>
        {/* ---------------------------------------------------- */}
        <hr className="border-divider" />

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {data.map((section, index) => {
              const itemCount = getDataLength(section.data);
              const sectionColor = getColorForSection(index);
              const sectionLink = `/dashboard/${section.section}`;
              const displayName = section.section.replace("section", "");

              return (
                <Card
                  key={section.section}
                  className={`shadow-xl bg-content1 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-solid`}
                  // Dynamically set the hover border color using style
                >
                  <CardHeader className="flex justify-between items-center px-6 pt-4 pb-0">
                    <div className="flex items-center gap-3">
                      {getSectionIcon(section.section)}
                      <h3 className="font-bold text-xl capitalize text-default-800">
                        {displayName}
                      </h3>
                    </div>
                    <Chip
                      color={sectionColor}
                      variant="flat"
                      className="capitalize"
                    >
                      {itemCount > 0 ? "Active" : "Empty"}
                    </Chip>
                  </CardHeader>

                  <CardBody className="px-6 pb-4 pt-2">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-5xl font-extrabold text-default-900">
                          {itemCount}
                        </span>
                        <span className="text-default-500 text-sm font-medium block">
                          Items
                        </span>
                      </div>
                      <Tooltip
                        content={section.heading?.title || "No Title Set"}
                      >
                        <Chip
                          variant="bordered"
                          color="default"
                          className="max-w-[100px] truncate cursor-pointer"
                        >
                          {section.heading?.title || "Header Title"}
                        </Chip>
                      </Tooltip>
                    </div>
                    {/* Footer Link for Quick Action */}
                    <Button
                      color={sectionColor}
                      variant="shadow"
                      size="sm"
                      as="a"
                      href={sectionLink}
                      className="mt-4 w-full capitalize text-sm font-semibold"
                      endContent={<BiRocket />}
                    >
                      Manage
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Background>
  );
}
