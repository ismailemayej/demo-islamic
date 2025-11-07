export function getPublicIdFromUrl(url: string): string | null {
  try {
    if (!url) return null;

    // 🔹 URL এর "upload/" এর পরের অংশটি নাও
    const afterUpload = url.split("/upload/")[1];
    if (!afterUpload) return null;

    // 🔹 ভার্সন নাম্বার (যেমন v1234567890) বাদ দাও
    const parts = afterUpload.split("/");
    if (parts[0].startsWith("v")) parts.shift();

    // 🔹 ফাইলের নাম থেকে এক্সটেনশন বাদ দাও (.jpg, .png ইত্যাদি)
    const lastPart = parts.pop();
    if (!lastPart) return null;

    const fileNameWithoutExt = lastPart.split(".")[0];
    parts.push(fileNameWithoutExt);

    // 🔹 অবশেষে ফোল্ডারসহ পূর্ণ public_id তৈরি করো
    return parts.join("/");
  } catch (error) {
    console.error("❌ Failed to extract public_id:", error);
    return null;
  }
}
