import { Bot, GrammyError, HttpError } from "grammy";
import { db, analysesTable } from "@workspace/db";
import { openai } from "./lib/openai";
import { fetchUrlMeta } from "./lib/fetchUrlMeta";
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

  const urlMeta = await fetchUrlMeta(url, platform);
  const metaContext = urlMeta.raw
    ? `Here is the actual metadata scraped from the video page:\n${urlMeta.raw}`
    : `No metadata could be scraped. Use the URL structure and platform context only.`;

  const aiResponse = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are an expert in AI-generated cinematic content and social media distribution strategy for 2026. Analyze the given video and provide accurate insights based on the REAL metadata provided. Do NOT fabricate or guess — use only what is given. Respond in JSON format:
{
  "title": "A short descriptive title",
  "microNiche": "The specific sub-genre",
  "moodKeywords": ["keyword1", "keyword2", "keyword3"],
  "audienceProfile": "A 2-3 sentence description of the target audience",
  "hookSuggestion": "A specific 1.5-second micro-hook suggestion"
}`,
      },
      {
        role: "user",
        content: `Analyze this ${platform} video: ${url}\n\n${metaContext}`,
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
  const keywords = Array.isArray(a.moodKeywords)
    ? (a.moodKeywords as string[]).join(", ")
    : "";
  return [
    `🎬 <b>${esc(a.title || "Analysis")}</b>`,
    ``,
    `🎯 <b>Micro-Niche:</b> ${esc(a.microNiche || "—")}`,
    `🔮 <b>Mood:</b> ${esc(keywords || "—")}`,
    `👥 <b>Audience:</b> ${esc(a.audienceProfile || "—")}`,
    `⚡ <b>Hook:</b> ${esc(a.hookSuggestion || "—")}`,
  ].join("\n");
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function createBot() {
  if (!token) return null;

  const bot = new Bot(token);

  const helpText = [
    `<b>SEEDER_OS Bot Commands:</b>`,
    ``,
    `📡 /analyze &lt;url&gt; — Analyze a video URL`,
    `📋 /recent — Show 5 most recent analyses`,
    `🎭 /drama — Generate a quick drama scene`,
    `❓ /help — Show this message`,
    ``,
    `Or just drop any TikTok, YouTube, or Instagram URL in the chat!`,
  ].join("\n");

  bot.command("start", (ctx) =>
    ctx.reply(
      `👾 <b>Welcome to SEEDER_OS Bot!</b>\n\nI can analyze viral video content and generate AI-powered outputs.\n\n` +
        helpText,
      { parse_mode: "HTML" }
    )
  );

  bot.command("help", (ctx) =>
    ctx.reply(helpText, { parse_mode: "HTML" })
  );

  bot.command("analyze", async (ctx) => {
    const parts = ctx.message.text.split(/\s+/);
    const url = parts[1];

    if (!url || !url.startsWith("http")) {
      await ctx.reply(
        "Please provide a URL. Example:\n<code>/analyze https://www.tiktok.com/@user/video/123</code>",
        { parse_mode: "HTML" }
      );
      return;
    }

    const platform = detectPlatform(url);
    const thinking = await ctx.reply(`⏳ Analyzing ${platform} video… this takes a few seconds.`);

    try {
      const result = await analyzeUrl(url, platform);
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply(formatAnalysis(result), { parse_mode: "HTML" });
    } catch (err) {
      logger.error({ err }, "Bot analysis failed");
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id).catch(() => {});
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

      await ctx.reply("📋 <b>Your 5 most recent analyses:</b>", { parse_mode: "HTML" });
      for (const a of analyses) {
        await ctx.reply(formatAnalysis(a), { parse_mode: "HTML" });
      }
    } catch (err) {
      logger.error({ err }, "Bot recent failed");
      await ctx.reply("❌ Could not fetch recent analyses.");
    }
  });

  bot.command("drama", async (ctx) => {
    const thinking = await ctx.reply("🎭 Generating a drama scene sample…");

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `You are a viral AI drama scene writer. Create a short 3-shot drama scene in JSON:
{
  "title": "Scene title",
  "logline": "One sentence premise",
  "shots": [
    { "shot": 1, "action": "What happens", "dialogue": "Character: spoken line" },
    { "shot": 2, "action": "What happens", "dialogue": "Character: spoken line" },
    { "shot": 3, "action": "What happens", "dialogue": "Character: spoken line" }
  ],
  "hook": "The viral caption hook",
  "teaser": "Next episode teaser"
}`,
          },
          {
            role: "user",
            content: "Generate a 3-shot viral drama scene — betrayal, revenge, love triangle, or family drama.",
          },
        ],
      });

      const content = aiResponse.choices[0]?.message?.content ?? "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const scene = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id);

      const shots = ((scene.shots || []) as { shot: number; action: string; dialogue: string }[])
        .map(
          (s) =>
            `<b>Shot ${s.shot}:</b> ${esc(s.action)}\n<i>"${esc(s.dialogue)}"</i>`
        )
        .join("\n\n");

      const msg = [
        `🎭 <b>${esc(scene.title || "Drama Scene")}</b>`,
        `<i>${esc(scene.logline || "")}</i>`,
        ``,
        shots,
        ``,
        `🪝 <b>Hook:</b> ${esc(scene.hook || "")}`,
        `📺 <b>Next:</b> ${esc(scene.teaser || "")}`,
      ].join("\n");

      await ctx.reply(msg, { parse_mode: "HTML" });
    } catch (err) {
      logger.error({ err }, "Bot drama failed");
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id).catch(() => {});
      await ctx.reply("❌ Drama generation failed. Please try again.");
    }
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return;

    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return;

    const url = urlMatch[0];
    const platform = detectPlatform(url);
    if (platform === "Other") return;

    const thinking = await ctx.reply(`⏳ Detected ${platform} URL. Analyzing…`);

    try {
      const result = await analyzeUrl(url, platform);
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply(formatAnalysis(result), { parse_mode: "HTML" });
    } catch (err) {
      logger.error({ err }, "Bot auto-analyze failed");
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id).catch(() => {});
      await ctx.reply("❌ Analysis failed. Please try again.");
    }
  });

  bot.catch((err) => {
    const ctx = err.ctx;
    logger.error({ err: err.error }, `Telegram bot error in update ${ctx.update.update_id}`);
    if (err.error instanceof GrammyError) {
      logger.error(`Error in request: ${err.error.description}`);
    } else if (err.error instanceof HttpError) {
      logger.error(`HTTP error: ${err.error}`);
    }
  });

  return bot;
}
