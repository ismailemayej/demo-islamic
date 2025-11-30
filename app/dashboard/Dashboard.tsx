"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Loader from "@/components/loader";

// ------------------- নতুন টাইপ -------------------
interface SectionValue {
  heading?: { title: string; subtitle?: string };
  data?: any[];
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
  data: any[];
  moreVideosUrl: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------- কম্পোনেন্ট -------------------
export default function DashboardHome() {
  const [data, setData] = useState<WebsiteData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data`,
          {
            next: { revalidate: 60 },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch website data");

        const json = await res.json();

        // 🔹 groupedData থেকে WebsiteData[] বানানো
        const grouped: GroupedData = json.groupedData || {};
        const finalData: WebsiteData[] = Object.entries(grouped).map(
          ([section, value]) => ({
            section,
            heading: value.heading || { title: "", subtitle: "" },
            data: value.data || [],
            moreVideosUrl: value.moreVideosUrl || "",
            _id: value._id,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
          })
        );

        setData(finalData);
      } catch (error) {
        console.error("❌ Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="p-6">No Data Found</div>;

  // Section অনুযায়ী ডাটা পেতে
  const getSection = (name: string) =>
    data.find((item) => item.section === name);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-gray-500">
        Website section statistics & quick actions
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((section) => (
          <Card key={section.section} className="border shadow-sm">
            <CardHeader className="font-semibold capitalize">
              {section.section}
            </CardHeader>
            <CardBody>
              <div className="flex flex-col">
                <span className="text-lg font-bold">{section.data.length}</span>
                <span className="text-gray-600 text-sm">Items</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {data.map((section) => (
            <Button
              key={section.section}
              color="primary"
              variant="flat"
              className="capitalize"
              as="a"
              href={`/dashboard/${section.section}`}
            >
              Manage {section.section}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
