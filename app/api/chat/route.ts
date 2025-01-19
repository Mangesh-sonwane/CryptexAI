// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("🚀 ~ apiKey:", process.env.OPENAI_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    // Log the error message
    console.error("Error occurred during OpenAI request:", error);

    // If it's an OpenAI API error, log the specific response
    if (error) {
      console.error("OpenAI error response:", error);
    }

    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
