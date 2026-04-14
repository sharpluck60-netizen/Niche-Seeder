import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.post("/image-lab/analyze", async (req, res): Promise<void> => {
  const { imageBase64, mimeType = "image/jpeg" } = req.body ?? {};

  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a world-class Instagram AI content strategist and creative director in 2026, specializing in viral AI-generated imagery. You deeply understand what makes images go viral on Instagram: the combination of emotional shock, visual novelty, conceptual depth, and scroll-stopping composition.

Your job is to:
1. Analyze the uploaded reference image deeply — identify the visual technique, concept, style, and what makes it powerful
2. Rate how viral it is currently (1-10)
3. Generate exactly 6 killer Instagram image concepts that SURPASS the reference — each must be more emotionally charged, visually surprising, and algorithmically optimized than the original

For each idea, provide a complete, ready-to-use AI image generation prompt that is highly specific and detailed.

Respond ONLY in this exact JSON format:
{
  "imageAnalysis": {
    "detectedStyle": "Short style label",
    "technique": "The core visual/conceptual technique used",
    "currentConcept": "2-3 sentence description of what makes this image work",
    "conceptStrength": 7,
    "viralityFactors": ["factor1", "factor2", "factor3"],
    "weaknesses": ["what holds it back from being even more viral"]
  },
  "killerIdeas": [
    {
      "title": "Concept Name",
      "concept": "2 sentence description of the visual concept",
      "visualPrompt": "Full, detailed AI image generation prompt — include camera angle, lighting, composition, mood, details, style, and resolution",
      "caption": "Ready-to-post Instagram caption with opening hook and emotional call to action",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
      "upgradeReason": "Exactly why this surpasses the reference image in virality",
      "viralityScore": 9,
      "postingTip": "Best posting strategy, time, and Instagram-specific tactic for this image"
    }
  ]
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and generate 6 killer Instagram concepts that surpass it. Focus on Instagram only — the goal is maximum saves, shares, and reach on that platform.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    req.log.error({ error }, "Image lab analysis failed");
    res.status(500).json({ error: "Image analysis failed. Please try again." });
  }
});

router.post("/image-lab/combine", async (req, res): Promise<void> => {
  const { ideaA, ideaB } = req.body ?? {};

  if (!ideaA || !ideaB) {
    res.status(400).json({ error: "ideaA and ideaB are required" });
    return;
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a world-class creative director specializing in viral Instagram AI content. You are a master at combining two strong creative concepts into a single, jaw-dropping "WOW" idea that is greater than the sum of its parts.

Your job: Take two killer Instagram image concepts and fuse them into ONE mega-concept that combines the strongest elements of both, creating something completely unexpected and uniquely powerful.

The fusion must feel intentional and surprising — not just a mashup. Find the creative thread that connects the two ideas and build something new that neither idea could achieve alone.

Respond ONLY in this exact JSON format:
{
  "fusionTitle": "The Fusion Title",
  "fusionTagline": "One-sentence tagline that captures the wow factor",
  "fusionConcept": "3-4 sentences describing exactly what the fused concept looks like and why it works as a single image",
  "fusionReason": "Exactly why combining these two ideas creates something more powerful than either alone — the creative alchemy",
  "visualPrompt": "Full, hyper-detailed AI image generation prompt for the fused concept — camera angle, composition, lighting, details, mood, style, technical specs",
  "caption": "Ready-to-post Instagram caption with a powerful hook that highlights the unexpected fusion angle",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
  "viralityScore": 10,
  "postingTip": "Best posting strategy for maximum viral impact of this fusion concept"
}`,
        },
        {
          role: "user",
          content: `Combine these two Instagram image concepts into one WOW mega-idea:

CONCEPT A: "${ideaA.title}"
${ideaA.concept}
Visual approach: ${ideaA.visualPrompt}

CONCEPT B: "${ideaB.title}"
${ideaB.concept}
Visual approach: ${ideaB.visualPrompt}

Fuse these into a single, more powerful concept that uses the best of both.`,
        },
      ],
    });

    const content = aiResponse.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    req.log.error({ error }, "Image lab combine failed");
    res.status(500).json({ error: "Idea combination failed. Please try again." });
  }
});

export default router;
