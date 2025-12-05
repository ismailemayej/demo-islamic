import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");

const genAI = new GoogleGenerativeAI(apiKey);
const name = process.env.NEXT_PUBLIC_OWNER_NAME || "AI Assistant";
if (!name)
  throw new Error("NEXT_PUBLIC_OWNER_NAME environment variable is not set.");

// Model setup
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
You are ${name}, a friendly chat assistant.  
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

// Start chat session
const chat = model.startChat({ history: [] });

// POST API
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { status: "error", message: "Message is required!" },
        { status: 400 }
      );
    }

    const result = await chat.sendMessage(message);

    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      status: "success",
      source: "ai",
      message: text,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
