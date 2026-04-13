import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Camera,
  Check,
  Copy,
  ImageIcon,
  Palette,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  ShieldX,
} from "lucide-react";

type StudioFilter = {
  name: string;
  category: string;
  vitality: string;
  prompt: string;
  tone: string;
};

type PromptTuning = {
  identity: string;
  style: string;
  finish: string;
  variant: number;
};

const studioFilters: StudioFilter[] = [
  { name: "Japanese Anime", category: "Anime", vitality: "Clean emotion, cinematic street glow, expressive eyes", tone: "cyan", prompt: "Japanese anime look with expressive eyes, clean cel shading, soft cinematic sunlight, warm street atmosphere, polished character design, and crisp linework." },
  { name: "Claude Monet", category: "Fine Art", vitality: "Impressionist color, luminous skin, painterly movement", tone: "blue", prompt: "Claude Monet inspired portrait with impressionist brushwork, luminous color, soft edges, garden light, atmospheric texture, and vibrant painterly motion." },
  { name: "Art Nouveau", category: "Fine Art", vitality: "Ornamental frames, flowing hair, stained-glass detail", tone: "amber", prompt: "Art Nouveau styling with ornamental floral borders, flowing hair, decorative linework, stained-glass colors, and elegant vintage poster energy." },
  { name: "Toy Figure", category: "Toy Studio", vitality: "Glossy collectible face, bright eyes, miniature realism", tone: "pink", prompt: "Collectible toy figure style with glossy plastic skin, oversized bright eyes, sculpted hair, soft product lighting, and miniature realism." },
  { name: "Exhibit Artwork", category: "Gallery", vitality: "Museum portrait finish, gold frames, heirloom mood", tone: "amber", prompt: "Museum exhibit artwork style with portrait lighting, refined brush texture, rich shadows, historical gallery atmosphere, and ornate frame energy." },
  { name: "Children's Book", category: "Illustration", vitality: "Friendly storybook face, soft lines, bright charm", tone: "green", prompt: "Children's book illustration style with friendly proportions, soft hand-drawn lines, bright cheerful colors, and wholesome storybook warmth." },
  { name: "3D Animation", category: "3D", vitality: "Polished 3D character, soft skin, cinematic expression", tone: "purple", prompt: "Stylized 3D animation look with smooth skin, expressive eyes, cinematic rim light, rounded features, lush color, and warm character energy." },
  { name: "Pencil Sketch", category: "Sketch", vitality: "Hand-drawn realism, tonal shading, emotional detail", tone: "slate", prompt: "Pencil sketch style with realistic hand-drawn shading, clean graphite texture, detailed facial structure, expressive eyes, and paper grain." },
  { name: "Gold", category: "Luxury", vitality: "Golden atmosphere, radiant shine, dramatic warmth", tone: "amber", prompt: "Gold art treatment with metallic warm highlights, luxury editorial lighting, rich amber shadows, glowing accents, and dramatic warmth." },
  { name: "Watercolor Art", category: "Fine Art", vitality: "Soft pigment bloom, airy texture, bright natural charm", tone: "blue", prompt: "Watercolor art style with translucent pigment, soft paper bloom, delicate facial details, airy background wash, and natural color." },
  { name: "Starry Night", category: "Fine Art", vitality: "Swirling sky energy, thick strokes, electric blues", tone: "blue", prompt: "Starry Night inspired style with swirling blue skies, thick expressive brush strokes, glowing yellow accents, and dramatic motion." },
  { name: "Sketch on a box", category: "Sketch", vitality: "Paper sketch realism, lifestyle desk mood, analog charm", tone: "slate", prompt: "Sketch-on-paper style with black ink and pencil lines, casual desk presentation, handmade texture, and authentic analog detail." },
  { name: "Low poly 3D", category: "3D", vitality: "Faceted geometry, bold color blocks, modern avatar feel", tone: "purple", prompt: "Low poly 3D style with faceted geometric planes, angular lighting, bold color gradients, and modern digital avatar structure." },
  { name: "Art deco", category: "Poster", vitality: "Radiant symmetry, jewel colors, 1920s glamour", tone: "amber", prompt: "Art Deco poster style with symmetrical radiant backgrounds, jewel-tone colors, elegant graphic linework, and gold accents." },
  { name: "Energetic Manga", category: "Anime", vitality: "Dynamic emotion, pop lighting, high-action panels", tone: "cyan", prompt: "Energetic manga style with dynamic expression, punchy lighting, bold ink lines, panel-ready framing, and vivid action energy." },
  { name: "Classic Comics", category: "Comics", vitality: "Black ink panels, halftone texture, retro storytelling", tone: "slate", prompt: "Classic comics style with black ink linework, halftone texture, dramatic expressions, panel shading, and retro storytelling." },
  { name: "Funny Caricature", category: "Comics", vitality: "Exaggerated joy, bold outlines, comic travel energy", tone: "green", prompt: "Funny caricature style with exaggerated joyful features, expressive smile, bold outlines, saturated colors, and comedic personality." },
  { name: "Picasso Art", category: "Fine Art", vitality: "Cubist distortion, expressive color, gallery drama", tone: "orange", prompt: "Picasso-inspired art style with cubist geometry, expressive color planes, asymmetrical facial structure, and bold brushwork." },
  { name: "Blue Pen Sketch", category: "Sketch", vitality: "Blue ink clarity, clean portrait lines, notebook feel", tone: "blue", prompt: "Blue pen sketch style with crisp cobalt ink, notebook paper texture, clean contour lines, and delicate hatching." },
  { name: "Pop Art", category: "Poster", vitality: "Halftone dots, neon contrast, comic poster punch", tone: "pink", prompt: "Pop Art style with bright halftone dots, bold comic outlines, neon contrast, and graphic poster framing." },
  { name: "Cartoon", category: "Cartoon", vitality: "Friendly animated portrait, polished eyes, soft charm", tone: "green", prompt: "Modern cartoon portrait style with friendly proportions, polished expressive eyes, smooth outlines, and soft color gradients." },
  { name: "Fam Guy Cartoon", category: "Cartoon", vitality: "Sitcom animation shape, flat colors, deadpan humor", tone: "orange", prompt: "Family sitcom cartoon style with flat colors, simple facial shapes, clean TV animation lines, and humorous everyday expression." },
  { name: "Noir Comics", category: "Comics", vitality: "High contrast ink, dramatic shadows, pulp attitude", tone: "slate", prompt: "Noir comics style with high contrast black ink, dramatic shadows, limited color accents, and moody pulp atmosphere." },
  { name: "Clay Figure", category: "Toy Studio", vitality: "Handmade clay texture, warm set lighting, cozy depth", tone: "orange", prompt: "Clay figure style with handmade sculpted texture, soft studio lighting, rounded features, and warm stop-motion atmosphere." },
  { name: "Doll", category: "Toy Studio", vitality: "Glossy doll face, bright fashion color, cute polish", tone: "pink", prompt: "Cute doll style with glossy skin, large sparkling eyes, polished hair, bright fashion colors, and toy-store lighting." },
  { name: "Manga", category: "Anime", vitality: "Sharp anime emotion, crisp ink, romantic detail", tone: "cyan", prompt: "Manga style with crisp ink outlines, expressive eyes, stylized hair, clean panel composition, and emotional character detail." },
  { name: "Oil Painting Art", category: "Fine Art", vitality: "Rich brush texture, glowing highlights, gallery warmth", tone: "green", prompt: "Oil painting style with rich textured brush strokes, glowing skin highlights, deep shadows, and expressive painterly color." },
  { name: "Papercut Art", category: "Craft", vitality: "Layered paper depth, handmade shapes, soft shadows", tone: "orange", prompt: "Papercut art style with layered cut-paper shapes, soft shadows, crafted edges, and dimensional collage depth." },
  { name: "Retro Game", category: "Pixel", vitality: "Pixel avatar energy, arcade color, nostalgic edge", tone: "purple", prompt: "Retro game pixel art style with crisp pixel edges, arcade color palette, 16-bit portrait detail, and nostalgic character energy." },
  { name: "Sticker", category: "Craft", vitality: "Clean cutout border, playful pose, shareable charm", tone: "green", prompt: "Sticker style with clean white cutout border, bright simplified colors, playful character pose, and glossy finish." },
  { name: "Block Toy", category: "Toy Studio", vitality: "Plastic brick face, simple joy, collectible brightness", tone: "amber", prompt: "Block toy character style with plastic face, molded hair, simplified features, toy brick proportions, and cheerful collectible brightness." },
  { name: "Crayon Drawing", category: "Illustration", vitality: "Colorful wax strokes, handmade youth, joyful texture", tone: "pink", prompt: "Crayon drawing style with waxy texture, bright handmade strokes, paper grain, and playful color blending." },
  { name: "Enamel Pin", category: "Craft", vitality: "Polished metal outline, glossy color, collectible badge", tone: "purple", prompt: "Enamel pin style with polished metal outlines, glossy flat color fills, collectible badge shape, and cute character simplification." },
  { name: "Line Art", category: "Sketch", vitality: "Clean contour lines, minimal elegance, bright simplicity", tone: "slate", prompt: "Line art style with clean contour drawing, minimal shading, elegant face structure, and bright white paper simplicity." },
  { name: "Felt Art", category: "Craft", vitality: "Soft fiber surface, plush texture, tactile warmth", tone: "green", prompt: "Felt art style with soft fiber texture, plush sculpted details, warm handmade lighting, and tactile surface depth." },
  { name: "South Style Cartoon", category: "Cartoon", vitality: "Simple cutout comedy, flat color, quirky grin", tone: "orange", prompt: "Satirical cutout cartoon style with simple shapes, flat color fields, big round eyes, and quirky comedic expression." },
  { name: "Mini me doll", category: "Toy Studio", vitality: "Tiny avatar doll, cute scale, soft bokeh", tone: "pink", prompt: "Mini-me doll style with tiny collectible proportions, large glossy eyes, soft bokeh background, and cute outfit detail." },
  { name: "Cube Face Toy", category: "Toy Studio", vitality: "Blocky smile, plastic shine, toy-shelf simplicity", tone: "amber", prompt: "Cube face toy style with blocky plastic head, simple smiling expression, molded hair, and bright toy-shelf lighting." },
];

const categories = ["All", ...Array.from(new Set(studioFilters.map((filter) => filter.category)))];

const toneClasses: Record<string, string> = {
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-400/40 text-cyan-200",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-400/40 text-blue-200",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-400/40 text-amber-200",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-400/40 text-pink-200",
  green: "from-emerald-500/20 to-emerald-500/5 border-emerald-400/40 text-emerald-200",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-400/40 text-purple-200",
  slate: "from-slate-400/20 to-slate-400/5 border-slate-300/30 text-slate-200",
  orange: "from-orange-500/20 to-orange-500/5 border-orange-400/40 text-orange-200",
};

const identityOptions = [
  {
    id: "balanced",
    label: "Balanced",
    prompt: "Preserve the subject's identity, key facial structure, expression, hairstyle, skin tone, pose, outfit cues, and overall likeness.",
  },
  {
    id: "strict",
    label: "Strict ID",
    prompt: "Strongly preserve the subject's exact identity, facial proportions, eye shape, nose, mouth, hairstyle, skin tone, pose, and outfit cues so the person remains clearly recognizable.",
  },
  {
    id: "creative",
    label: "Flexible",
    prompt: "Keep the subject recognizable while allowing the style to reshape proportions, mood, and artistic details more freely.",
  },
];

const styleOptions = [
  {
    id: "subtle",
    label: "Subtle",
    prompt: "Apply the style lightly so the source photo still feels close to the original.",
  },
  {
    id: "balanced",
    label: "Balanced",
    prompt: "Apply the style clearly while keeping the subject natural and usable.",
  },
  {
    id: "bold",
    label: "Bold",
    prompt: "Push the style strongly with high visual impact, recognizable genre traits, and expressive details.",
  },
];

const finishOptions = [
  {
    id: "realistic",
    label: "Realistic",
    prompt: "Keep lighting, anatomy, texture, and depth believable, with a realistic photo-to-art finish.",
  },
  {
    id: "stylized",
    label: "Stylized",
    prompt: "Use a polished stylized finish with heightened color, clean shapes, and social-ready appeal.",
  },
  {
    id: "graphic",
    label: "Graphic",
    prompt: "Use a bold graphic finish with sharper shapes, stronger contrast, and poster-like clarity.",
  },
];

const baseNegativePrompt =
  "bad hands, deformed fingers, extra fingers, missing fingers, fused fingers, mutated hands, bad anatomy, deformed face, asymmetrical face, distorted facial features, crossed eyes, blurry, motion blur, out of focus, low quality, jpeg artifacts, pixelated, grainy noise, watermark, signature, text overlay, logo, username, cropped head, cut off body, bad proportions, disfigured, malformed limbs, extra limbs, cloned face, duplicate, ugly, worst quality, low resolution";

const categoryNegativeExtras: Record<string, string> = {
  Anime: "photorealistic, 3D render, realistic photo, western illustration, too realistic, uncanny valley, flat shading, washed out colors",
  "Fine Art": "photographic, digital neon, flat digital colors, glossy CGI, stock photo, overexposed, harsh shadows",
  "3D": "flat 2D illustration, hand-drawn, pencil sketch, paper texture, collage, cutout style",
  Sketch: "color fill, painted, photographic gloss, digital render, airbrushed, CGI smooth",
  "Toy Studio": "human skin pores, photorealistic flesh, uncanny valley realism, fur texture, organic tissue",
  Illustration: "photographic realism, harsh studio lighting, overrendered details, clinical sharpness, stock photo feel",
  Comics: "photographic, realistic skin, 3D render, smooth CGI, painterly fine art",
  Cartoon: "photorealistic, hyper realistic, uncanny valley, horror expression, aggressive shading",
  Poster: "photographic bleed, 3D depth map, overly realistic texture, blurry edge, low contrast",
  Pixel: "smooth gradients, anti-aliasing, soft edges, high-fidelity detail, painterly texture",
  Craft: "photographic, smooth CGI, digital gloss, airbrushed, clinical lighting",
  Gallery: "modern neon digital, cartoon, flat vector, pixelated, overexposed",
  Luxury: "dull matte, flat colors, low contrast, rough texture, washed out, dingy",
};

function buildNegativePrompt(filter: StudioFilter): string {
  const extra = categoryNegativeExtras[filter.category] ?? "";
  const filterSpecific = getFilterNegativeHints(filter);
  const parts = [baseNegativePrompt];
  if (extra) parts.push(extra);
  if (filterSpecific) parts.push(filterSpecific);
  return parts.join(", ");
}

function getFilterNegativeHints(filter: StudioFilter): string {
  const name = filter.name.toLowerCase();
  if (name.includes("anime") || name.includes("manga")) {
    return "realistic nose, detailed pores, adult western comic style, overly dark shadows";
  }
  if (name.includes("watercolor")) {
    return "hard edges, solid fills, flat digital color, heavy ink lines";
  }
  if (name.includes("oil painting")) {
    return "digital smoothness, flat color, photographic finish, vector look";
  }
  if (name.includes("pencil") || name.includes("sketch") || name.includes("line art")) {
    return "color wash, painted fill, digital airbrush, glossy surface";
  }
  if (name.includes("pixel") || name.includes("retro game")) {
    return "smooth curves, anti-aliased edges, high resolution detail, soft focus";
  }
  if (name.includes("clay")) {
    return "digital gloss, photorealistic skin, smooth CGI texture, flat colors";
  }
  if (name.includes("doll") || name.includes("toy") || name.includes("mini me") || name.includes("block") || name.includes("cube")) {
    return "realistic human skin, wrinkles, pores, body hair, photographic realism";
  }
  if (name.includes("pop art")) {
    return "photorealistic gradients, muted colors, fine art texture, detailed shading";
  }
  if (name.includes("noir")) {
    return "bright colors, pastel tones, low contrast, cheerful mood, high saturation";
  }
  if (name.includes("caricature")) {
    return "realistic proportions, plain expression, photorealistic skin, stiff pose";
  }
  if (name.includes("sticker")) {
    return "complex background, blended edges, no border, dark tones, messy outline";
  }
  if (name.includes("enamel")) {
    return "gradients, 3D shading, photographic detail, rough edges, grungy texture";
  }
  if (name.includes("felt")) {
    return "smooth plastic, digital gloss, photorealistic texture, CGI render";
  }
  if (name.includes("papercut")) {
    return "photographic depth of field, smooth gradients, painted texture, digital blur";
  }
  return "";
}

const promptStructures = [
  (filter: StudioFilter, identity: string, style: string, finish: string) =>
    `Use the user's source photo as the reference. ${identity} Generate a new image using the ${filter.name} filter: ${filter.prompt} ${style} ${finish} Keep the result vivid, polished, and social-media ready.`,
  (filter: StudioFilter, identity: string, style: string, finish: string) =>
    `Create a ${filter.name} version of the user's source photo. ${identity} Visual style direction: ${filter.prompt} ${style} ${finish} Compose it as a clean, finished image suitable for profile photos, thumbnails, and social posts.`,
  (filter: StudioFilter, identity: string, style: string, finish: string) =>
    `Transform the user's source photo through a ${filter.name} filter. ${identity} Style recipe: ${filter.prompt} ${style} ${finish} Avoid generic results; make the final image lively, clear, and immediately recognizable.`,
];

function getOptionPrompt(
  options: { id: string; prompt: string }[],
  selectedId: string,
) {
  return options.find((option) => option.id === selectedId)?.prompt ?? options[0].prompt;
}

function buildPrompt(filter: StudioFilter, notes: string, tuning: PromptTuning) {
  const identityPrompt = getOptionPrompt(identityOptions, tuning.identity);
  const stylePrompt = getOptionPrompt(styleOptions, tuning.style);
  const finishPrompt = getOptionPrompt(finishOptions, tuning.finish);
  const structure = promptStructures[tuning.variant % promptStructures.length];
  const basePrompt = structure(filter, identityPrompt, stylePrompt, finishPrompt);
  const trimmedNotes = notes.trim();
  if (!trimmedNotes) return basePrompt;
  return `${basePrompt} Extra subject direction: ${trimmedNotes}.`;
}

export function PhotoStudio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<StudioFilter>(studioFilters[0]);
  const [copied, setCopied] = useState(false);
  const [subjectNotes, setSubjectNotes] = useState("");
  const [identityLevel, setIdentityLevel] = useState("balanced");
  const [styleLevel, setStyleLevel] = useState("balanced");
  const [finishLevel, setFinishLevel] = useState("stylized");
  const [promptVariant, setPromptVariant] = useState(0);
  const [promptDraft, setPromptDraft] = useState(() =>
    buildPrompt(studioFilters[0], "", {
      identity: "balanced",
      style: "balanced",
      finish: "stylized",
      variant: 0,
    })
  );
  const [promptEdited, setPromptEdited] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [recentFilterNames, setRecentFilterNames] = useState<string[]>([]);
  const [negativePrompt, setNegativePrompt] = useState(() => buildNegativePrompt(studioFilters[0]));
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [negExpanded, setNegExpanded] = useState(false);

  const filteredFilters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return studioFilters.filter((filter) => {
      const matchesCategory = activeCategory === "All" || filter.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${filter.name} ${filter.category} ${filter.vitality}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const recentFilters = useMemo(
    () =>
      recentFilterNames
        .map((name) => studioFilters.find((filter) => filter.name === name))
        .filter((filter): filter is StudioFilter => Boolean(filter)),
    [recentFilterNames]
  );

  const currentTuning = {
    identity: identityLevel,
    style: styleLevel,
    finish: finishLevel,
    variant: promptVariant,
  };

  const copyNegativePrompt = async () => {
    await navigator.clipboard.writeText(negativePrompt);
    setCopiedNeg(true);
    setTimeout(() => setCopiedNeg(false), 1800);
  };

  const applyFilter = (filter: StudioFilter) => {
    setSelectedFilter(filter);
    setPromptDraft(buildPrompt(filter, subjectNotes, currentTuning));
    setNegativePrompt(buildNegativePrompt(filter));
    setPromptEdited(false);
    setRefreshMessage(`${filter.name} applied`);
    setCopied(false);
    setCopiedNeg(false);
    setRecentFilterNames((current) => [
      filter.name,
      ...current.filter((name) => name !== filter.name),
    ].slice(0, 6));
  };

  const handleNotesChange = (value: string) => {
    setSubjectNotes(value);
    if (!promptEdited) {
      setPromptDraft(buildPrompt(selectedFilter, value, currentTuning));
    }
    setCopied(false);
  };

  const handlePromptChange = (value: string) => {
    setPromptDraft(value);
    setPromptEdited(true);
    setCopied(false);
  };

  const regeneratePrompt = () => {
    const nextVariant = promptVariant + 1;
    const nextTuning = {
      identity: identityLevel,
      style: styleLevel,
      finish: finishLevel,
      variant: nextVariant,
    };
    setPromptVariant(nextVariant);
    setPromptDraft(buildPrompt(selectedFilter, subjectNotes, nextTuning));
    setPromptEdited(false);
    setRefreshMessage("Prompt regenerated");
    setCopied(false);
  };

  const updateTuning = (type: "identity" | "style" | "finish", value: string) => {
    const nextTuning = {
      identity: type === "identity" ? value : identityLevel,
      style: type === "style" ? value : styleLevel,
      finish: type === "finish" ? value : finishLevel,
      variant: promptVariant,
    };

    if (type === "identity") setIdentityLevel(value);
    if (type === "style") setStyleLevel(value);
    if (type === "finish") setFinishLevel(value);

    setPromptDraft(buildPrompt(selectedFilter, subjectNotes, nextTuning));
    setPromptEdited(false);
    setRefreshMessage("Prompt tuned");
    setCopied(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="dw-encrypted mb-3">
              <Sparkles className="w-3 h-3" />
              Vitality Filter Bank
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary uppercase tracking-widest theme-glow-text flex items-center gap-3">
              <Camera className="w-9 h-9" />
              Photo Studio
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm max-w-3xl">
              Choose a filter type, tune the prompt, then copy it into the image generator you use for your photos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[280px]">
            <Metric label="Filters" value={studioFilters.length.toString()} />
            <Metric label="Categories" value={(categories.length - 1).toString()} />
            <Metric label="Mode" value="Prompt" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-6">
        <aside className="space-y-4 xl:sticky xl:top-6 self-start">
          <Card className="bg-card border-border theme-glow-box">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Active Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className={cn("border bg-gradient-to-br p-4", toneClasses[selectedFilter.tone])}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="bg-background/80 text-primary border border-primary/40 uppercase text-[10px] mb-3">
                      {selectedFilter.category}
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground">{selectedFilter.name}</h2>
                    <p className="text-sm mt-2 text-foreground/75 leading-relaxed">
                      {selectedFilter.vitality}
                    </p>
                  </div>
                  <Palette className="w-8 h-8 opacity-80 shrink-0" />
                </div>
              </div>

              <div>
                <div className="space-y-3 border border-border bg-secondary/20 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Prompt Strength
                    </p>
                    {refreshMessage && (
                      <span className="text-[10px] text-primary uppercase tracking-wider">
                        {refreshMessage}
                      </span>
                    )}
                  </div>
                  <TuningRow
                    label="Identity"
                    value={identityLevel}
                    options={identityOptions}
                    onChange={(value) => updateTuning("identity", value)}
                  />
                  <TuningRow
                    label="Style"
                    value={styleLevel}
                    options={styleOptions}
                    onChange={(value) => updateTuning("style", value)}
                  />
                  <TuningRow
                    label="Finish"
                    value={finishLevel}
                    options={finishOptions}
                    onChange={(value) => updateTuning("finish", value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Editable Prompt
                  </p>
                  <div className="flex items-center gap-3">
                    {promptEdited && (
                      <span className="text-[10px] text-accent uppercase tracking-wider">
                        Edited
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={regeneratePrompt}
                      className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                    <button
                      type="button"
                      onClick={copyPrompt}
                      className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <textarea
                  value={promptDraft}
                  onChange={(event) => handlePromptChange(event.target.value)}
                  className="w-full min-h-56 bg-secondary/50 border border-border p-3 text-xs text-foreground/80 leading-relaxed font-mono focus:outline-none focus:border-primary resize-y"
                />
                <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                  Clicking any filter rewrites this prompt for that style. You can edit it after applying a filter.
                </p>
              </div>

              <div className="border border-red-500/30 bg-red-500/5">
                <button
                  type="button"
                  onClick={() => setNegExpanded((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-red-500/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldX className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold">
                      Negative Prompt
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      — blocks bad outputs
                    </span>
                  </span>
                  <span className="text-[9px] text-red-400 uppercase tracking-wider">
                    {negExpanded ? "Hide" : "Show"}
                  </span>
                </button>
                {negExpanded && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[9px] text-muted-foreground leading-relaxed">
                        Paste this into the <span className="text-red-400 font-medium">Negative Prompt</span> field of your image generator to block bad hands, distorted faces, blurry details, and {selectedFilter.category.toLowerCase()} style mistakes.
                      </p>
                    </div>
                    <textarea
                      readOnly
                      value={negativePrompt}
                      className="w-full min-h-28 bg-red-950/20 border border-red-500/20 p-3 text-[10px] text-red-200/70 leading-relaxed font-mono focus:outline-none resize-y"
                    />
                    <button
                      type="button"
                      onClick={copyNegativePrompt}
                      className="flex items-center gap-1.5 text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors"
                    >
                      {copiedNeg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedNeg ? "Copied!" : "Copy Negative Prompt"}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                  Optional Direction
                </label>
                <textarea
                  value={subjectNotes}
                  onChange={(event) => handleNotesChange(event.target.value)}
                  placeholder="Example: keep the same jacket, make the background sunset, add confident creator energy..."
                  className="w-full min-h-24 bg-secondary/40 border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <Button onClick={copyPrompt} className="w-full uppercase tracking-widest font-bold">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Prompt Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Generated Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4 min-w-0">
          <Card className="bg-card border-border">
            <CardContent className="p-3 space-y-3">
              <div className="border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-foreground/80 leading-relaxed">
                <span className="text-primary font-bold uppercase tracking-wider">How it works:</span>{" "}
                click a filter card to apply that style to the prompt, edit it if needed, then copy it into your image generator.
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search filters, categories, or vitality cues..."
                  className="w-full bg-secondary/40 border border-border pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                      activeCategory === category
                        ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                        : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {recentFilters.length > 0 && (
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                      Recently Used
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecentFilterNames([])}
                      className="text-[9px] uppercase tracking-wider text-muted-foreground hover:text-primary"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentFilters.map((filter) => (
                      <button
                        key={filter.name}
                        type="button"
                        onClick={() => applyFilter(filter)}
                        className={cn(
                          "px-2.5 py-1.5 border text-[10px] uppercase tracking-wider transition-colors",
                          selectedFilter.name === filter.name
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
                        )}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="text-xs uppercase tracking-wider text-primary font-bold">
              Filter Matrix
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {filteredFilters.length} visible
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-2.5">
            {filteredFilters.map((filter) => (
              <button
                key={filter.name}
                type="button"
                onClick={() => applyFilter(filter)}
                className={cn(
                  "group text-left border bg-card transition-all hover:border-primary hover:bg-primary/5",
                  selectedFilter.name === filter.name
                    ? "border-primary bg-primary/10 theme-glow-box"
                    : "border-border"
                )}
              >
                <div className="p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className={cn("w-7 h-7 border bg-gradient-to-br flex items-center justify-center shrink-0", toneClasses[filter.tone])}>
                      <Wand2 className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <Badge className="bg-secondary/60 text-primary border border-primary/30 uppercase text-[8px] px-1.5 py-0.5 max-w-[120px] truncate">
                      {filter.category}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                      {filter.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2 min-h-[32px]">
                    {filter.vitality}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-wider pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1 text-primary">
                      <Palette className="w-3 h-3" />
                      Apply
                    </span>
                    <span
                      className={cn(
                        selectedFilter.name === filter.name
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      {selectedFilter.name === filter.name ? "Applied" : "Select"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredFilters.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="p-10 text-center">
                <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground font-mono">
                  No filters matched that search. Try another style cue.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card px-3 py-2">
      <div className="text-lg font-bold text-primary">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function TuningRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "border px-2 py-1.5 text-[9px] uppercase tracking-wider transition-colors",
              value === option.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}