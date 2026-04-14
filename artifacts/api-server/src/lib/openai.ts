type ChatCompletionCreate = (...args: unknown[]) => Promise<unknown>;

export const openai = {
  chat: {
    completions: {
      create: async (...args: Parameters<ChatCompletionCreate>) => {
        if (!process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"]) {
          throw new Error(
            "AI features require the OpenAI AI integration to be connected.",
          );
        }

        const integration = await import("@workspace/integrations-openai-ai-server");
        return integration.openai.chat.completions.create(...(args as [never]));
      },
    },
  },
};