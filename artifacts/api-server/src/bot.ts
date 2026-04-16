import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { db, analysesTable } from "@workspace/db";
import { openai } from "./lib/openai";
import { desc } from "drizzle-orm";
import { logger } from "./lib/logger";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram bot will not start.");

// ── Escape HTML ─────────────────────────────────────────────────────────────
function esc(t: string) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── HAIRSTYLE DATA ──────────────────────────────────────────────────────────
const hairstyles = {
  female: [
    { name: "Knotless Box Braids", tags: ["TRENDING", "PROTECTIVE"], visualDetail: "perfect knotless box braids with smooth flat roots and no visible knots, each braid uniform in size hanging straight down in a natural fall" },
    { name: "Fulani Braids", tags: ["CULTURAL", "HOT"], visualDetail: "a central cornrow running down the middle of the scalp with loose box braids framing the face, thin gold ring beads and cowrie shells threaded on hanging braid ends" },
    { name: "Butterfly Locs", tags: ["VIRAL", "TRENDY"], visualDetail: "distressed butterfly locs with a fluffy, unraveled middle section on each loc giving a feathery boho appearance, roots are neat cornrows" },
    { name: "High Puff", tags: ["QUICK", "NATURAL"], visualDetail: "natural coily hair gathered into a full voluminous puff at the crown, edges laid sleek with gel, exposed nape and temples" },
    { name: "Goddess Braids", tags: ["ELEGANT"], visualDetail: "thick chunky goddess braids swept back from the face in a sculptural updo, with wavy curly extensions spilling out at the ends like a waterfall" },
    { name: "Lemonade Braids", tags: ["VIRAL", "ICONIC"], visualDetail: "side-swept cornrows running horizontally from the forehead to the nape, inspired by Beyoncé, sleek and bold with a distinctive side-part" },
  ],
  male: [
    { name: "Fade with Waves", tags: ["CLASSIC", "SHARP"], visualDetail: "360 waves on top with a clean skin fade on the sides, waves compressed and defined throughout the crown, razor-sharp line-up at the hairline" },
    { name: "Loc'd Up (Starter Locs)", tags: ["NATURAL", "RISING"], visualDetail: "fresh starter locs at the early budding stage, uniform in size across the scalp, roots showing natural texture, neat parts between each section" },
    { name: "High Top Fade", tags: ["BOLD", "RETRO"], visualDetail: "flat-top afro rising high above a tight skin fade, the top perfectly leveled and squared off, sides completely clean" },
    { name: "Cornrows (Straight Back)", tags: ["CLASSIC"], visualDetail: "neat straight-back cornrows running from forehead to nape in parallel rows, clean parts between each braid, tight to the scalp" },
    { name: "Afro Puff", tags: ["NATURAL", "STATEMENT"], visualDetail: "full rounded natural afro with maximum volume and uniformity, pick-shaped silhouette, tight coils maintaining their shape" },
    { name: "Braids with Fade", tags: ["TRENDING"], visualDetail: "medium-length box braids on top with a clean fade underneath, contrast between the loose hanging braids and the tight fade creating a bold silhouette" },
  ],
};

// ── DANCE DATA ───────────────────────────────────────────────────────────────
const danceStyles = [
  { id: "afrobeats", label: "Afrobeats 🌍", desc: "Fluid waist, grounded bounce, West African roots", prompt: "Photorealistic video: performer doing Afrobeats dance — fluid waist isolations, grounded bounce, rhythmic footwork deeply connected to the beat, West African movement vocabulary. Tropical or urban setting." },
  { id: "hiphop", label: "Hip-Hop 🔥", desc: "Cypher energy, street credibility, pure sauce", prompt: "Photorealistic video: performer doing Hip-Hop freestyle in a cypher circle — bouncing footwork, arm swings, sharp isolations, head nods synced to the beat. Graffiti wall backdrop, golden hour." },
  { id: "dancehall", label: "Dancehall 🇯🇲", desc: "Jamaican riddims, wine and kotch energy", prompt: "Photorealistic video: performer doing Dancehall — wine and kotch movements, skank footwork, shoulder rolls, full body rhythm deeply locked to a Jamaican riddim beat. Outdoor tropical street setting." },
  { id: "kpop", label: "K-Pop Sync 🌟", desc: "Tight group synchronisation, clean choreography", prompt: "Photorealistic video: 4-person K-Pop group in perfect synchronisation — clean sharp arm movements, synchronized footwork, formation changes. Clean studio or neon-lit stage backdrop." },
  { id: "voguing", label: "Voguing / Ballroom 👑", desc: "Runway realness, death drops, categories served", prompt: "Photorealistic video: performer voguing on a ballroom runway — dramatic dip, death drop, precise hand performance, catwalk attitude, sharp poses snapping to the beat. Ballroom with judges visible." },
  { id: "waacking", label: "Waacking 💥", desc: "Arms whipping, 70s disco soul, pure drama", prompt: "Photorealistic video: performer waacking — arms whipping at full speed through the air creating dramatic arcs, 70s disco energy, dramatic facial expression matching the musicality. Disco club setting." },
];

// ── MAP / LANDMARK DATA ──────────────────────────────────────────────────────
const landmarks = [
  { name: "Eiffel Tower", city: "Paris 🇫🇷", vibe: "romantic, iconic, golden-hour", prompt: "the iconic Eiffel Tower at golden hour, warm amber light reflecting off the iron lattice structure, Seine River visible below, soft Parisian rooftops in the background, atmospheric haze" },
  { name: "Santorini Cliffside", city: "Greece 🇬🇷", vibe: "azure, dreamy, luxury", prompt: "white-domed Santorini clifftop at sunset, iconic blue-domed churches, whitewashed cubic architecture, the Aegean Sea in vivid cobalt blue, bougainvillea in the foreground, golden sky" },
  { name: "Dubai Skyline", city: "Dubai 🇦🇪", vibe: "futuristic, luxury, power", prompt: "the Dubai skyline at blue hour — Burj Khalifa piercing the clouds, futuristic glass towers reflecting neon lights, the city grid glowing below, desert sky turning deep purple" },
  { name: "Tokyo Shibuya Crossing", city: "Tokyo 🇯🇵", vibe: "neon, urban, cinematic", prompt: "Shibuya Crossing at night from above — hundreds of pedestrians crossing from all directions, neon billboards reflecting off the wet street, Tokyo Tower glowing in the background" },
  { name: "Cappadocia Balloons", city: "Turkey 🇹🇷", vibe: "magical, sunrise, cinematic", prompt: "100+ colorful hot air balloons floating over Cappadocia at sunrise — fairy chimney rock formations below, blazing orange and rose pink sky, balloons casting long shadows on the valley floor" },
  { name: "Maldives Overwater Villa", city: "Maldives 🇲🇻", vibe: "luxury, crystal water, isolation", prompt: "overwater bungalow villa in the Maldives at sunrise — crystal-clear turquoise water below glass floor, infinity deck with steps into the lagoon, surrounding coral reef visible, lone coconut palms on sandbank" },
  { name: "New York Times Square", city: "New York 🇺🇸", vibe: "energy, neon, cinematic", prompt: "Times Square at night from street level — towering neon and LED billboards flooding the rain-wet streets in color, yellow cabs, steam from manhole covers, crowds moving in all directions" },
  { name: "Amalfi Coast", city: "Italy 🇮🇹", vibe: "Mediterranean, cliffside, golden", prompt: "the Amalfi Coast from the sea — pastel-colored cliffside villages cascading down limestone cliffs to the turquoise Mediterranean, lemon groves and bougainvillea on terrace gardens, wooden fishing boats" },
  { name: "Bali Rice Terraces", city: "Bali 🇮🇩", vibe: "lush, serene, emerald", prompt: "Tegallalang rice terraces in Bali at dawn — tiered emerald green rice paddies cascading down the hillside, low morning mist drifting through the valley, a single palm tree silhouetted against the soft sky" },
  { name: "Northern Lights Iceland", city: "Iceland 🇮🇸", vibe: "surreal, aurora, night", prompt: "Aurora Borealis over an Icelandic black lava landscape — vivid green and purple curtains of light rippling across the star-filled sky, a lone figure standing on volcanic rock looking up, frozen lake reflecting the aurora" },
];

// ── VIDEO EFFECTS DATA ───────────────────────────────────────────────────────
const videoEffects = [
  { name: "Dolly Zoom", tool: "Runway Gen-3", desc: "Hitchcock vertigo — subject holds, world warps behind them", prompt: "Photorealistic cinematic: the subject stands centered and pin-sharp while the camera simultaneously zooms in and physically pulls backward — the Hitchcock Vertigo dolly zoom. Background compresses dramatically, depth collapses, the world behind the subject appears to warp and breathe. Anamorphic lens, 8 seconds." },
  { name: "Cinematic Parallax", tool: "Kling AI", desc: "Multi-layer depth scroll — foreground, mid, background move at different speeds", prompt: "Photorealistic cinematic: slow lateral camera drift across a multi-layered environment. Foreground elements — branches, architecture — slide past quickly. Midground at medium speed. Distant background barely moves. Volumetric haze between layers. Wide anamorphic lens, 6 seconds." },
  { name: "Orbital Rotation", tool: "Runway Gen-3", desc: "Camera orbits subject 360° — background sweeps dramatically", prompt: "Photorealistic cinematic: smooth 360-degree orbital arc around centered subject. Subject remains perfectly in focus. Environment sweeps dramatically behind — city skyline, landscape. Practical lighting tracks realistically. Wide lens, 8 seconds, real physics." },
  { name: "Time Freeze Bullet Time", tool: "Runway Gen-3", desc: "Matrix-style freeze with camera continuing to move", prompt: "Photorealistic cinematic: subject frozen mid-action — leaping, turning, falling — while the camera continues moving in a smooth 180-degree arc around the motionless figure. Dust particles frozen in the air. Everything else in the frame perfectly still. 6 seconds." },
  { name: "Smash Zoom", tool: "Kling AI", desc: "Explosive fast zoom into a detail or reaction", prompt: "Photorealistic cinematic: sudden explosive zoom crashing into the subject's face or a key object in under 0.5 seconds. The zoom is so fast it creates motion blur at the edges. Subject's expression fills the entire frame at the peak. 3–4 seconds total." },
  { name: "Rain Slow Motion", tool: "Pika 2.0", desc: "Heavy rain in ultra slow-mo — cinematic drama", prompt: "Photorealistic cinematic: heavy rainfall in extreme slow motion at 1000fps equivalent — individual raindrops frozen mid-fall catching light, raindrops hitting surfaces creating slow-motion crown splashes, subject standing in rain with droplets suspended around them. Dramatic backlight from streetlamp or window." },
];

// ── ART STYLES FOR PHOTO STUDIO ──────────────────────────────────────────────
const artStyles = [
  { name: "Cinematic Noir", prompt: "dramatic film noir lighting, deep shadows, high contrast black and white tones, vintage 1940s cinematic atmosphere, hard rim light, smoke and fog, expressionist angles" },
  { name: "Solarpunk", prompt: "vibrant solarpunk aesthetic, lush overgrown greenery fused with golden solar panels and copper pipes, warm golden-hour light, utopian community feel, organic architecture" },
  { name: "Dark Fantasy", prompt: "dark fantasy oil painting style, dramatic chiaroscuro lighting, rich jewel tones, detailed ornate costume, Gothic architecture backdrop, atmospheric mist and volumetric light" },
  { name: "Hyperrealistic Portrait", prompt: "hyperrealistic portrait photography, studio lighting, skin texture visible at pore level, catch lights in the eyes, subtle depth of field, 85mm prime lens, f/1.4" },
  { name: "Afrofuturism", prompt: "Afrofuturist aesthetic, rich earth tones combined with galactic blues and golds, traditional African textile patterns merged with futuristic chrome and circuits, cosmic backdrop" },
  { name: "Y2K Aesthetic", prompt: "Y2K aesthetic, iridescent chrome and holographic materials, pixelated digital glitches, bubblegum pink and electric blue, futuristic 2000s optimism, CRT screen glow" },
  { name: "Cyberpunk Neon", prompt: "cyberpunk neon city aesthetic, rain-slicked streets reflecting neon signs in red and cyan, dense urban infrastructure, holographic advertisements, smoke and steam from vents" },
  { name: "Golden Hour Film", prompt: "golden hour film photography, warm amber and orange tones, soft lens flares, slight film grain, VSCO or Kodak Portra 400 color grading, bokeh background" },
];

// ── FORMAT HELPERS ───────────────────────────────────────────────────────────
function formatAnalysis(a: typeof analysesTable.$inferSelect): string {
  const keywords = Array.isArray(a.moodKeywords) ? (a.moodKeywords as string[]).join(", ") : "";
  return [
    `🎬 <b>${esc(a.title || "Untitled")}</b>`,
    `🔗 <i>${esc(a.platform)} — ${esc(a.url)}</i>`,
    ``,
    `🎯 <b>Micro-Niche:</b> ${esc(a.microNiche || "—")}`,
    `🔮 <b>Mood:</b> ${esc(keywords || "—")}`,
    `👥 <b>Audience:</b> ${esc(a.audienceProfile || "—")}`,
    `⚡ <b>Hook:</b> ${esc(a.hookSuggestion || "—")}`,
  ].join("\n");
}

function mainMenu() {
  return new InlineKeyboard()
    .text("🖼 Image Lab", "menu:imagelab").text("📸 Photo Studio", "menu:photostudio").row()
    .text("💇 Hairstyle", "menu:hairstyle").text("🎨 Creative Studio", "menu:creative").row()
    .text("💃 Dance Studio", "menu:dance").text("🗺 Map Studio", "menu:map").row()
    .text("📋 Recent Analyses", "menu:recent");
}

// ── BOT FACTORY ───────────────────────────────────────────────────────────────
export function createBot() {
  if (!token) return null;
  const bot = new Bot(token);

  // Register commands for the menu button (the grid icon in the message bar)
  bot.api.setMyCommands([
    { command: "start", description: "Open main menu" },
    { command: "recent", description: "View 5 latest analyses" },
    { command: "imagelab", description: "Generate 6 killer image ideas" },
    { command: "photostudio", description: "Get a cinematic photo prompt" },
    { command: "hairstyle", description: "Random hairstyle with AI prompt" },
    { command: "creative", description: "Cinematic video effect prompt" },
    { command: "dance", description: "Dance video scene prompt" },
    { command: "map", description: "World landmark travel prompt" },
  ]).catch((e) => logger.error({ e }, "Failed to set commands"));

  // ── /start ────────────────────────────────────────────────────────────────
  bot.command("start", async (ctx) => {
    await ctx.reply(
      `👾 <b>SEEDER_OS Bot</b>\n\nChoose a studio or tap a command below:`,
      { parse_mode: "HTML", reply_markup: mainMenu() }
    );
  });

  // ── /recent ───────────────────────────────────────────────────────────────
  bot.command("recent", async (ctx) => {
    try {
      const analyses = await db.select().from(analysesTable).orderBy(desc(analysesTable.createdAt)).limit(5);
      if (analyses.length === 0) {
        await ctx.reply("No analyses yet. Run one from the web app first.", { reply_markup: mainMenu() });
        return;
      }
      await ctx.reply("📋 <b>Your 5 most recent analyses:</b>", { parse_mode: "HTML" });
      for (const a of analyses) {
        await ctx.reply(formatAnalysis(a), { parse_mode: "HTML" });
      }
      await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
    } catch (err) {
      logger.error({ err }, "Bot /recent failed");
      await ctx.reply("❌ Could not fetch analyses. Try again.");
    }
  });

  // ── /imagelab ─────────────────────────────────────────────────────────────
  bot.command("imagelab", async (ctx) => {
    const topic = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!topic) {
      await ctx.reply(
        `🖼 <b>Image Lab</b>\n\nSend a topic and I'll generate <b>6 killer viral image concepts</b> with ready-to-use AI prompts.\n\nExample:\n<code>/imagelab dark fantasy queen in Lagos at night</code>`,
        { parse_mode: "HTML" }
      );
      return;
    }
    const thinking = await ctx.reply("⚡ Generating 6 killer image concepts…");
    try {
      const res = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are a world-class AI image strategist. Generate exactly 6 killer, scroll-stopping image concepts for the given topic. Each must be emotionally charged and visually distinct. Reply ONLY as JSON array:
[
  { "title": "Short title", "concept": "What makes it powerful (1 sentence)", "prompt": "Detailed AI image generation prompt (50+ words, highly specific)" },
  ...
]`,
          },
          { role: "user", content: `Topic: ${topic}` },
        ],
      });
      const raw = res.choices[0]?.message?.content ?? "[]";
      const match = raw.match(/\[[\s\S]*\]/);
      const ideas = JSON.parse(match ? match[0] : "[]") as { title: string; concept: string; prompt: string }[];
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply(`🖼 <b>6 Image Ideas for: ${esc(topic)}</b>`, { parse_mode: "HTML" });
      for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i];
        await ctx.reply(
          `<b>${i + 1}. ${esc(idea.title)}</b>\n<i>${esc(idea.concept)}</i>\n\n<code>${esc(idea.prompt)}</code>`,
          { parse_mode: "HTML" }
        );
      }
      await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
    } catch (err) {
      logger.error({ err }, "imagelab failed");
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id).catch(() => {});
      await ctx.reply("❌ Failed to generate ideas. Try again.");
    }
  });

  // ── /photostudio ──────────────────────────────────────────────────────────
  bot.command("photostudio", async (ctx) => {
    const kb = new InlineKeyboard();
    artStyles.forEach((s, i) => {
      kb.text(s.name, `photo:${i}`);
      if (i % 2 === 1) kb.row();
    });
    await ctx.reply("📸 <b>Photo Studio</b>\n\nPick an art style:", { parse_mode: "HTML", reply_markup: kb });
  });

  // ── /hairstyle ────────────────────────────────────────────────────────────
  bot.command("hairstyle", async (ctx) => {
    const kb = new InlineKeyboard()
      .text("👩 Female Styles", "hair:female")
      .text("👨 Male Styles", "hair:male");
    await ctx.reply("💇 <b>Hairstyle Studio</b>\n\nChoose a category:", { parse_mode: "HTML", reply_markup: kb });
  });

  // ── /creative ─────────────────────────────────────────────────────────────
  bot.command("creative", async (ctx) => {
    const kb = new InlineKeyboard();
    videoEffects.forEach((e, i) => {
      kb.text(e.name, `fx:${i}`);
      if (i % 2 === 1) kb.row();
    });
    await ctx.reply("🎨 <b>Creative Studio</b>\n\nPick a cinematic video effect:", { parse_mode: "HTML", reply_markup: kb });
  });

  // ── /dance ────────────────────────────────────────────────────────────────
  bot.command("dance", async (ctx) => {
    const kb = new InlineKeyboard();
    danceStyles.forEach((d, i) => {
      kb.text(d.label, `dance:${i}`);
      if (i % 2 === 1) kb.row();
    });
    await ctx.reply("💃 <b>Dance Studio</b>\n\nPick a dance style:", { parse_mode: "HTML", reply_markup: kb });
  });

  // ── /map ──────────────────────────────────────────────────────────────────
  bot.command("map", async (ctx) => {
    const kb = new InlineKeyboard();
    landmarks.forEach((l, i) => {
      kb.text(`${l.city.split(" ")[1] ?? ""} ${l.name}`, `map:${i}`);
      if (i % 2 === 1) kb.row();
    });
    await ctx.reply("🗺 <b>Map Studio</b>\n\nPick a world landmark:", { parse_mode: "HTML", reply_markup: kb });
  });

  // ── CALLBACK QUERIES ──────────────────────────────────────────────────────
  bot.callbackQuery(/^menu:(.+)$/, async (ctx) => {
    const key = ctx.match[1];
    await ctx.answerCallbackQuery();
    const cmds: Record<string, string> = {
      imagelab: "/imagelab <topic>",
      photostudio: "/photostudio",
      hairstyle: "/hairstyle",
      creative: "/creative",
      dance: "/dance",
      map: "/map",
      recent: "/recent",
    };
    if (cmds[key]) {
      await ctx.editMessageText(
        key === "imagelab"
          ? `🖼 <b>Image Lab</b>\n\nSend:\n<code>/imagelab your topic here</code>`
          : `Opening <b>${key}</b>...`,
        { parse_mode: "HTML" }
      );
      if (key !== "imagelab") {
        await ctx.reply(`/${key}`);
      }
    }
  });

  // Photo style callback
  bot.callbackQuery(/^photo:(\d+)$/, async (ctx) => {
    const idx = parseInt(ctx.match[1]);
    const style = artStyles[idx];
    if (!style) { await ctx.answerCallbackQuery("Not found"); return; }
    await ctx.answerCallbackQuery(`Generating ${style.name}…`);
    const thinking = await ctx.reply(`⚡ Generating ${style.name} photo prompt…`);
    try {
      const res = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        messages: [
          { role: "system", content: "You are an AI photo prompt expert. Generate one highly detailed, viral-ready AI image generation prompt in the given style. Include subject, lighting, composition, mood, and technical camera details. Return ONLY the prompt text, no extra commentary." },
          { role: "user", content: `Style: ${style.name}\nBase style context: ${style.prompt}\n\nGenerate a powerful, complete AI image prompt in this style for a portrait or cinematic scene.` },
        ],
      });
      const prompt = res.choices[0]?.message?.content?.trim() ?? "";
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id);
      await ctx.reply(
        `📸 <b>${esc(style.name)}</b>\n\n<code>${esc(prompt)}</code>`,
        { parse_mode: "HTML" }
      );
      await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
    } catch (err) {
      logger.error({ err }, "photostudio callback failed");
      await ctx.api.deleteMessage(ctx.chat.id, thinking.message_id).catch(() => {});
      await ctx.reply("❌ Failed. Try again.");
    }
  });

  // Hairstyle gender callback
  bot.callbackQuery(/^hair:(female|male)$/, async (ctx) => {
    const gender = ctx.match[1] as "female" | "male";
    await ctx.answerCallbackQuery();
    const styles = hairstyles[gender];
    const kb = new InlineKeyboard();
    styles.forEach((s, i) => {
      kb.text(s.name, `hairstyle:${gender}:${i}`);
      if (i % 2 === 1) kb.row();
    });
    await ctx.editMessageText(
      `💇 <b>${gender === "female" ? "Female" : "Male"} Hairstyles</b>\n\nPick a style:`,
      { parse_mode: "HTML", reply_markup: kb }
    );
  });

  // Hairstyle selection callback
  bot.callbackQuery(/^hairstyle:(female|male):(\d+)$/, async (ctx) => {
    const gender = ctx.match[1] as "female" | "male";
    const idx = parseInt(ctx.match[2]);
    const style = hairstyles[gender][idx];
    if (!style) { await ctx.answerCallbackQuery("Not found"); return; }
    await ctx.answerCallbackQuery(`${style.name} selected!`);
    const tags = style.tags.map((t) => `#${t}`).join(" ");
    const fullPrompt = `${gender === "female" ? "African woman" : "African man"} with ${style.visualDetail}, professional photography, soft studio lighting, sharp focus, 85mm lens, natural skin texture`;
    await ctx.editMessageText(
      `💇 <b>${esc(style.name)}</b>\n${tags}\n\n<b>AI Prompt:</b>\n<code>${esc(fullPrompt)}</code>`,
      { parse_mode: "HTML" }
    );
    await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
  });

  // Video effect callback
  bot.callbackQuery(/^fx:(\d+)$/, async (ctx) => {
    const idx = parseInt(ctx.match[1]);
    const effect = videoEffects[idx];
    if (!effect) { await ctx.answerCallbackQuery("Not found"); return; }
    await ctx.answerCallbackQuery(`${effect.name} loaded!`);
    await ctx.editMessageText(
      `🎨 <b>${esc(effect.name)}</b>\n<i>${esc(effect.desc)}</i>\n🛠 Tool: <b>${esc(effect.tool)}</b>\n\n<b>Prompt:</b>\n<code>${esc(effect.prompt)}</code>`,
      { parse_mode: "HTML" }
    );
    await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
  });

  // Dance style callback
  bot.callbackQuery(/^dance:(\d+)$/, async (ctx) => {
    const idx = parseInt(ctx.match[1]);
    const style = danceStyles[idx];
    if (!style) { await ctx.answerCallbackQuery("Not found"); return; }
    await ctx.answerCallbackQuery(`${style.label} selected!`);
    await ctx.editMessageText(
      `💃 <b>${esc(style.label)}</b>\n<i>${esc(style.desc)}</i>\n\n<b>Video Prompt:</b>\n<code>${esc(style.prompt)}</code>`,
      { parse_mode: "HTML" }
    );
    await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
  });

  // Map landmark callback
  bot.callbackQuery(/^map:(\d+)$/, async (ctx) => {
    const idx = parseInt(ctx.match[1]);
    const landmark = landmarks[idx];
    if (!landmark) { await ctx.answerCallbackQuery("Not found"); return; }
    await ctx.answerCallbackQuery(`${landmark.name} loaded!`);
    const vibes = landmark.vibe.split(", ").map((v) => `#${v.replace(/-/g, "")}`).join(" ");
    const fullPrompt = `${landmark.prompt}, ultra-realistic photography, 8K resolution, cinematic composition, professional travel photography`;
    await ctx.editMessageText(
      `🗺 <b>${esc(landmark.name)}</b>\n📍 ${esc(landmark.city)}\n${vibes}\n\n<b>AI Prompt:</b>\n<code>${esc(fullPrompt)}</code>`,
      { parse_mode: "HTML" }
    );
    await ctx.reply("Back to menu:", { reply_markup: mainMenu() });
  });

  // Error handler
  bot.catch((err) => {
    logger.error({ err: err.error }, `Bot error in update ${err.ctx.update.update_id}`);
    if (err.error instanceof GrammyError) logger.error(`GrammY error: ${err.error.description}`);
    else if (err.error instanceof HttpError) logger.error(`HTTP error: ${err.error}`);
  });

  return bot;
}
