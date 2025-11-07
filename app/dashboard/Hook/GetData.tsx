import { useState, useEffect } from "react";

interface Heading {
  title: string;
  subTitle: string;
}

interface SectionData<T = any> {
  heading: Heading;
  data: T;
}

export function useGetSection<T = any>(sectionName: string) {
  const [section, setSection] = useState<SectionData<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionName) return;

    async function fetchSection() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/all-data/${sectionName}`);
        const json = await res.json();

        if (!json.success)
          throw new Error(json.error || "Failed to fetch section");

        // ✅ groupedData থেকে sectionName অনুযায়ী data নেওয়া
        const sectionData = json.groupedData[sectionName.toLowerCase()];
        if (!sectionData) throw new Error("Section data not found");

        setSection(sectionData);
      } catch (err: any) {
        setError(err.message);
        setSection(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, [sectionName]);

  return { section, loading, error };
}
