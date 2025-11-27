import Main from "@/components/home/main";
import { WebsiteData } from "@/types/allData";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data`, {
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch website data");
  }

  const data: WebsiteData[] = await res.json();
  return <Main data={data} />;
}
