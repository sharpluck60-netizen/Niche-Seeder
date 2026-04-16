import Groq from "groq-sdk";

function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("AI features require GROQ_API_KEY to be set.");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

let _client: Groq | null = null;

export function getOpenAI(): Groq {
  if (!_client) {
    _client = getGroqClient();
  }
  return _client;
}

export const openai = new Proxy({} as Groq, {
  get(_target, prop) {
    return (getOpenAI() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
