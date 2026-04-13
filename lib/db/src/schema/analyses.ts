import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysesTable = pgTable("analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  platform: text("platform").notNull(),
  title: text("title").notNull().default(""),
  microNiche: text("micro_niche").notNull().default(""),
  moodKeywords: text("mood_keywords").array().notNull().default([]),
  audienceProfile: text("audience_profile").notNull().default(""),
  hookSuggestion: text("hook_suggestion").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysesTable).omit({ id: true, createdAt: true });
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysesTable.$inferSelect;

export const communitiesTable = pgTable("communities", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull().references(() => analysesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  memberCount: text("member_count").notNull().default("Unknown"),
  relevanceScore: integer("relevance_score").notNull().default(0),
  reason: text("reason").notNull().default(""),
});

export const insertCommunitySchema = createInsertSchema(communitiesTable).omit({ id: true });
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communitiesTable.$inferSelect;

export const sparkPostsTable = pgTable("spark_posts", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull().references(() => analysesTable.id, { onDelete: "cascade" }),
  communityId: integer("community_id").notNull().references(() => communitiesTable.id, { onDelete: "cascade" }),
  targetPlatform: text("target_platform").notNull(),
  content: text("content").notNull(),
  tone: text("tone").notNull().default("conversational"),
  callToAction: text("call_to_action").notNull().default(""),
});

export const insertSparkPostSchema = createInsertSchema(sparkPostsTable).omit({ id: true });
export type InsertSparkPost = z.infer<typeof insertSparkPostSchema>;
export type SparkPost = typeof sparkPostsTable.$inferSelect;
