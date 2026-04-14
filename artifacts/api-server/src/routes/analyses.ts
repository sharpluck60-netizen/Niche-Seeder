import { Router, type IRouter } from "express";
import { eq, desc, sql, count } from "drizzle-orm";
import { db, analysesTable, communitiesTable, sparkPostsTable } from "@workspace/db";
import { openai } from "../lib/openai";
import {
  CreateAnalysisBody,
  GetAnalysisParams,
  GetAnalysisResponse,
  ListAnalysesResponse,
  DeleteAnalysisParams,
  GetCommunitiesParams,
  GetCommunitiesResponse,
  DiscoverCommunitiesParams,
  GetSparkPostsParams,
  GetSparkPostsResponse,
  GenerateSparkPostsParams,
  GetDashboardStatsResponse,
  GetRecentAnalysesResponse,
  GetStrategyParams,
  GetStrategyResponse,
  GetBlueprintParams,
  GetBlueprintResponse,
  GenerateBlueprintParams,
  GetScriptParams,
  GetScriptResponse,
  GenerateScriptParams,
  GetMetadataParams,
  GetMetadataResponse,
  GenerateMetadataParams,
  GetSeriesParams,
  GetSeriesResponse,
  GenerateSeriesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/analyses", async (_req, res): Promise<void> => {
  const analyses = await db
    .select()
    .from(analysesTable)
    .orderBy(desc(analysesTable.createdAt));
  res.json(ListAnalysesResponse.parse(analyses));
});

router.post("/analyses", async (req, res): Promise<void> => {
  const parsed = CreateAnalysisBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [analysis] = await db
    .insert(analysesTable)
    .values({
      url: parsed.data.url,
      platform: parsed.data.platform,
      status: "analyzing",
    })
    .returning();

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are an expert in AI-generated cinematic content and social media distribution strategy for 2026. Analyze the given video URL and provide insights about its micro-niche, target audience, and growth potential. Respond in JSON format with these exact fields:
{
  "title": "A short descriptive title for this content",
  "microNiche": "The specific sub-genre (e.g., 'Dark Fantasy with 80s Retro-Futurism', 'Solarpunk Cinematic Noir')",
  "moodKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "audienceProfile": "A 2-3 sentence description of the target audience",
  "hookSuggestion": "A specific 1.5-second micro-hook suggestion for this content"
}`,
        },
        {
          role: "user",
          content: `Analyze this ${parsed.data.platform} video: ${parsed.data.url}. Based on the URL structure, platform, and any context clues, determine the micro-niche, mood keywords, audience profile, and suggest a compelling micro-hook.`,
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

    res.status(201).json(GetAnalysisResponse.parse(updated));
  } catch (error) {
    await db
      .update(analysesTable)
      .set({ status: "error" })
      .where(eq(analysesTable.id, analysis.id));
    req.log.error({ error }, "AI analysis failed");
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.get("/analyses/recent", async (_req, res): Promise<void> => {
  const analyses = await db
    .select()
    .from(analysesTable)
    .orderBy(desc(analysesTable.createdAt))
    .limit(5);
  res.json(GetRecentAnalysesResponse.parse(analyses));
});

router.get("/analyses/:id", async (req, res): Promise<void> => {
  const params = GetAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  res.json(GetAnalysisResponse.parse(analysis));
});

router.delete("/analyses/:id", async (req, res): Promise<void> => {
  const params = DeleteAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(analysesTable)
    .where(eq(analysesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/analyses/:id/communities", async (req, res): Promise<void> => {
  const params = GetCommunitiesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const communities = await db
    .select()
    .from(communitiesTable)
    .where(eq(communitiesTable.analysisId, params.data.id))
    .orderBy(desc(communitiesTable.relevanceScore));

  res.json(GetCommunitiesResponse.parse(communities));
});

router.post("/analyses/:id/communities", async (req, res): Promise<void> => {
  const params = DiscoverCommunitiesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are an expert in online community mapping for AI cinematic content creators in 2026. Given a micro-niche and audience profile, identify the top 20 most active and relevant communities across Discord, Telegram, and Reddit. Respond in JSON format as an array:
[
  {
    "name": "Community Name",
    "platform": "discord" | "telegram" | "reddit",
    "url": "https://...",
    "memberCount": "~5,000" or "10K+",
    "relevanceScore": 1-100,
    "reason": "Why this community is relevant"
  }
]
Sort by relevance score descending. Include a mix of all three platforms.`,
        },
        {
          role: "user",
          content: `Find communities for this AI cinematic content:
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Audience Profile: ${analysis.audienceProfile}
Platform: ${analysis.platform}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const communityData = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");

    const communities = await db
      .insert(communitiesTable)
      .values(
        communityData.map((c: { name: string; platform: string; url: string; memberCount: string; relevanceScore: number; reason: string }) => ({
          analysisId: params.data.id,
          name: c.name,
          platform: c.platform,
          url: c.url,
          memberCount: c.memberCount || "Unknown",
          relevanceScore: c.relevanceScore || 50,
          reason: c.reason || "",
        }))
      )
      .returning();

    res.status(201).json(GetCommunitiesResponse.parse(communities));
  } catch (error) {
    req.log.error({ error }, "Community discovery failed");
    res.status(500).json({ error: "Community discovery failed" });
  }
});

router.get("/analyses/:id/spark-posts", async (req, res): Promise<void> => {
  const params = GetSparkPostsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const posts = await db
    .select()
    .from(sparkPostsTable)
    .where(eq(sparkPostsTable.analysisId, params.data.id));

  res.json(GetSparkPostsResponse.parse(posts));
});

router.post("/analyses/:id/spark-posts", async (req, res): Promise<void> => {
  const params = GenerateSparkPostsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  const communities = await db
    .select()
    .from(communitiesTable)
    .where(eq(communitiesTable.analysisId, params.data.id))
    .orderBy(desc(communitiesTable.relevanceScore))
    .limit(10);

  if (communities.length === 0) {
    res.status(400).json({ error: "No communities found. Discover communities first." });
    return;
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are an expert at crafting organic, human-sounding promotional posts for AI cinematic content in 2026. Your posts should NOT look like ads or spam. They should feel like genuine community member posts that invite discussion about specific aspects (lighting, lore, technique, world-building). Generate one post per community provided. Respond in JSON format as an array:
[
  {
    "communityId": <integer>,
    "targetPlatform": "discord" | "telegram" | "reddit",
    "content": "The full post text (2-4 sentences, natural tone)",
    "tone": "curious" | "excited" | "analytical" | "conversational",
    "callToAction": "A subtle invitation to engage"
  }
]`,
        },
        {
          role: "user",
          content: `Generate spark posts for:
Video URL: ${analysis.url}
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Hook: ${analysis.hookSuggestion}

Target communities:
${communities.map((c) => `- ID ${c.id}: "${c.name}" on ${c.platform} (${c.reason})`).join("\n")}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const postData = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");

    const posts = await db
      .insert(sparkPostsTable)
      .values(
        postData.map((p: { communityId: number; targetPlatform: string; content: string; tone: string; callToAction: string }) => ({
          analysisId: params.data.id,
          communityId: p.communityId || communities[0].id,
          targetPlatform: p.targetPlatform || "reddit",
          content: p.content || "",
          tone: p.tone || "conversational",
          callToAction: p.callToAction || "",
        }))
      )
      .returning();

    res.status(201).json(GetSparkPostsResponse.parse(posts));
  } catch (error) {
    req.log.error({ error }, "Spark post generation failed");
    res.status(500).json({ error: "Spark post generation failed" });
  }
});

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [analysisCount] = await db.select({ value: count() }).from(analysesTable);
  const [communityCount] = await db.select({ value: count() }).from(communitiesTable);
  const [sparkPostCount] = await db.select({ value: count() }).from(sparkPostsTable);

  const platformCounts = await db
    .select({
      platform: analysesTable.platform,
      count: count(),
    })
    .from(analysesTable)
    .groupBy(analysesTable.platform);

  const platformBreakdown = {
    youtube: 0,
    tiktok: 0,
    facebook: 0,
  };
  for (const row of platformCounts) {
    if (row.platform in platformBreakdown) {
      platformBreakdown[row.platform as keyof typeof platformBreakdown] = row.count;
    }
  }

  const recentAnalyses = await db
    .select({ microNiche: analysesTable.microNiche })
    .from(analysesTable)
    .where(sql`${analysesTable.microNiche} != ''`)
    .orderBy(desc(analysesTable.createdAt))
    .limit(5);

  res.json(
    GetDashboardStatsResponse.parse({
      totalAnalyses: analysisCount.value,
      totalCommunities: communityCount.value,
      totalSparkPosts: sparkPostCount.value,
      platformBreakdown,
      recentNiches: recentAnalyses.map((a) => a.microNiche),
    })
  );
});

router.get("/analyses/:id/strategy", async (req, res): Promise<void> => {
  const params = GetStrategyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  const platformStrategies: Record<string, { waterfallTrigger: string; microHook: string; contentPillars: string[]; wildcardIdea: string }> = {
    tiktok: {
      waterfallTrigger: 'Target users who curate "AI Art Collections" and "World-Building Reference" folders. A Save is worth 10x more than a Like in 2026. Optimize for saves by making each frame reference-worthy.',
      microHook: `Start with an Extreme Close-Up or Physics-Defying Movement in the first 1.5 seconds. For "${analysis.microNiche}", try: ${analysis.hookSuggestion}`,
      contentPillars: [
        "Character Consistency — Use reference sheets to avoid Face Drift",
        "High-Fidelity Spatial Audio — AI-generated foley and binaural soundscapes",
        "Saveable Frames — Every shot should be screenshot-worthy",
        "Micro-Hook Mastery — Freeze the thumb in under 2 seconds",
      ],
      wildcardIdea: `Create a "Found Footage" variant — a recovered security camera feed from your cinematic universe. POV Lore content gets 300% more shares because it feels real and mysterious.`,
    },
    youtube: {
      waterfallTrigger: `YouTube's AI indexes your video pixels. Focus metadata on Mood Keywords like "${analysis.moodKeywords.slice(0, 3).join('", "')}" rather than generic "AI movie" tags. The algorithm now reads visual content.`,
      microHook: `Open with a visual paradox that makes viewers pause. For "${analysis.microNiche}": ${analysis.hookSuggestion}`,
      contentPillars: [
        "Mood Keyword Optimization — Let the algorithm read your pixels",
        "Character Consistency — The #1 factor for avoiding AI throttling",
        "Sound Design > Visuals — Spatial audio keeps viewers watching",
        "World-Building Depth — Create interconnected lore across videos",
      ],
      wildcardIdea: `Create a "Digital Artifact" companion piece — a video that looks like a recovered document or transmission from your cinematic universe. These companion pieces drive search discovery.`,
    },
    facebook: {
      waterfallTrigger: 'Facebook rewards long-form comment threads. End your video with a moral choice or cliffhanger that forces debate. The algorithm pushes content that generates sustained discussion.',
      microHook: `Lead with a controversial premise that demands an opinion. For "${analysis.microNiche}": ${analysis.hookSuggestion}`,
      contentPillars: [
        "Debate Engine — End with moral choices and cliffhangers",
        "Comment Thread Optimization — Pose questions that demand responses",
        "Character Consistency — Build recognizable protagonists",
        "Community Building — Create lore that fans want to discuss",
      ],
      wildcardIdea: `Post a "Choose Your Path" still from your cinematic universe and let the comments decide what happens next. This generates the long-form threads Facebook's algorithm loves.`,
    },
  };

  const strategy = platformStrategies[analysis.platform] || platformStrategies.youtube;

  res.json(
    GetStrategyResponse.parse({
      platform: analysis.platform,
      ...strategy,
    })
  );
});

router.get("/analyses/:id/blueprint", async (req, res): Promise<void> => {
  const params = GetBlueprintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  if (!analysis.blueprintData) {
    res.status(404).json({ error: "Blueprint not yet generated" });
    return;
  }

  res.json(GetBlueprintResponse.parse(analysis.blueprintData));
});

router.post("/analyses/:id/blueprint", async (req, res): Promise<void> => {
  const params = GenerateBlueprintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [analysis] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a 2026 AI cinematic content strategist specializing in algorithm optimization and world-building retention. Given a video's micro-niche, mood keywords, and audience profile, generate a comprehensive Content Blueprint. Respond in JSON:
{
  "algorithmReadinessScore": <integer 0-100 overall score>,
  "algorithmReadinessBreakdown": {
    "hookStrength": <0-100, how strong the 1.5s micro-hook potential is>,
    "audienceClarity": <0-100, how clearly defined the target audience is>,
    "nicheSpecificity": <0-100, how specific the micro-niche is>,
    "soundDesignPotential": <0-100, how much spatial audio could elevate this>,
    "characterConsistencyRisk": <0-100, higher = more risk of face drift throttling>
  },
  "characterConsistencyTips": [
    "Specific tip for maintaining character reference in this micro-niche",
    "Another actionable tip"
  ],
  "soundDesignPlan": [
    "Specific sound design element for this micro-niche",
    "Binaural/foley recommendation"
  ],
  "povLoreIdea": "A detailed 'Found Footage' or 'Digital Artifact' video concept specific to this micro-niche — describe the visual style, the fictional origin story, and why it would go viral",
  "identityLoyaltyFactors": [
    "Specific factor that builds Identity Loyalty for this niche",
    "World-building element that creates repeat viewers"
  ],
  "highIntentGainsTactics": [
    "Platform-specific High-Intent Gain tactic for this content",
    "Another tactic targeting the Save/Search/Debate signal"
  ]
}`,
        },
        {
          role: "user",
          content: `Generate a Content Blueprint for:
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Audience Profile: ${analysis.audienceProfile}
Hook Suggestion: ${analysis.hookSuggestion}
Platform: ${analysis.platform}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const blueprintData = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

    const fullBlueprint = {
      analysisId: analysis.id,
      algorithmReadinessScore: blueprintData.algorithmReadinessScore ?? 50,
      algorithmReadinessBreakdown: blueprintData.algorithmReadinessBreakdown ?? {
        hookStrength: 50,
        audienceClarity: 50,
        nicheSpecificity: 50,
        soundDesignPotential: 50,
        characterConsistencyRisk: 50,
      },
      characterConsistencyTips: blueprintData.characterConsistencyTips ?? [],
      soundDesignPlan: blueprintData.soundDesignPlan ?? [],
      povLoreIdea: blueprintData.povLoreIdea ?? "",
      identityLoyaltyFactors: blueprintData.identityLoyaltyFactors ?? [],
      highIntentGainsTactics: blueprintData.highIntentGainsTactics ?? [],
    };

    await db
      .update(analysesTable)
      .set({ blueprintData: fullBlueprint })
      .where(eq(analysesTable.id, analysis.id));

    res.status(201).json(GetBlueprintResponse.parse(fullBlueprint));
  } catch (error) {
    req.log.error({ error }, "Blueprint generation failed");
    res.status(500).json({ error: "Blueprint generation failed" });
  }
});

router.get("/analyses/:id/script", async (req, res): Promise<void> => {
  const params = GetScriptParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }
  if (!analysis.scriptData) { res.status(404).json({ error: "Script not yet generated" }); return; }
  res.json(GetScriptResponse.parse(analysis.scriptData));
});

router.post("/analyses/:id/script", async (req, res): Promise<void> => {
  const params = GenerateScriptParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a 2026 AI cinematic short-film screenwriter. Write a complete cinematic script for a 60-90 second viral short film based on the given micro-niche. The script must open with a 1.5-second physics-defying or extreme-close-up hook, have 3 acts, and end with a cliffhanger or moral question. Include visual notes and spatial audio cues. Respond in JSON:
{
  "logline": "One-sentence premise",
  "openingHook": "Precise 1.5-second opening scene — what the viewer sees in the first frame to freeze the scroll",
  "acts": [
    {
      "actNumber": 1,
      "title": "Act title",
      "description": "What happens in this act",
      "visualNotes": "Camera angle, lighting, color grade, AI generation prompt hint",
      "dialogueLine": "Key spoken or text-on-screen line",
      "soundDesignNote": "Specific spatial audio / foley instruction"
    }
  ],
  "closingCliffhanger": "The final 3 seconds — what moral question or revelation freezes the viewer",
  "estimatedRuntime": "e.g. 75 seconds",
  "characterDescription": "Detailed physical description of the protagonist for AI generation consistency",
  "worldBuildingNote": "One lore element hidden in the visuals that rewards repeat viewers"
}`,
        },
        {
          role: "user",
          content: `Write a viral cinematic script for:
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Hook Suggestion: ${analysis.hookSuggestion}
Audience: ${analysis.audienceProfile}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const raw = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

    const scriptData = {
      analysisId: analysis.id,
      logline: raw.logline ?? "",
      openingHook: raw.openingHook ?? "",
      acts: raw.acts ?? [],
      closingCliffhanger: raw.closingCliffhanger ?? "",
      estimatedRuntime: raw.estimatedRuntime ?? "",
      characterDescription: raw.characterDescription ?? "",
      worldBuildingNote: raw.worldBuildingNote ?? "",
    };

    await db.update(analysesTable).set({ scriptData }).where(eq(analysesTable.id, analysis.id));
    res.status(201).json(GetScriptResponse.parse(scriptData));
  } catch (error) {
    req.log.error({ error }, "Script generation failed");
    res.status(500).json({ error: "Script generation failed" });
  }
});

router.get("/analyses/:id/metadata", async (req, res): Promise<void> => {
  const params = GetMetadataParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }
  if (!analysis.metadataData) { res.status(404).json({ error: "Metadata not yet generated" }); return; }
  res.json(GetMetadataResponse.parse(analysis.metadataData));
});

router.post("/analyses/:id/metadata", async (req, res): Promise<void> => {
  const params = GenerateMetadataParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a 2026 viral content metadata specialist. Generate platform-optimized metadata for a cinematic short. TikTok titles must be under 100 chars, YouTube titles under 60. Descriptions must be platform-native. Tags are for YouTube search. Hashtags for TikTok/Facebook. Best posting times are based on 2026 algorithm data for this niche. Generate 4 different 1.5-second hook variants to A/B test. Respond in JSON:
{
  "youtube": {
    "title": "SEO-optimized YouTube title with mood keywords",
    "description": "YouTube description with lore hook, mood keywords, and a question that drives comments (max 200 words)",
    "bestPostingTime": "e.g. Thursday 2PM EST"
  },
  "tiktok": {
    "title": "TikTok caption optimized for saves",
    "description": "TikTok bio-link description (2 sentences max)",
    "bestPostingTime": "e.g. Friday 7PM EST"
  },
  "facebook": {
    "title": "Facebook post opener that sparks debate",
    "description": "Facebook post body ending with a moral question (3-4 sentences)",
    "bestPostingTime": "e.g. Sunday 1PM EST"
  },
  "tags": ["youtube", "tag", "list", "of", "12", "tags"],
  "hashtags": ["TikTok", "and", "Facebook", "hashtags"],
  "thumbnailConcept": "Detailed visual description of the perfect thumbnail — what to show, text overlay, color grade, composition",
  "hookVariants": [
    "Hook variant A (1.5 seconds)",
    "Hook variant B",
    "Hook variant C",
    "Hook variant D"
  ]
}`,
        },
        {
          role: "user",
          content: `Generate metadata for:
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Audience: ${analysis.audienceProfile}
Platform: ${analysis.platform}
Hook: ${analysis.hookSuggestion}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const raw = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

    const metadataData = {
      analysisId: analysis.id,
      youtube: raw.youtube ?? { title: "", description: "", bestPostingTime: "" },
      tiktok: raw.tiktok ?? { title: "", description: "", bestPostingTime: "" },
      facebook: raw.facebook ?? { title: "", description: "", bestPostingTime: "" },
      tags: raw.tags ?? [],
      hashtags: raw.hashtags ?? [],
      thumbnailConcept: raw.thumbnailConcept ?? "",
      hookVariants: raw.hookVariants ?? [],
    };

    await db.update(analysesTable).set({ metadataData }).where(eq(analysesTable.id, analysis.id));
    res.status(201).json(GetMetadataResponse.parse(metadataData));
  } catch (error) {
    req.log.error({ error }, "Metadata generation failed");
    res.status(500).json({ error: "Metadata generation failed" });
  }
});

router.get("/analyses/:id/series", async (req, res): Promise<void> => {
  const params = GetSeriesParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }
  if (!analysis.seriesData) { res.status(404).json({ error: "Series not yet generated" }); return; }
  res.json(GetSeriesResponse.parse(analysis.seriesData));
});

router.post("/analyses/:id/series", async (req, res): Promise<void> => {
  const params = GenerateSeriesParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [analysis] = await db.select().from(analysesTable).where(eq(analysesTable.id, params.data.id));
  if (!analysis) { res.status(404).json({ error: "Analysis not found" }); return; }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a 2026 AI cinematic universe architect. Design a 7-episode viral content series that builds Identity Loyalty — each episode must end with a cliffhanger that makes the viewer NEED to see the next one. Include hidden lore elements that reward repeat viewers. Each episode is 60-90 seconds. Respond in JSON:
{
  "seriesTitle": "The series universe name",
  "premise": "2-3 sentence series premise that hooks the right micro-niche audience",
  "episodes": [
    {
      "number": 1,
      "title": "Episode title",
      "logline": "One-sentence episode premise",
      "openingHook": "The 1.5-second freeze-the-scroll opening",
      "worldBuildingElement": "The hidden lore element in this episode",
      "cliffhanger": "The final 3 seconds — what makes them watch the next one"
    }
  ],
  "loreElements": [
    "Recurring visual symbol and its meaning",
    "Hidden world-building detail"
  ],
  "characterArcs": [
    "Protagonist arc across the series",
    "Secondary character development"
  ],
  "identityLoyaltyHook": "The one thing fans will identify with and obsess over — the 'Mandela Effect' moment of your universe"
}`,
        },
        {
          role: "user",
          content: `Design a 7-episode viral series for:
Micro-Niche: ${analysis.microNiche}
Mood Keywords: ${analysis.moodKeywords.join(", ")}
Audience: ${analysis.audienceProfile}
Hook Style: ${analysis.hookSuggestion}`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const raw = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");

    const seriesData = {
      analysisId: analysis.id,
      seriesTitle: raw.seriesTitle ?? "",
      premise: raw.premise ?? "",
      episodes: raw.episodes ?? [],
      loreElements: raw.loreElements ?? [],
      characterArcs: raw.characterArcs ?? [],
      identityLoyaltyHook: raw.identityLoyaltyHook ?? "",
    };

    await db.update(analysesTable).set({ seriesData }).where(eq(analysesTable.id, analysis.id));
    res.status(201).json(GetSeriesResponse.parse(seriesData));
  } catch (error) {
    req.log.error({ error }, "Series generation failed");
    res.status(500).json({ error: "Series generation failed" });
  }
});

export default router;
