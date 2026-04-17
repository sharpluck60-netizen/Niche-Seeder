import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Hash,
  ImagePlus,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from "lucide-react";

type ToneGroup = "bold" | "moody" | "playful" | "inspired";

const toneOptions: { label: string; group: ToneGroup }[] = [
  { label: "Bold & Confident", group: "bold" },
  { label: "Edgy & Raw", group: "bold" },
  { label: "Aesthetic & Moody", group: "moody" },
  { label: "Dark & Mysterious", group: "moody" },
  { label: "Playful & Fun", group: "playful" },
  { label: "Romantic", group: "playful" },
  { label: "Inspirational", group: "inspired" },
  { label: "Clean & Professional", group: "inspired" },
];

const contentTypes = ["Photo Post", "Reel", "Story", "Carousel", "Video"];
const hashtagDensities = [
  { label: "Minimal", count: 10 },
  { label: "Standard", count: 20 },
  { label: "Full Set", count: 30 },
];

type VibeData = {
  emoji: string;
  tone: string;
  captions: Record<ToneGroup, string[]>;
  hashtags: { core: string[]; extended: string[]; niche: string[] };
};

const vibes: Record<string, VibeData> = {
  Cinematic: {
    emoji: "🎬",
    tone: "cyan",
    captions: {
      bold: [
        "Cut to: __SUBJECT__. No script needed — this scene writes itself.",
        "__SUBJECT__ — this is what the director's cut looks like.",
        "Main character. No audition required. __SUBJECT__",
        "The shot everyone wanted but only I got. __SUBJECT__ 🎬",
      ],
      moody: [
        "__SUBJECT__. The light chose this moment and so did I.",
        "Some frames don't need words. __SUBJECT__.",
        "The kind of shot they study in film school. __SUBJECT__",
        "Still frames, moving feelings. __SUBJECT__ 🎞",
      ],
      playful: [
        "POV: you cast yourself and you nailed it. __SUBJECT__ 🎬",
        "No cinematographer? No problem. __SUBJECT__ hits anyway.",
        "Director said 'perfect' and walked off set. __SUBJECT__ 🎥",
        "My camera roll is basically a film festival. __SUBJECT__",
      ],
      inspired: [
        "Tell your story frame by frame. This is mine. __SUBJECT__",
        "Every scene is a choice. Choose the one that moves you. __SUBJECT__",
        "The best shots happen when you show up fully. __SUBJECT__ 🎞",
        "Life is cinematography. Make every frame count. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#cinematic", "#filmstagram", "#cinematicphotography", "#moviestills", "#filmlook", "#cinematicvibes", "#goldenhour", "#visualstorytelling"],
      extended: ["#moodygrams", "#behindthelens", "#filmaesthetic", "#35mm", "#analogfilm", "#shootfilm", "#grainisbeautiful", "#dirtylens", "#cinematographer", "#filmgrain", "#moodyfilm", "#filmphotography"],
      niche: ["#filmisnotdead", "#alternativemovies", "#indiefilm", "#cinephile", "#moviestowatch"],
    },
  },
  Luxury: {
    emoji: "✨",
    tone: "amber",
    captions: {
      bold: [
        "__SUBJECT__. The standard is elevated. Always.",
        "Luxury is a mindset. __SUBJECT__ is the proof.",
        "This is not a mood board. This is a lifestyle. __SUBJECT__ ✨",
        "Selected, not settled for. __SUBJECT__",
      ],
      moody: [
        "Some things are simply beyond words. __SUBJECT__.",
        "Quiet luxury hits different when it's real. __SUBJECT__ ✨",
        "The finer things aren't loud. __SUBJECT__",
        "Everything curated. Nothing accidental. __SUBJECT__",
      ],
      playful: [
        "Treating myself like the main character I am. __SUBJECT__ 🥂",
        "This is what winning looks like on a Tuesday. __SUBJECT__ ✨",
        "Soft life loading… __SUBJECT__ 💛",
        "Rich in every way that matters. __SUBJECT__",
      ],
      inspired: [
        "Build the life you used to dream about. __SUBJECT__",
        "Luxury starts with believing you deserve it. __SUBJECT__ ✨",
        "The upgrade you worked for. Own it. __SUBJECT__",
        "Elevation is a practice, not a destination. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#luxurylifestyle", "#luxury", "#highend", "#elegance", "#luxurious", "#opulence", "#fineliving", "#elevated"],
      extended: ["#softlife", "#bougie", "#chiclife", "#classyoutfits", "#quietluxury", "#luxuryfashion", "#luxurytravel", "#designerlook", "#highfashion", "#luxelife", "#refinedstyle", "#premiumliving"],
      niche: ["#quietluxurystyle", "#oldmoneystyle", "#classicstyle", "#timelessfashion", "#luxeaesthetic"],
    },
  },
  "Anime / Fantasy": {
    emoji: "🌸",
    tone: "purple",
    captions: {
      bold: [
        "Main character arc activated. __SUBJECT__ 🌸",
        "__SUBJECT__ — this is my opening credits scene.",
        "The protagonist energy is unmatched. __SUBJECT__",
        "Villains don't get scenes this beautiful. __SUBJECT__ ✨",
      ],
      moody: [
        "__SUBJECT__. The kind of scene they play over the ending credits.",
        "Every great story has this moment. __SUBJECT__ 🌸",
        "Between worlds. __SUBJECT__",
        "The veil between real and magical is thin here. __SUBJECT__",
      ],
      playful: [
        "My anime arc just started and I'm already the fan favorite. __SUBJECT__ 🌸",
        "Plot twist: the side character becomes the main character. __SUBJECT__ ✨",
        "Opening theme energy >>>. __SUBJECT__ 🎌",
        "If this were a series, you'd binge every episode. __SUBJECT__",
      ],
      inspired: [
        "Even in fantasy, your story is real. __SUBJECT__ 🌸",
        "Every hero has a defining moment. This is yours. __SUBJECT__",
        "You are the protagonist of your own legend. __SUBJECT__ ✨",
        "The adventure you choose is the one that matters. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#animestyle", "#animeaesthetic", "#fantasyart", "#animevibes", "#animegirl", "#mangastyle", "#animelover", "#fantasyworld"],
      extended: ["#cosplayinspired", "#japanesestyle", "#kawaii", "#animecommunity", "#otaku", "#sakura", "#animecharacter", "#fantasycharacter", "#magicalgirl", "#dreamy", "#fantasylife", "#animeart"],
      niche: ["#animeportrait", "#characterdesign", "#ghibliaesthetic", "#mangaart", "#fantasyvibes"],
    },
  },
  "Vintage / Retro": {
    emoji: "📷",
    tone: "amber",
    captions: {
      bold: [
        "Old soul, new story. __SUBJECT__ 📷",
        "__SUBJECT__ — some aesthetics are timeless for a reason.",
        "Vintage filter on the future. __SUBJECT__",
        "They don't make moments like this anymore. Actually, they do. __SUBJECT__ 🎞",
      ],
      moody: [
        "Somewhere between now and then. __SUBJECT__ 📷",
        "Film grain tells the truth your phone can't. __SUBJECT__",
        "The past is just nostalgia you haven't felt yet. __SUBJECT__ 🎞",
        "__SUBJECT__. Every scratch on the negative tells a story.",
      ],
      playful: [
        "My vibe is vintage but my energy is forever. __SUBJECT__ 📷",
        "Retro filter because some things just hit different in film. __SUBJECT__ 🎞",
        "Main character of a coming-of-age film from 1987. __SUBJECT__",
        "Not everything needs to be HD. __SUBJECT__ 📼",
      ],
      inspired: [
        "Slow down. Some of the best moments look like film grain. __SUBJECT__ 📷",
        "Preserve the feeling, not just the image. __SUBJECT__",
        "Some things age into beauty. __SUBJECT__ 🎞",
        "The grain is the memory. Hold onto it. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#vintage", "#retro", "#filmphotography", "#analogfilm", "#filmgrain", "#vintagestyle", "#retroaesthetic", "#filmlover"],
      extended: ["#kodak", "#fujifilm", "#shootfilm", "#filmisnotdead", "#grainisgood", "#analogphotography", "#filmlook", "#vintagevibes", "#retrostyle", "#oldschool", "#35mmfilm", "#vintagefashion"],
      niche: ["#filmcommunity", "#analogcommunity", "#filmsim", "#darkroomphotography", "#lomography"],
    },
  },
  "Urban / Street": {
    emoji: "🏙️",
    tone: "slate",
    captions: {
      bold: [
        "__SUBJECT__. The city is the canvas. I'm the art.",
        "Streets don't lie. __SUBJECT__ 🏙️",
        "Built different. __SUBJECT__",
        "The city raised me. Now I raise the city. __SUBJECT__ 🖤",
      ],
      moody: [
        "__SUBJECT__. The city at this hour belongs to no one and everyone.",
        "Between the cracks, something beautiful. __SUBJECT__ 🏙️",
        "Urban. Real. Unfiltered. __SUBJECT__",
        "The street sees everything. __SUBJECT__ 🖤",
      ],
      playful: [
        "Concrete jungle rules: look good, walk fast. __SUBJECT__ 🏙️",
        "The city is free. So am I. __SUBJECT__",
        "Street style is a whole lifestyle. __SUBJECT__ 🖤",
        "Catch me on every corner looking like this. __SUBJECT__",
      ],
      inspired: [
        "The city teaches you things no classroom can. __SUBJECT__ 🏙️",
        "Built from the ground up. Still going. __SUBJECT__",
        "Find your corner of the city and own it. __SUBJECT__ 🖤",
        "Every street has a story. Walk yours loud. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#streetstyle", "#urbanphotography", "#citylife", "#streetphotography", "#urban", "#cityvibes", "#streetwear", "#grunge"],
      extended: ["#streetsofinstagram", "#citygram", "#urbanlife", "#streetfashion", "#cityscape", "#concreterunway", "#streetlooks", "#hypebeast", "#sneakerhead", "#urbanartistry", "#citylights", "#nightcity"],
      niche: ["#streetculturemedia", "#urbanexploration", "#cityfashion", "#streetvibes", "#underground"],
    },
  },
  "Minimal / Clean": {
    emoji: "◻️",
    tone: "slate",
    captions: {
      bold: [
        "Less, but better. __SUBJECT__",
        "__SUBJECT__. The edit is the message.",
        "White space is not empty space. It's intention. __SUBJECT__",
        "Clarity is its own aesthetic. __SUBJECT__",
      ],
      moody: [
        "Stillness. __SUBJECT__",
        "__SUBJECT__. Nothing added. Nothing taken. Just this.",
        "The quietest things say the most. __SUBJECT__",
        "Minimal on the outside. Maximal within. __SUBJECT__",
      ],
      playful: [
        "My color palette has 3 colors and I'm thriving. __SUBJECT__ ◻️",
        "Minimalist by choice, maximalist by nature. __SUBJECT__",
        "My aesthetic called. It said: clean lines only. __SUBJECT__",
        "The blank canvas chose me. __SUBJECT__ ✨",
      ],
      inspired: [
        "Remove what doesn't serve. Keep what does. __SUBJECT__",
        "Simplicity is a superpower. __SUBJECT__",
        "The clearest spaces hold the biggest ideas. __SUBJECT__",
        "Edit your life the way you edit your feed. __SUBJECT__ ◻️",
      ],
    },
    hashtags: {
      core: ["#minimal", "#minimalist", "#cleanstyle", "#minimalfashion", "#whitespace", "#minimalaesthetic", "#simplestyle", "#cleanlines"],
      extended: ["#lessismore", "#minimaldesign", "#simplicity", "#cleanfeed", "#minimalvibes", "#whiteonwhite", "#neutralstyle", "#scandistyle", "#minimalinsta", "#quietluxury", "#editedlife", "#calmfeed"],
      niche: ["#minimalistsofinstagram", "#minimalportrait", "#cleanvisuals", "#whitewalls", "#minimalmoments"],
    },
  },
  "Dark & Moody": {
    emoji: "🖤",
    tone: "slate",
    captions: {
      bold: [
        "Darkness isn't the absence of light — it's knowing where to put it. __SUBJECT__ 🖤",
        "__SUBJECT__. The shadow is the story.",
        "Built for the dark. Thriving in it. __SUBJECT__",
        "They said turn on the lights. I said no. __SUBJECT__ 🖤",
      ],
      moody: [
        "__SUBJECT__. Some things only reveal themselves in the dark.",
        "Low light. High contrast. No compromise. __SUBJECT__ 🖤",
        "The mood chose this. __SUBJECT__",
        "Between light and shadow, there's a whole world. __SUBJECT__",
      ],
      playful: [
        "My aesthetic is: gothic but make it fashion. __SUBJECT__ 🖤",
        "Dark mode: on. Always. __SUBJECT__",
        "Living in the shadow of my best content. __SUBJECT__ 🖤",
        "I don't need more light. I need better shadows. __SUBJECT__",
      ],
      inspired: [
        "In the dark, you learn what you're really made of. __SUBJECT__ 🖤",
        "The most interesting people thrive in grey areas. __SUBJECT__",
        "Embrace the shadow. It's part of you too. __SUBJECT__",
        "Low light doesn't mean low vision. __SUBJECT__ 🖤",
      ],
    },
    hashtags: {
      core: ["#darkphotography", "#moodyphotography", "#darkaesthetic", "#moody", "#moodygrams", "#shadowplay", "#darkart", "#lowisolation"],
      extended: ["#blackandwhite", "#darkvibes", "#noirphotography", "#shadowhunter", "#dramaticlight", "#contrastphotography", "#darkfeed", "#blackfeed", "#darkportraiture", "#moodyedits", "#mysteryvibes", "#darklens"],
      niche: ["#chiaroscuro", "#moodboards", "#darkfilmers", "#underexposed", "#shadowart"],
    },
  },
  "Nature & Dreamy": {
    emoji: "🌿",
    tone: "green",
    captions: {
      bold: [
        "Nature made this. I just showed up. __SUBJECT__ 🌿",
        "__SUBJECT__. Wild, real, and exactly where I'm supposed to be.",
        "Outdoors is the original filter. __SUBJECT__ 🌿",
        "The earth gave me the shot. I just pressed capture. __SUBJECT__",
      ],
      moody: [
        "__SUBJECT__. Somewhere between waking and dreaming.",
        "The light through the leaves says everything I can't. __SUBJECT__ 🌿",
        "Soft morning, softer mood. __SUBJECT__",
        "The world breathes here. __SUBJECT__ 🌱",
      ],
      playful: [
        "Went outside and honestly? Nature ate. __SUBJECT__ 🌿",
        "Forest called. I answered. __SUBJECT__ 🌲",
        "This is my therapy and it's free. __SUBJECT__ 🌿",
        "POV: you found the perfect spot before anyone else did. __SUBJECT__ 🌿",
      ],
      inspired: [
        "Go where the air changes you. __SUBJECT__ 🌿",
        "Every walk in nature is a walk back to yourself. __SUBJECT__",
        "Slow down. The earth is trying to tell you something. __SUBJECT__ 🌱",
        "Roots deep. Vision clear. __SUBJECT__ 🌿",
      ],
    },
    hashtags: {
      core: ["#naturephotography", "#nature", "#botanicalgarden", "#earthpix", "#outdoors", "#greenlife", "#naturelover", "#wildnature"],
      extended: ["#forestphotography", "#dreamyphotography", "#softlight", "#plantlife", "#naturegram", "#backlighting", "#botanicalbeauty", "#landscapephotography", "#goldenleaf", "#dreamy", "#naturemood", "#organicvibes"],
      niche: ["#cottagecore", "#naturaldye", "#rewilding", "#slowliving", "#earthaesthetic"],
    },
  },
  "Bold & Graphic": {
    emoji: "⚡",
    tone: "orange",
    captions: {
      bold: [
        "__SUBJECT__. Designed to be seen. Built to be remembered.",
        "High contrast. High impact. No exceptions. __SUBJECT__ ⚡",
        "This isn't subtle. It was never meant to be. __SUBJECT__",
        "The loudest visuals say the quietest truths. __SUBJECT__ ⚡",
      ],
      moody: [
        "__SUBJECT__. Color as a weapon.",
        "The palette was chosen with intent. __SUBJECT__ ⚡",
        "Graphic design is power. __SUBJECT__",
        "When the visual does the talking. __SUBJECT__ ⚡",
      ],
      playful: [
        "My aesthetic is: comic book energy but make it real. __SUBJECT__ ⚡",
        "Pop art walked so this could run. __SUBJECT__",
        "Saturation? Maximum. __SUBJECT__ 🎨",
        "Andy Warhol saw this in a dream. __SUBJECT__ ⚡",
      ],
      inspired: [
        "Bold colors. Bold choices. Bold life. __SUBJECT__ ⚡",
        "Be the most vivid version of yourself. __SUBJECT__",
        "Don't blend in when you were made to stand out. __SUBJECT__ ⚡",
        "The bravest thing you can do is take up full color. __SUBJECT__",
      ],
    },
    hashtags: {
      core: ["#graphicdesign", "#boldstyle", "#colorful", "#highcontrast", "#popculture", "#visualart", "#boldcolors", "#graphicart"],
      extended: ["#colorsplash", "#colorpalette", "#artphotography", "#visualdesign", "#neoncolors", "#primarycolors", "#colorburst", "#loudaesthetic", "#artinspired", "#boldlook", "#saturated", "#colorblocking"],
      niche: ["#streetart", "#popart", "#graffitiart", "#urbanart", "#typographyart"],
    },
  },
  "Ethereal / Surreal": {
    emoji: "🌙",
    tone: "purple",
    captions: {
      bold: [
        "__SUBJECT__. Between this world and the next.",
        "Not everything is what it appears. __SUBJECT__ 🌙",
        "Reality is a canvas. I chose to paint outside its edges. __SUBJECT__",
        "Surreal is just another word for honest. __SUBJECT__ ✨",
      ],
      moody: [
        "__SUBJECT__. The kind of image that makes you question everything gently.",
        "Dreaming with my eyes open. __SUBJECT__ 🌙",
        "Some places exist between blinks. __SUBJECT__",
        "The veil is thin here. __SUBJECT__ ✨",
      ],
      playful: [
        "My brain is a dreamscape and this is a postcard. __SUBJECT__ 🌙",
        "Living in a Studio Ghibli b-roll scene. __SUBJECT__ ✨",
        "Fantasy? Nah. This is just a Tuesday. __SUBJECT__ 🌙",
        "Reality called. I let it go to voicemail. __SUBJECT__ ✨",
      ],
      inspired: [
        "Let yourself exist in the in-between. __SUBJECT__ 🌙",
        "The most beautiful things can't be fully explained. __SUBJECT__ ✨",
        "Trust the surreal moments. They're trying to show you something. __SUBJECT__",
        "Magic isn't gone. You just have to look differently. __SUBJECT__ 🌙",
      ],
    },
    hashtags: {
      core: ["#ethereal", "#surreal", "#dreamyphotography", "#fantasyphotography", "#conceptualphotography", "#etherealvibes", "#surrealart", "#dreamworld"],
      extended: ["#magicphotography", "#fairytale", "#otherworldly", "#conceptart", "#surrealism", "#dreamscape", "#mystical", "#fantasyworld", "#celestial", "#cosmiclook", "#moonchild", "#spiritualaesthetic"],
      niche: ["#surrealismartwork", "#dreameraesthetic", "#celestialvibes", "#mysticalvibes", "#betweenworlds"],
    },
  },
  "POV": {
    emoji: "👁️",
    tone: "cyan",
    captions: {
      bold: [
        "POV: you just met someone who actually has their life together. __SUBJECT__",
        "POV: this is the main character and you're an extra in their story. __SUBJECT__ 👁️",
        "POV: you finally stopped settling. __SUBJECT__",
        "POV: you became everything you used to admire. __SUBJECT__ 👁️",
      ],
      moody: [
        "POV: it's 2am and you're overthinking everything except this. __SUBJECT__ 👁️",
        "POV: you found the version of yourself you always wanted to meet. __SUBJECT__",
        "POV: the quiet girl from three years ago is gone. __SUBJECT__ 👁️",
        "POV: you chose yourself and it looked exactly like this. __SUBJECT__",
      ],
      playful: [
        "POV: your Roman Empire is __SUBJECT__ and you're not explaining that 🙂",
        "POV: you manifested this and it worked. __SUBJECT__ 👁️✨",
        "POV: the plot twist you didn't see coming. __SUBJECT__",
        "POV: main character behavior, no notes. __SUBJECT__ 👁️",
      ],
      inspired: [
        "POV: you started doing things for yourself and they looked like this. __SUBJECT__",
        "POV: future you sent this back as proof it gets better. __SUBJECT__ 👁️",
        "POV: you stopped waiting for permission. __SUBJECT__",
        "POV: the life you built for yourself hitting different lately. __SUBJECT__ ✨",
      ],
    },
    hashtags: {
      core: ["#pov", "#povchallenge", "#maincharacter", "#maincharacterenergy", "#storytelling", "#povvideo", "#povmoment", "#pointofview"],
      extended: ["#maincharacterera", "#glowup", "#characterdevelopment", "#povstory", "#theplot", "#povlife", "#plottwist", "#girlera", "#myera", "#newchapter", "#levelup", "#povcheck"],
      niche: ["#poissonera", "#poissoncheck", "#maincharactercheck", "#romanempire", "#povtrend"],
    },
  },
  "Meme": {
    emoji: "😭",
    tone: "orange",
    captions: {
      bold: [
        "Me showing up to life looking like this while everything burns behind me. __SUBJECT__ 😭",
        "The confidence of someone who has absolutely no reason to be this confident. __SUBJECT__",
        "My villain era is going very well, thank you for asking. __SUBJECT__ 😈",
        "I am not the same person. I am worse (I look better though). __SUBJECT__ 💀",
      ],
      moody: [
        "This is my villain origin story and it's going great. __SUBJECT__ 😭",
        "They said 'you've changed' and I said 'I know'. __SUBJECT__",
        "The glow up they didn't want to talk about. __SUBJECT__ 💀",
        "Me: I'm fine. Also me: __SUBJECT__ 😭",
      ],
      playful: [
        "The audacity I carry in this body is genuinely unmatched. __SUBJECT__ 😭",
        "My Roman Empire is this photo and I will not be elaborating. __SUBJECT__ 💀",
        "No thoughts. Just vibes and great lighting. __SUBJECT__ 😂",
        "Me pretending I didn't spend 45 minutes taking this photo. __SUBJECT__ 😭✨",
      ],
      inspired: [
        "Glow up achieved. Villain arc loading. __SUBJECT__ 😭",
        "The character development nobody asked for but everyone needed. __SUBJECT__ 💀",
        "Hot girl walks into Monday like she didn't just survive a whole week. __SUBJECT__ 😂",
        "Living proof that if you delusionally believe in yourself, sometimes it works. __SUBJECT__ 🙃",
      ],
    },
    hashtags: {
      core: ["#meme", "#relatable", "#funny", "#mood", "#samegirl", "#honestly", "#ngl", "#vibes"],
      extended: ["#relatablecontent", "#samehere", "#thisis me", "#honestly", "#oomf", "#tweet", "#twitterhumor", "#fyp", "#funnymemes", "#comedypost", "#memesdaily", "#nothoughts"],
      niche: ["#corecore", "#girlmeme", "#villainera", "#maincharactermeme", "#chaoticcontent"],
    },
  },
  "Affirmation": {
    emoji: "💫",
    tone: "amber",
    captions: {
      bold: [
        "Everything I need, I already have. __SUBJECT__ 💫",
        "__SUBJECT__. Aligned. Abundant. Exactly where I need to be.",
        "I am not waiting for my life to start. It already has. __SUBJECT__ ✨",
        "I choose myself. Every single day. __SUBJECT__ 💫",
      ],
      moody: [
        "Healing looks different every day. Today it looks like this. __SUBJECT__ 💫",
        "__SUBJECT__. Coming back to myself, one breath at a time.",
        "This version of me took a long time to build. I'm not rushing. __SUBJECT__ ✨",
        "Peace is something I protect now. __SUBJECT__ 💫",
      ],
      playful: [
        "Manifesting with my whole chest. __SUBJECT__ 💫✨",
        "The universe said yes and so did I. __SUBJECT__ 💫",
        "In my aligned era and it shows. __SUBJECT__ ✨",
        "Soft life, strong mind, full cup. __SUBJECT__ 💫",
      ],
      inspired: [
        "You are allowed to be both a work in progress and worthy of love right now. __SUBJECT__ 💫",
        "The version of you that got here deserves recognition. __SUBJECT__ ✨",
        "You don't have to earn rest, softness, or beauty. __SUBJECT__ 💫",
        "Everything shifts when you stop apologizing for taking up space. __SUBJECT__ ✨",
      ],
    },
    hashtags: {
      core: ["#affirmations", "#dailyaffirmation", "#manifestation", "#manifest", "#lawofassumption", "#selfworth", "#alignedlife", "#innerwork"],
      extended: ["#selflovequotes", "#mindsetshift", "#healingjourney", "#personalgrowth", "#softlife", "#abundance", "#positivevibes", "#highvibration", "#energyalignment", "#affirmationquotes", "#growthmindset", "#selfdevelopment"],
      niche: ["#loa", "#lawofassumption", "#spiritualjourney", "#manifestingdreams", "#alignedaf"],
    },
  },
};

const vibeNames = Object.keys(vibes);

const toneDescriptions: Record<string, string> = {
  "Bold & Confident": "Direct, declarative, and commanding — you're stating facts",
  "Edgy & Raw": "Unfiltered, real, no-nonsense energy",
  "Aesthetic & Moody": "Evocative and atmospheric — let the vibe speak",
  "Dark & Mysterious": "Shadowy, alluring, and cryptically beautiful",
  "Playful & Fun": "Light-hearted, witty, and full of personality",
  "Romantic": "Soft, tender, and emotionally resonant",
  "Inspirational": "Motivating, uplifting, and purpose-driven",
  "Clean & Professional": "Crisp, purposeful, and brand-aligned",
};

function buildCaptions(
  vibe: string,
  toneGroup: ToneGroup,
  subject: string,
  seed: number,
): string[] {
  const data = vibes[vibe];
  if (!data) return [];
  const templates = data.captions[toneGroup];
  const s = subject.trim() || "this moment";
  const shuffled = [...templates].sort(
    (a, b) =>
      ((templates.indexOf(a) + seed) % templates.length) -
      ((templates.indexOf(b) + seed) % templates.length)
  );
  return shuffled.slice(0, 3).map((t) => t.replace(/__SUBJECT__/g, s));
}

function buildHashtags(vibe: string, density: number): string {
  const data = vibes[vibe];
  if (!data) return "";
  const { core, extended, niche } = data.hashtags;
  const all = [...core];
  if (density > 10) all.push(...extended.slice(0, density - core.length));
  if (density >= 30) all.push(...niche);
  return all.slice(0, density).join(" ");
}

type CopyState = Record<string, boolean>;

function CaptionCard({
  caption,
  hashtags,
  index,
}: {
  caption: string;
  hashtags: string;
  index: number;
}) {
  const [copied, setCopied] = useState<CopyState>({});

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1800);
  };

  const charCount = caption.length;
  const charLimit = 2200;
  const isNearLimit = charCount > 1800;

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
            Caption {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("text-[9px] font-mono", isNearLimit ? "text-amber-400" : "text-muted-foreground")}>
            {charCount}/{charLimit}
          </span>
          <button
            type="button"
            onClick={() => copy(caption, "cap")}
            className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 uppercase tracking-wider"
          >
            {copied.cap ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied.cap ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => copy(`${caption}\n\n${hashtags}`, "all")}
            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-wider"
          >
            {copied.all ? <Check className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
            {copied.all ? "Copied" : "+ Tags"}
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{caption}</p>
      </div>
    </div>
  );
}

export function CaptionGenerator() {
  const [selectedVibe, setSelectedVibe] = useState("Cinematic");
  const [selectedTone, setSelectedTone] = useState("Bold & Confident");
  const [selectedContent, setSelectedContent] = useState("Photo Post");
  const [selectedDensity, setSelectedDensity] = useState(20);
  const [subject, setSubject] = useState("");
  const [seed, setSeed] = useState(0);
  const [copiedTags, setCopiedTags] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setUploadedImage(result);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImageName("");
  };

  const toneGroup = useMemo<ToneGroup>(
    () => toneOptions.find((t) => t.label === selectedTone)?.group ?? "bold",
    [selectedTone]
  );

  const captions = useMemo(
    () => buildCaptions(selectedVibe, toneGroup, subject, seed),
    [selectedVibe, toneGroup, subject, seed]
  );

  const hashtags = useMemo(
    () => buildHashtags(selectedVibe, selectedDensity),
    [selectedVibe, selectedDensity]
  );

  const copyTags = async () => {
    await navigator.clipboard.writeText(hashtags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 1800);
  };

  const vibeData = vibes[selectedVibe];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="dw-encrypted mb-3">
              <Hash className="w-3 h-3" />
              Instagram Caption Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary uppercase tracking-widest theme-glow-text flex items-center gap-3">
              <MessageSquare className="w-9 h-9" />
              Caption Lab
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm max-w-3xl">
              Pick your visual vibe and tone, describe your content, and get 3 ready-to-post Instagram captions with matching hashtag packs.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[280px]">
            <CapMetric label="Vibes" value={vibeNames.length.toString()} />
            <CapMetric label="Tones" value={toneOptions.length.toString()} />
            <CapMetric label="Outputs" value="3" />
          </div>
        </div>
      </header>

      {/* Image Upload Section */}
      <div className="border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <ImagePlus className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
              Image Reference
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
            Preview only · no data stored
          </span>
        </div>
        <div className="p-4">
          {uploadedImage ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative shrink-0">
                <img
                  src={uploadedImage}
                  alt="Your uploaded reference"
                  className="w-40 h-40 object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground truncate max-w-xs">{imageName}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your image is displayed here as a visual reference while you build your captions. It stays only in your browser — nothing is uploaded or stored anywhere.
                </p>
                <p className="text-[10px] text-primary/80">
                  Describe what's in the photo in the "Describe Your Content" field below to personalize the captions.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary border border-border px-3 py-1.5 transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  Replace Image
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-primary/40 hover:border-primary/70 bg-primary/5 hover:bg-primary/10 transition-colors p-6 flex flex-col items-center gap-3 group"
            >
              <Upload className="w-7 h-7 text-primary/50 group-hover:text-primary transition-colors" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-primary font-bold">Upload Your Image</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Upload a photo to use as a visual reference while writing captions
                </p>
                <p className="text-[9px] text-muted-foreground/60 mt-1 uppercase tracking-wider">
                  JPG, PNG, WebP · Never stored
                </p>
              </div>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-6">
        {/* Config sidebar */}
        <aside className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Configure Caption
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {/* Vibe */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Visual Vibe
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {vibeNames.map((vibe) => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => setSelectedVibe(vibe)}
                      className={cn(
                        "text-left border p-2.5 text-[10px] uppercase tracking-wider transition-colors",
                        selectedVibe === vibe
                          ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                          : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
                      )}
                    >
                      <span className="mr-1.5">{vibes[vibe].emoji}</span>
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Caption Tone
                </label>
                {toneOptions.map((tone) => (
                  <button
                    key={tone.label}
                    type="button"
                    onClick={() => setSelectedTone(tone.label)}
                    className={cn(
                      "w-full text-left border-x border-t last:border-b px-3 py-2 text-[10px] uppercase tracking-wider transition-colors",
                      selectedTone === tone.label
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <span className="font-bold">{tone.label}</span>
                    {selectedTone === tone.label && (
                      <span className="block text-[9px] opacity-75 mt-0.5 normal-case tracking-normal font-normal">
                        {toneDescriptions[tone.label]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Content Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {contentTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedContent(type)}
                      className={cn(
                        "border px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors",
                        selectedContent === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtag density */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Hashtag Pack Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {hashtagDensities.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDensity(d.count)}
                      className={cn(
                        "border py-2 text-[10px] uppercase tracking-wider transition-colors text-center",
                        selectedDensity === d.count
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                      )}
                    >
                      <div className="font-bold">{d.label}</div>
                      <div className="text-[9px] opacity-70">{d.count} tags</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Describe Your Content
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Example: me in a gold dress at the rooftop at sunset, confident pose, city lights behind me..."
                  className="w-full min-h-24 bg-secondary/40 border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => setSeed((n) => n + 1)}
                className="w-full flex items-center justify-center gap-2 border border-primary/50 text-primary py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Captions
              </button>
            </CardContent>
          </Card>
        </aside>

        {/* Output panel */}
        <section className="space-y-4 min-w-0">
          {/* Active vibe summary */}
          <div className={cn(
            "border px-4 py-3 flex items-center justify-between gap-4",
            `border-primary/30 bg-primary/5`
          )}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{vibeData?.emoji}</span>
              <div>
                <div className="text-xs uppercase tracking-wider text-primary font-bold">
                  {selectedVibe} × {selectedTone}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {selectedContent} · {selectedDensity} hashtags
                </div>
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider text-right">
              3 captions generated
            </div>
          </div>

          {/* Caption cards */}
          <div className="space-y-3">
            {captions.map((caption, i) => (
              <CaptionCard
                key={`${selectedVibe}-${toneGroup}-${seed}-${i}`}
                caption={caption}
                hashtags={hashtags}
                index={i}
              />
            ))}
          </div>

          {/* Hashtag pack */}
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  {selectedVibe} Hashtag Pack
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  {selectedDensity} tags
                </span>
              </div>
              <button
                type="button"
                onClick={copyTags}
                className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 uppercase tracking-wider"
              >
                {copiedTags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTags ? "Copied" : "Copy All Tags"}
              </button>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed font-mono break-words">
                {hashtags}
              </p>
            </div>
          </div>

          {/* Quick tips */}
          <div className="border border-border bg-secondary/20 p-4 space-y-2">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
              <Type className="w-3 h-3 text-primary" />
              Caption Tips for {selectedContent}
            </p>
            {selectedContent === "Reel" && (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                For Reels, put your hook in the first line — it shows before the "more" cut. Keep it under 150 characters for feed previews. Add hashtags in the first comment to keep the caption clean.
              </p>
            )}
            {selectedContent === "Photo Post" && (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Photo posts reward longer captions. Tell a story, share context, or ask a question. Instagram shows the first 125 characters before the "more" cut, so lead with your strongest line.
              </p>
            )}
            {selectedContent === "Story" && (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Stories are about immediacy. Use caption 1 as an overlay text sticker, keep it punchy. Add hashtags via the hashtag sticker (not the text) to be eligible for Story hashtag pages.
              </p>
            )}
            {selectedContent === "Carousel" && (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Carousels get shared the most. Start your caption with a "swipe →" hook. The first slide determines the algorithm push, but saves and shares are what drive reach.
              </p>
            )}
            {selectedContent === "Video" && (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                For video posts, mention what's in the video in the first line — it helps with search and saves. Add your hashtags at the end or in the first comment to preserve caption readability.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function CapMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card px-3 py-2">
      <div className="text-lg font-bold text-primary">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
