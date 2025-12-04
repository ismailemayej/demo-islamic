// app/api/chat/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// .env.local থেকে API কী লোড করা
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// === মডেল ইনিশিয়ালাইজেশন এবং সিস্টেম ইনস্ট্রাকশন যুক্ত করা হয়েছে ===
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",

  systemInstruction: `
You are ${process.env.NEXT_PUBLIC_OWNER_NAME}, a friendly chat assistant.  
You must always reply in the same language the user uses.  
Maintain a kind, polite, and helpful tone at all times.

Do NOT use:
- code  
- function syntax  
- programming structures  

Use ONLY:
- plain text  
- Markdown  

Response Process:
1. When the user asks a question, first check the custom JSON data that contains all website-related information.
2. If the question is related to the JSON, answer only using the JSON data.
3. If the JSON does not contain the answer, generate the response using Gemini AI.
4. If the question is not covered by JSON or Gemini, reply politely:
   'This question is not available in my custom JSON. You may ask something else.'

Additional Rules:
- Always answer in the user’s language.
- Avoid incorrect or made-up information.
- Maintain a natural, supportive conversation tone.
- Never invent new details if they do not exist in the JSON.
`,
});

const chat = model.startChat({
  history: [],
});

// কাস্টম JSON API এন্ডপয়েন্ট
const CUSTOM_JSON_API = "https://mizanur-rahman-azhari.vercel.app/api/all-data";

/**
 * এক্সটার্নাল API থেকে ডেটা এনে ইউজারের মেসেজের সাথে ম্যাচ করে।
 * @param query ইউজারের চ্যাট মেসেজ
 * @returns প্রাসঙ্গিক ডেটা অবজেক্ট বা null
 */
async function searchExternalData(query: string) {
  try {
    // API থেকে সমস্ত ডেটা আনা হচ্ছে
    const response = await fetch(CUSTOM_JSON_API);
    if (!response.ok) {
      console.error(
        `Error fetching data from custom API: ${response.statusText}`
      );
      return null;
    }

    const allData = await response.json();

    if (!Array.isArray(allData.data)) {
      console.error(
        "Custom API response format is unexpected. Expected an array in 'data' field."
      );
      return null;
    }

    const lowerCaseQuery = query.toLowerCase();

    // ডেটা অ্যারেতে লুপ করে প্রাসঙ্গিক তথ্য খোঁজা
    const foundItem = allData.data.find((item: any) => {
      // আইটেমের মধ্যে 'name' ফিল্ডের উপর ভিত্তি করে ম্যাচিং করা হচ্ছে
      if (item.name && typeof item.name === "string") {
        return (
          lowerCaseQuery.includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(lowerCaseQuery)
        );
      }
      return false;
    });

    return foundItem;
  } catch (error) {
    console.error("Failed to search external data:", error);
    return null;
  }
}

// এই API Route-এ POST রিকোয়েস্ট হ্যান্ডেল করা হবে
export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // ফ্রন্টএন্ড থেকে মেসেজ রিসিভ করা

    // ১. প্রথমে কাস্টম JSON API ডেটা সার্চ করা
    const externalData = await searchExternalData(message);

    if (externalData) {
      // কাস্টম ডেটা পাওয়া গেলে, JSON ফরমেটে ডেটা ফেরত পাঠানো
      return NextResponse.json({
        status: "success",
        data_type: "json", // ডেটা টাইপ নির্দিষ্ট করা
        message: "আপনার অনুরোধ অনুযায়ী কাস্টম ডেটাবেস থেকে তথ্য পাওয়া গেছে:",
        json_data: externalData, // JSON ডেটা ফেরত পাঠানো
      });
    }

    // ২. কাস্টম ডেটা না পাওয়া গেলে, Gemini API কল করা

    // চ্যাট সেশনে নতুন মেসেজ পাঠানো হচ্ছে
    const result = await chat.sendMessage(message);

    // Gemini-এর রেসপন্স টেক্সট বের করা
    // systemInstruction ব্যবহারের ফলে মডেল নিজেই এখন পরিচয়ের সাথে উত্তর দেবে
    const finalResponseText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    // ক্লায়েন্টকে JSON রেসপন্স হিসেবে পাঠানো
    return NextResponse.json({
      status: "success",
      data_type: "text",
      message: finalResponseText,
    });
  } catch (error) {
    console.error("API কল করার সময় ত্রুটি:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
