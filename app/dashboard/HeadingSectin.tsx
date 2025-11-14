"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/Heading";
import { Button } from "@heroui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@heroui/input";

interface SectionHeadingProps {
  section: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ section }) => {
  const [heading, setHeading] = useState({ title: "", subTitle: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch heading data
  useEffect(() => {
    const fetchHeading = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/heading/${section}`);
        const data = await res.json();
        setHeading(data);
      } catch (error) {
        console.error("Error fetching heading:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeading();
  }, [section]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/headings/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heading),
      });
      const data = await res.json();
      setHeading(data.updatedHeading);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating heading:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10">
          <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
        </div>
      )}

      <Heading
        title={
          editMode ? (
            <Input
              size="md"
              className="border rounded-lg p-2 w-full text-center dark:bg-gray-800 dark:text-gray-200"
              value={heading.title}
              onChange={(e) =>
                setHeading({ ...heading, title: e.target.value })
              }
              disabled={loading}
            />
          ) : (
            heading.title
          )
        }
        subTitle={
          editMode ? (
            <Input
              size="md"
              className="border rounded-lg p-2 w-full text-center dark:bg-gray-800 dark:text-gray-200"
              value={heading.subTitle}
              onChange={(e) =>
                setHeading({ ...heading, subTitle: e.target.value })
              }
              disabled={loading}
            />
          ) : (
            heading.subTitle
          )
        }
      />

      {editMode ? (
        <div className="mt-2 flex gap-2">
          <Button
            className="bg-emerald-600 text-white"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-1" /> : null}
            Save
          </Button>
          <Button
            className="bg-gray-500 text-white"
            onClick={() => setEditMode(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          className="mt-2 bg-emerald-600 text-white"
          onClick={() => setEditMode(true)}
          disabled={loading}
        >
          Edit Heading
        </Button>
      )}
    </div>
  );
};
