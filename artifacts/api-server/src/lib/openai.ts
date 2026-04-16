import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("AI features require GROQ_API_KEY to be set.");
}

export const openai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
