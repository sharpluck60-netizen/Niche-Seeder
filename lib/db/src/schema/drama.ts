import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dramaSeriesTable = pgTable("drama_series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  genre: text("genre").notNull().default("Drama"),
  tone: text("tone").notNull().default("Intense & Emotional"),
  setting: text("setting").notNull().default(""),
  premise: text("premise").notNull().default(""),
  visualStyle: text("visual_style").notNull().default("Realistic 3D"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dramaCharactersTable = pgTable("drama_characters", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => dramaSeriesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull().default("Supporting"),
  age: text("age").notNull().default(""),
  appearance: text("appearance").notNull().default(""),
  personality: text("personality").notNull().default(""),
  relationships: jsonb("relationships")
    .$type<Array<{ character: string; relation: string }>>()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dramaEpisodesTable = pgTable("drama_episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => dramaSeriesTable.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number").notNull().default(1),
  title: text("title").notNull(),
  premise: text("premise").notNull().default(""),
  mainConflict: text("main_conflict").notNull().default(""),
  resolution: text("resolution").notNull().default(""),
  cliffhanger: text("cliffhanger").notNull().default(""),
  status: text("status").notNull().default("planned"),
  sceneData: jsonb("scene_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDramaSeriesSchema = createInsertSchema(dramaSeriesTable).omit({ id: true, createdAt: true });
export const insertDramaCharacterSchema = createInsertSchema(dramaCharactersTable).omit({ id: true, createdAt: true });
export const insertDramaEpisodeSchema = createInsertSchema(dramaEpisodesTable).omit({ id: true, createdAt: true });

export type InsertDramaSeries = z.infer<typeof insertDramaSeriesSchema>;
export type DramaSeries = typeof dramaSeriesTable.$inferSelect;
export type InsertDramaCharacter = z.infer<typeof insertDramaCharacterSchema>;
export type DramaCharacter = typeof dramaCharactersTable.$inferSelect;
export type InsertDramaEpisode = z.infer<typeof insertDramaEpisodeSchema>;
export type DramaEpisode = typeof dramaEpisodesTable.$inferSelect;
