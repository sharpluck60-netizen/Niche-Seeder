import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dramaSeriesTable, dramaCharactersTable, dramaEpisodesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/drama-series", async (_req, res): Promise<void> => {
  try {
    const series = await db
      .select()
      .from(dramaSeriesTable)
      .orderBy(dramaSeriesTable.createdAt);
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

router.post("/drama-series", async (req, res): Promise<void> => {
  try {
    const { title, genre, tone, setting, premise, visualStyle } = req.body ?? {};
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const [series] = await db
      .insert(dramaSeriesTable)
      .values({ title, genre: genre ?? "Drama", tone: tone ?? "Intense & Emotional", setting: setting ?? "", premise: premise ?? "", visualStyle: visualStyle ?? "Realistic 3D" })
      .returning();
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: "Failed to create series" });
  }
});

router.get("/drama-series/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const [series] = await db.select().from(dramaSeriesTable).where(eq(dramaSeriesTable.id, id));
    if (!series) { res.status(404).json({ error: "Not found" }); return; }
    const characters = await db.select().from(dramaCharactersTable).where(eq(dramaCharactersTable.seriesId, id)).orderBy(dramaCharactersTable.createdAt);
    const episodes = await db.select().from(dramaEpisodesTable).where(eq(dramaEpisodesTable.seriesId, id)).orderBy(dramaEpisodesTable.episodeNumber);
    res.json({ ...series, characters, episodes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

router.delete("/drama-series/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(dramaSeriesTable).where(eq(dramaSeriesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete series" });
  }
});

router.post("/drama-series/:id/characters", async (req, res): Promise<void> => {
  try {
    const seriesId = parseInt(req.params.id);
    const { name, role, age, appearance, personality, relationships } = req.body ?? {};
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const [char] = await db
      .insert(dramaCharactersTable)
      .values({ seriesId, name, role: role ?? "Supporting", age: age ?? "", appearance: appearance ?? "", personality: personality ?? "", relationships: relationships ?? [] })
      .returning();
    res.json(char);
  } catch (err) {
    res.status(500).json({ error: "Failed to add character" });
  }
});

router.delete("/drama-series/:id/characters/:charId", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.charId);
    await db.delete(dramaCharactersTable).where(eq(dramaCharactersTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete character" });
  }
});

router.post("/drama-series/:id/episodes", async (req, res): Promise<void> => {
  try {
    const seriesId = parseInt(req.params.id);
    const { episodeNumber, title, premise, mainConflict, resolution, cliffhanger } = req.body ?? {};
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const [ep] = await db
      .insert(dramaEpisodesTable)
      .values({ seriesId, episodeNumber: episodeNumber ?? 1, title, premise: premise ?? "", mainConflict: mainConflict ?? "", resolution: resolution ?? "", cliffhanger: cliffhanger ?? "" })
      .returning();
    res.json(ep);
  } catch (err) {
    res.status(500).json({ error: "Failed to add episode" });
  }
});

router.patch("/drama-series/:id/episodes/:epId", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.epId);
    const updates = req.body ?? {};
    const [ep] = await db.update(dramaEpisodesTable).set(updates).where(eq(dramaEpisodesTable.id, id)).returning();
    res.json(ep);
  } catch (err) {
    res.status(500).json({ error: "Failed to update episode" });
  }
});

router.delete("/drama-series/:id/episodes/:epId", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.epId);
    await db.delete(dramaEpisodesTable).where(eq(dramaEpisodesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete episode" });
  }
});

export default router;
