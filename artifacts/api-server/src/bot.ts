import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { db, analysesTable, dramaSeriesTable, dramaEpisodesTable } from "@workspace/db";
import { openai } from "./lib/openai";
import { desc, eq } from "drizzle-orm";
import { logger } from "./lib/logger";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram bot will not start.");
}

async function analyzeUrl(url: string, platform: string) {
  const [analysis] = await db
    .insert(analysesTable)
    .values({ url, platform, status: "analyzing" })
    .returning();

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are an expert in AI-generated cinematic content and social media distribution strategy for 2026. Analyze the given video URL and provide insights about its micro-niche, target audience, and growth potential. Respond in JSON format with these exact fields:
{
  "title": "A short descriptive title for this content",
  "microNiche": "The specific sub-genre",
  "moodKeywords": ["keyword1", "keyword2", "keyword3"],
  "audienceProfile": "A 2-3 sentence description of the target audience",
  "hookSuggestion": "A specific 1.5-second micro-hook suggestion"
}`,
      },
      {
        role: "user",
        content: `Analyze this ${platform} video: ${url}. Based on the URL structure, platform, and any context clues, determine the micro-niche, mood keywords, audience profile, and suggest a compelling micro-hook.`,
      },
    ],
  });

  const content = aiResponse.choices[0]?.message?.content ?? "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

  const [updated] = await db
    .update(analysesTable)
    .set({
      title: aiData.title || "Untitled Analysis",
      microNiche: aiData.microNiche || "General AI Cinema",
      moodKeywords: aiData.moodKeywords || [],
      audienceProfile: aiData.audienceProfile || "",
      hookSuggestion: aiData.hookSuggestion || "",
      status: "complete",
    })
    .where(eq(analysesTable.id, analysis.id))
    .returning();

  return updated;
}

function detectPlatform(url: string): string {
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("twitter.com") || url.includes("x.com")) return "X/Twitter";
  return "Other";
}

function formatAnalysis(a: typeof analysesTable.$inferSelect): string {
  const keywords = Array.isArray(a.moodKeywords) ? (a.moodKeywords as string[]).join(", ") : "";
  return [
    `🎬 *${escapeMarkdown(a.title || "Analysis")}*`,
    ``,
    `🎯 *Micro-Niche:* ${escapeMarkdown(a.microNiche || "—")}`,
    `🔮 *Mood:* ${escapeMarkdown(keywords || "—")}`,
    `👥 *Audience:* ${escapeMarkdown(a.audienceProfile || "—")}`,
    `⚡ *Hook:* ${escapeMarkdown(a.hookSuggestion || "—")}`,
    ``,
    `🔗 [View full analysis in app](https://seeder-os.replit.app/)`,
  ].join("\n");
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}

export function createBot() {
  if (!token) return null;

  const bot = new Telegraf(token);

  bot.start((ctx) =>
    ctx.replyWithMarkdownV2(
      [
        `👾 *Welcome to SEEDER\\_OS Bot\\!*`,
        ``,
        `I can analyze viral video content and send you AI\\-generated outputs\\.`,
        ``,
        `*Commands:*`,
        `📡 /analyze \\<url\\> — Analyze a video URL`,
        `📋 /recent — Show your 5 most recent analyses`,
        `🎭 /drama — Generate a quick drama scene`,
        `❓ /help — Show this message`,
        ``,
        `Or just paste any TikTok, YouTube, or Instagram URL and I\\'ll analyze it automatically\\.`,
      ].join("\n")
    )
  );

  bot.help((ctx) =>
    ctx.replyWithMarkdownV2(
      [
        `*SEEDER\\_OS Bot Commands:*`,
        ``,
        `📡 /analyze \\<url\\> — Analyze a video URL`,
        `📋 /recent — Show your 5 most recent analyses`,
        `🎭 /drama — Generate a quick drama scene sample`,
        ``,
        `Or just drop any video URL in the chat\\!`,
      ].join("\n")
    )
  );

  bot.command("analyze", async (ctx) => {
    const parts = ctx.message.text.split(/\s+/);
    const url = parts[1];

    if (!url || !url.startsWith("http")) {
      await ctx.reply("Please provide a URL. Example:\n/analyze https://www.tiktok.com/@user/video/123");
      return;
    }

    const platform = detectPlatform(url);
    const thinking = await ctx.reply(`⏳ Analyzing ${platform} video... this takes a few seconds.`);

    try {
      const result = await analyzeUrl(url, platform);
      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.replyWithMarkdownV2(formatAnalysis(result), { disable_web_page_preview: true });
    } catch (err) {
      logger.error({ err }, "Bot analysis failed");
      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply("❌ Analysis failed. Please check the URL and try again.");
    }
  });

  bot.command("recent", async (ctx) => {
    try {
      const analyses = await db
        .select()
        .from(analysesTable)
        .orderBy(desc(analysesTable.createdAt))
        .limit(5);

      if (analyses.length === 0) {
        await ctx.reply("No analyses yet. Send a video URL to get started!");
        return;
      }

      await ctx.reply("📋 Your 5 most recent analyses:");
      for (const a of analyses) {
        await ctx.replyWithMarkdownV2(formatAnalysis(a), { disable_web_page_preview: true });
      }
    } catch (err) {
      logger.error({ err }, "Bot recent failed");
      await ctx.reply("❌ Could not fetch recent analyses.");
    }
  });

  bot.command("drama", async (ctx) => {
    const thinking = await ctx.reply("🎭 Generating a drama scene sample...");

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-5.2",
        max_completion_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `You are a viral AI drama scene writer. Create a short 3-shot drama scene in this JSON format:
{
  "title": "Scene title",
  "logline": "One sentence premise",
  "shots": [
    { "shot": 1, "action": "What happens", "dialogue": "Character: 'spoken line'" },
    { "shot": 2, "action": "What happens", "dialogue": "Character: 'spoken line'" },
    { "shot": 3, "action": "What happens", "dialogue": "Character: 'spoken line'" }
  ],
  "hook": "The viral caption hook",
  "teaser": "Next episode teaser"
}`,
          },
          {
            role: "user",
            content: "Generate a 3-shot viral drama scene. Pick an interesting genre: betrayal, revenge, love triangle, or family drama.",
          },
        ],
      });

      const content = aiResponse.choices[0]?.message?.content ?? "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const scene = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);

      const shots = (scene.shots || [])
        .map((s: { shot: number; action: string; dialogue: string }) =>
          `*Shot ${s.shot}:* ${escapeMarkdown(s.action)}\n_"${escapeMarkdown(s.dialogue)}"_`
        )
        .join("\n\n");

      const msg = [
        `🎭 *${escapeMarkdown(scene.title || "Drama Scene")}*`,
        `_${escapeMarkdown(scene.logline || "")}_`,
        ``,
        shots,
        ``,
        `🪝 *Hook:* ${escapeMarkdown(scene.hook || "")}`,
        `📺 *Next:* ${escapeMarkdown(scene.teaser || "")}`,
        ``,
        `_Build full drama series in the app\\!_`,
      ].join("\n");

      await ctx.replyWithMarkdownV2(msg);
    } catch (err) {
      logger.error({ err }, "Bot drama failed");
      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply("❌ Drama generation failed. Please try again.");
    }
  });

  bot.on(message("text"), async (ctx) => {
    const text = ctx.message.text.trim();
    const urlMatch = text.match(/https?:\/\/[^\s]+/);

    if (!urlMatch) return;

    const url = urlMatch[0];
    const platform = detectPlatform(url);

    if (!["TikTok", "YouTube", "Instagram", "X/Twitter"].includes(platform)) return;

    const thinking = await ctx.reply(`⏳ Detected ${platform} URL\\. Analyzing\\.\\.\\.`, {
      parse_mode: "MarkdownV2",
    });

    try {
      const result = await analyzeUrl(url, platform);
      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.replyWithMarkdownV2(formatAnalysis(result), { disable_web_page_preview: true });
    } catch (err) {
      logger.error({ err }, "Bot auto-analyze failed");
      await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply("❌ Analysis failed. Please try again.");
    }
  });

  bot.catch((err) => {
    logger.error({ err }, "Telegram bot error");
  });

  return bot;
}
