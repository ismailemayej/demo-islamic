import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const API_KEYS = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY5,
  process.env.GEMINI_API_KEY6,
  process.env.GEMINI_API_KEY7,
  process.env.GEMINI_API_KEY8,
  process.env.GEMINI_API_KEY9,
  process.env.GEMINI_API_KEY10,
  process.env.GEMINI_API_KEY11,
].filter(Boolean);
const name = process.env.NEXT_PUBLIC_OWNER_NAME || "AI Chatbot";

if (API_KEYS.length === 0)
  throw new Error("At least one GEMINI_API_KEY is required.");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { status: "error", message: "Message is required!" },
        { status: 400 }
      );
    }

    let responseText = "";

    // Loop over API keys
    for (const apiKey of API_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey as string);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: `You are ${name}, a friendly chat assistant.  
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
        const chat = model.startChat({ history: [] });
        // Send user message
        const result = await chat.sendMessage(message);

        responseText =
          result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";

        // যদি সফল হয়, loop বন্ধ
        break;
      } catch (err: any) {
        if (err?.status !== 429) break;
      }
    }

    if (!responseText) {
      return NextResponse.json(
        { status: "error", message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      source: "ai",
      message: responseText,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: `${error} Internal Server Error` },
      { status: 500 }
    );
  }
}
