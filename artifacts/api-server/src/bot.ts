import { Bot, GrammyError, HttpError } from "grammy";
import { db, analysesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "./lib/logger";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram bot will not start.");
}

function formatAnalysis(a: typeof analysesTable.$inferSelect): string {
  const keywords = Array.isArray(a.moodKeywords)
    ? (a.moodKeywords as string[]).join(", ")
    : "";
  return [
    `🎬 <b>${esc(a.title || "Untitled")}</b>`,
    `🔗 <i>${esc(a.platform)} — ${esc(a.url)}</i>`,
    ``,
    `🎯 <b>Micro-Niche:</b> ${esc(a.microNiche || "—")}`,
    `🔮 <b>Mood:</b> ${esc(keywords || "—")}`,
    `👥 <b>Audience:</b> ${esc(a.audienceProfile || "—")}`,
    `⚡ <b>Hook:</b> ${esc(a.hookSuggestion || "—")}`,
    `📅 <b>Analyzed:</b> ${a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}`,
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
    `📋 /recent — Show your 5 latest analyses`,
    `❓ /help — Show this message`,
    ``,
    `Use the web app to run analyses and generate drama content. Results will be accessible here via /recent.`,
  ].join("\n");

  bot.command("start", (ctx) =>
    ctx.reply(
      `👾 <b>Welcome to SEEDER_OS Bot!</b>\n\nThis bot surfaces your latest content analyses from the app.\n\n` +
        helpText,
      { parse_mode: "HTML" }
    )
  );

  bot.command("help", (ctx) =>
    ctx.reply(helpText, { parse_mode: "HTML" })
  );

  bot.command("recent", async (ctx) => {
    try {
      const analyses = await db
        .select()
        .from(analysesTable)
        .orderBy(desc(analysesTable.createdAt))
        .limit(5);

      if (analyses.length === 0) {
        await ctx.reply(
          "No analyses yet. Run one from the web app and it will appear here.",
          { parse_mode: "HTML" }
        );
        return;
      }

      await ctx.reply("📋 <b>Your 5 most recent analyses:</b>", { parse_mode: "HTML" });
      for (const a of analyses) {
        await ctx.reply(formatAnalysis(a), { parse_mode: "HTML" });
      }
    } catch (err) {
      logger.error({ err }, "Bot /recent failed");
      await ctx.reply("❌ Could not fetch recent analyses. Please try again.");
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
