import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  console.log("browny");

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const assistantMessage =
      completion.choices[0]?.message?.content || "No response";

    res.status(200).json({ reply: assistantMessage });
  } catch (error) {
    console.error("Error in API handler:", error);

    res.status(500).json({
      error: "Internal Server Error",
      details: error || "Unexpected error occurred",
    });
  }
}
