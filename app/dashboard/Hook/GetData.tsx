"use client";

import { useState, useEffect } from "react";

interface Heading {
  title: string;
  subTitle: string;
}

interface SectionData<T = any> {
  heading: Heading;
  data: T;
  moreVideosUrl: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  groupedData?: Record<string, SectionData<T>>;
}

export function useGetSection<T = any>(sectionName: string) {
  const [section, setSection] = useState<SectionData<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🛑 যদি sectionName ফাঁকা হয়, কিছু না করি
    if (!sectionName) return;

    let isMounted = true; // ✅ unmount হলে state update রোধ করবে

    const fetchSection = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/all-data/${sectionName}`, {
          cache: "no-store", // ✅ সর্বশেষ ডেটা আনবে
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const json: ApiResponse<T> = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Failed to fetch section");
        }

        const sectionKey = sectionName.toLowerCase();
        const sectionData = json.groupedData?.[sectionKey];

        if (!sectionData) {
          throw new Error(`Section data not found for "${sectionName}"`);
        }

        if (isMounted) {
          setSection(sectionData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unknown error");
          setSection(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSection();

    // ✅ cleanup function (যদি component unmount হয়)
    return () => {
      isMounted = false;
    };
  }, [sectionName]);

  return { section, loading, error };
}
