import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dramaEpisodesTable } from "@workspace/db";
import { openai } from "../lib/openai";

const router: IRouter = Router();

type CharacterInput = {
  name: string;
  role: string;
  age: string;
  appearance: string;
  personality: string;
};

type SceneConfig = {
  series?: {
    title: string;
    genre: string;
    tone: string;
    setting: string;
    premise: string;
    visualStyle: string;
  };
  characters: CharacterInput[];
  sceneSettings: {
    location: string;
    conflict: string;
    emotionalBeat: string;
    scenePurpose: string;
    shotCount: number;
    dialogueLevel: string;
  };
  episodeId?: number;
};

router.post("/drama-engine/generate", async (req, res): Promise<void> => {
  try {
    const config: SceneConfig = req.body ?? {};
    const { series, characters, sceneSettings, episodeId } = config;

    const characterProfiles = characters
      .map(
        (c) =>
          `• ${c.name} (${c.role}, age ${c.age || "unknown"}): ${c.appearance}. Personality: ${c.personality}`
      )
      .join("\n");

    const seriesContext = series
      ? `SERIES: "${series.title}" — ${series.genre} series, tone: ${series.tone}, visual style: ${series.visualStyle}.\nPremise: ${series.premise}`
      : "Standalone scene — no series context.";

    const systemPrompt = `You are a master AI drama scene architect. You create viral short-form AI-generated storytelling scenes for TikTok and Instagram — the same style as sisi_lyndah_tales and other viral AI drama creators.

Your output is a single scene that will be rendered as a sequence of AI-generated images (one per shot) with captions. Think cinematic 3D drama — emotional confrontations, family betrayal, restaurant showdowns, office power plays, love triangles.

Each shot needs a precise, detailed image generation prompt optimized for Midjourney, Flux, and DALL-E that recreates the exact characters with consistent appearance.

Return ONLY valid JSON matching this exact structure:
{
  "sceneTitle": "string — punchy dramatic title",
  "sceneLogline": "string — one sentence that makes you need to watch",
  "openingHook": "string — the very first visual moment that stops the scroll",
  "emotionalArc": "string — how emotion escalates across all shots (e.g., Shock → Disbelief → Fury → Confrontation)",
  "shots": [
    {
      "number": 1,
      "type": "string — Establishing Shot | Close-Up | Two-Shot | Reaction Shot | Insert Shot | Over-the-Shoulder | Wide | POV",
      "setting": "string — exact location description with lighting and atmosphere",
      "charactersPresent": ["character name"],
      "action": "string — what physically happens in this shot",
      "dialogue": [{"character": "name", "line": "exact dialogue line"}],
      "cameraAngle": "string — camera position and movement",
      "lighting": "string — lighting description",
      "sound": "string — background audio/music note",
      "emotionalBeat": "string — the emotion this shot delivers",
      "imagePrompt": "string — detailed, character-consistent image generation prompt for this shot (include appearance details, expression, setting, lighting, style, camera angle). Min 80 words."
    }
  ],
  "captionHook": "string — the viral TikTok opening caption (the hook that gets them watching — 5-10 words, emotional)",
  "viralAngle": "string — why this specific scene will perform well on social media",
  "nextEpisodeTeaser": "string — one-line cliffhanger to tease the next scene"
}`;

    const userPrompt = `Create a ${sceneSettings.scenePurpose} scene with ${sceneSettings.shotCount} shots.

${seriesContext}

CHARACTERS IN THIS SCENE:
${characterProfiles}

SCENE PARAMETERS:
- Location: ${sceneSettings.location}
- Central conflict: ${sceneSettings.conflict}
- Emotional beat: ${sceneSettings.emotionalBeat}
- Dialogue level: ${sceneSettings.dialogueLevel}
- Visual style: ${series?.visualStyle ?? "Realistic 3D cinematic"}

Make the image prompts hyper-specific about each character's appearance so they stay consistent across every shot. The scene should feel like a premium African/Black drama series episode — emotional, relatable, visually stunning.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "AI did not return valid JSON" });
      return;
    }

    const sceneData = JSON.parse(jsonMatch[0]);

    if (episodeId) {
      await db
        .update(dramaEpisodesTable)
        .set({ sceneData, status: "generated" })
        .where(eq(dramaEpisodesTable.id, episodeId));
    }

    res.json(sceneData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
