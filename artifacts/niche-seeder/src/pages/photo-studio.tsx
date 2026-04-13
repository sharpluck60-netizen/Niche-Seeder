import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Camera,
  Check,
  Copy,
  Crown,
  ImageIcon,
  Palette,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import filterSetOne from "@assets/Screenshot_20260413_230333_1776119249249.jpg";
import filterSetTwo from "@assets/Screenshot_20260413_230344_1776119249286.jpg";
import filterSetThree from "@assets/Screenshot_20260413_230412_1776119249302.jpg";
import filterSetFour from "@assets/Screenshot_20260413_230359_1776119249316.jpg";
import filterSetFive from "@assets/Screenshot_20260413_230422_1776119249330.jpg";
import filterSetSix from "@assets/Screenshot_20260413_230437_1776119249346.jpg";
import filterSetSeven from "@assets/Screenshot_20260413_230458_1776119249360.jpg";
import filterSetEight from "@assets/Screenshot_20260413_230516_1776119249378.jpg";
import filterSetNine from "@assets/Screenshot_20260413_230525_1776119249393.jpg";
import filterSetTen from "@assets/Screenshot_20260413_230543_1776119249408.jpg";

type StudioFilter = {
  name: string;
  category: string;
  vitality: string;
  image: string;
  premium?: boolean;
  prompt: string;
};

const studioFilters: StudioFilter[] = [
  { name: "Japanese Anime", category: "Anime", vitality: "Clean emotion, cinematic street glow, expressive eyes", image: filterSetOne, premium: true, prompt: "Transform the photo into Japanese anime with expressive eyes, soft cinematic sunlight, clean cel shading, warm street atmosphere, gentle emotion, polished character design, high vitality, crisp linework." },
  { name: "Claude Monet", category: "Fine Art", vitality: "Impressionist color, luminous skin, painterly movement", image: filterSetOne, premium: true, prompt: "Transform the photo into a Claude Monet inspired portrait with impressionist brushwork, luminous color, garden light, atmospheric texture, soft edges, vibrant painterly vitality." },
  { name: "Art Nouveau", category: "Fine Art", vitality: "Ornamental frames, flowing hair, stained-glass detail", image: filterSetOne, premium: true, prompt: "Transform the photo into Art Nouveau with ornamental floral borders, flowing hair, decorative linework, stained-glass color panels, elegant vintage poster energy, vivid vitality." },
  { name: "Toy Figure", category: "Toy Studio", vitality: "Glossy collectible face, bright eyes, miniature realism", image: filterSetOne, premium: true, prompt: "Transform the photo into a collectible toy figure with glossy plastic skin, oversized bright eyes, sculpted hair, soft product lighting, miniature realism, playful vitality." },
  { name: "Exhibit Artwork", category: "Gallery", vitality: "Museum portrait finish, gold frames, heirloom mood", image: filterSetTwo, premium: true, prompt: "Transform the photo into exhibit artwork with museum portrait lighting, ornate gold frame energy, refined brush texture, rich shadows, historical gallery atmosphere, premium vitality." },
  { name: "Children's Book", category: "Illustration", vitality: "Friendly storybook face, soft lines, bright charm", image: filterSetTwo, premium: true, prompt: "Transform the photo into a children's book illustration with friendly proportions, soft hand-drawn lines, bright cheerful colors, wholesome storybook setting, gentle vitality." },
  { name: "3D Animation", category: "3D", vitality: "Pixar-like polish, soft skin, cinematic expression", image: filterSetTwo, premium: true, prompt: "Transform the photo into premium 3D animation with smooth stylized skin, expressive eyes, cinematic rim light, rounded features, lush color, warm character vitality." },
  { name: "Pencil Sketch", category: "Sketch", vitality: "Hand-drawn realism, tonal shading, emotional detail", image: filterSetTwo, prompt: "Transform the photo into a pencil sketch with realistic hand-drawn shading, clean graphite texture, detailed facial structure, expressive eyes, paper grain, quiet vitality." },
  { name: "Gold", category: "Luxury", vitality: "Golden atmosphere, premium shine, dramatic warmth", image: filterSetThree, premium: true, prompt: "Transform the photo with a gold art filter, metallic warm highlights, luxury editorial lighting, rich amber shadows, glowing architecture accents, high-status vitality." },
  { name: "Watercolor Art", category: "Fine Art", vitality: "Soft pigment bloom, airy texture, bright natural charm", image: filterSetThree, prompt: "Transform the photo into watercolor art with translucent pigment, soft paper bloom, delicate facial details, airy background wash, natural color vitality." },
  { name: "Starry Night", category: "Fine Art", vitality: "Swirling sky energy, thick strokes, electric blues", image: filterSetThree, premium: true, prompt: "Transform the photo in a Starry Night inspired style with swirling blue skies, thick expressive brush strokes, glowing yellow accents, dramatic motion, electric vitality." },
  { name: "Sketch on a box", category: "Sketch", vitality: "Paper sketch realism, lifestyle desk mood, analog charm", image: filterSetThree, prompt: "Transform the photo into a sketch on a box or paper card, black ink pencil lines, casual desk presentation, handmade texture, authentic analog vitality." },
  { name: "Low poly 3D", category: "3D", vitality: "Faceted geometry, bold color blocks, modern avatar feel", image: filterSetFour, premium: true, prompt: "Transform the photo into low poly 3D with faceted geometric planes, angular lighting, bold color gradients, stylized avatar structure, modern digital vitality." },
  { name: "Art deco", category: "Poster", vitality: "Radiant symmetry, jewel colors, 1920s glamour", image: filterSetFour, premium: true, prompt: "Transform the photo into Art Deco with symmetrical radiant backgrounds, jewel-tone color, elegant graphic linework, gold accents, 1920s glamour vitality." },
  { name: "Energetic Manga", category: "Anime", vitality: "Dynamic emotion, pop lighting, high-action panels", image: filterSetFour, premium: true, prompt: "Transform the photo into energetic manga with dynamic facial expression, punchy lighting, bold ink lines, panel-ready framing, vivid action vitality." },
  { name: "Classic Comics", category: "Comics", vitality: "Black ink panels, halftone texture, retro storytelling", image: filterSetFour, prompt: "Transform the photo into classic comics with black ink linework, halftone texture, dramatic expressions, panel shading, retro urban storytelling vitality." },
  { name: "Funny Caricature", category: "Comics", vitality: "Exaggerated joy, bold outlines, comic travel energy", image: filterSetFive, premium: true, prompt: "Transform the photo into a funny caricature with exaggerated joyful features, oversized smile, bold outlines, saturated travel colors, comedic vitality." },
  { name: "Picasso Art", category: "Fine Art", vitality: "Cubist distortion, expressive color, gallery drama", image: filterSetFive, premium: true, prompt: "Transform the photo into Picasso-inspired art with cubist geometry, expressive color planes, asymmetrical facial structure, bold brushwork, gallery-level vitality." },
  { name: "Blue Pen Sketch", category: "Sketch", vitality: "Blue ink clarity, clean portrait lines, notebook feel", image: filterSetFive, prompt: "Transform the photo into a blue pen sketch with crisp cobalt ink, notebook paper texture, clean contour lines, delicate hatching, fresh creative vitality." },
  { name: "Pop Art", category: "Poster", vitality: "Halftone dots, neon contrast, comic poster punch", image: filterSetFive, premium: true, prompt: "Transform the photo into Pop Art with bright halftone dots, bold comic outlines, neon contrast, graphic poster framing, playful mass-culture vitality." },
  { name: "Cartoon", category: "Cartoon", vitality: "Friendly animated portrait, polished eyes, soft charm", image: filterSetSix, prompt: "Transform the photo into a modern cartoon portrait with friendly proportions, polished expressive eyes, smooth outlines, soft color gradients, approachable vitality." },
  { name: "Fam Guy Cartoon", category: "Cartoon", vitality: "Sitcom animation shape, flat colors, deadpan humor", image: filterSetSix, prompt: "Transform the photo into a family sitcom cartoon style with flat colors, simple facial shapes, clean TV animation lines, humorous everyday vitality." },
  { name: "Noir Comics", category: "Comics", vitality: "High contrast ink, dramatic shadows, pulp attitude", image: filterSetSix, premium: true, prompt: "Transform the photo into noir comics with high contrast black ink, dramatic shadows, limited color accents, moody pulp atmosphere, intense vitality." },
  { name: "Clay Figure", category: "Toy Studio", vitality: "Handmade clay texture, warm set lighting, cozy depth", image: filterSetSix, premium: true, prompt: "Transform the photo into a clay figure with handmade sculpted texture, soft studio lighting, rounded features, warm stop-motion atmosphere, tactile vitality." },
  { name: "Doll", category: "Toy Studio", vitality: "Glossy doll face, bright fashion color, cute polish", image: filterSetSeven, premium: true, prompt: "Transform the photo into a cute doll with glossy skin, large sparkling eyes, polished hair, bright fashion colors, toy-store lighting, sweet vitality." },
  { name: "Manga", category: "Anime", vitality: "Sharp anime emotion, crisp ink, romantic detail", image: filterSetSeven, prompt: "Transform the photo into manga with crisp ink outlines, expressive eyes, stylized hair, clean panel composition, emotional character vitality." },
  { name: "Oil Painting Art", category: "Fine Art", vitality: "Rich brush texture, glowing highlights, gallery warmth", image: filterSetSeven, premium: true, prompt: "Transform the photo into oil painting art with rich textured brush strokes, glowing skin highlights, deep shadows, expressive painterly color, classic vitality." },
  { name: "Papercut Art", category: "Craft", vitality: "Layered paper depth, handmade shapes, soft shadows", image: filterSetSeven, prompt: "Transform the photo into papercut art with layered cut-paper shapes, soft shadows, crafted edges, dimensional collage feel, handmade vitality." },
  { name: "Retro Game", category: "Pixel", vitality: "Pixel avatar energy, arcade color, nostalgic edge", image: filterSetEight, premium: true, prompt: "Transform the photo into retro game pixel art with crisp pixel edges, arcade color palette, 16-bit portrait detail, nostalgic character vitality." },
  { name: "Sticker", category: "Craft", vitality: "Clean cutout border, playful pose, shareable charm", image: filterSetEight, prompt: "Transform the photo into a sticker with clean white cutout border, bright simplified colors, playful character pose, glossy finish, shareable vitality." },
  { name: "Block Toy", category: "Toy Studio", vitality: "Plastic brick face, simple joy, collectible brightness", image: filterSetEight, premium: true, prompt: "Transform the photo into a block toy character with yellow plastic face, molded hair, simplified features, toy brick proportions, cheerful collectible vitality." },
  { name: "Crayon Drawing", category: "Illustration", vitality: "Colorful wax strokes, handmade youth, joyful texture", image: filterSetEight, prompt: "Transform the photo into a crayon drawing with waxy texture, bright childlike strokes, paper grain, playful color blending, joyful handmade vitality." },
  { name: "Enamel Pin", category: "Craft", vitality: "Polished metal outline, glossy color, collectible badge", image: filterSetNine, premium: true, prompt: "Transform the photo into an enamel pin with polished metal outlines, glossy flat color fills, collectible badge shape, cute character simplification, premium vitality." },
  { name: "Line Art", category: "Sketch", vitality: "Clean contour lines, minimal elegance, bright simplicity", image: filterSetNine, prompt: "Transform the photo into line art with clean contour drawing, minimal shading, elegant face structure, white paper background, simple refined vitality." },
  { name: "Felt Art", category: "Craft", vitality: "Soft fiber surface, plush texture, tactile warmth", image: filterSetNine, premium: true, prompt: "Transform the photo into felt art with soft fiber texture, plush sculpted details, warm handmade lighting, tactile surface depth, cozy vitality." },
  { name: "South Style Cartoon", category: "Cartoon", vitality: "Simple cutout comedy, flat color, quirky grin", image: filterSetNine, prompt: "Transform the photo into a satirical cutout cartoon style with simple shapes, flat color fields, big round eyes, quirky grin, comedic vitality." },
  { name: "Mini me doll", category: "Toy Studio", vitality: "Tiny avatar doll, premium cute scale, soft bokeh", image: filterSetTen, premium: true, prompt: "Transform the photo into a mini me doll with tiny collectible proportions, large glossy eyes, soft bokeh studio background, cute premium outfit detail, bright vitality." },
  { name: "Cube Face Toy", category: "Toy Studio", vitality: "Blocky smile, plastic shine, toy-shelf simplicity", image: filterSetTen, premium: true, prompt: "Transform the photo into a cube face toy with blocky plastic head, simple smiling expression, molded hair, bright toy-shelf lighting, playful vitality." },
];

const categories = ["All", ...Array.from(new Set(studioFilters.map((filter) => filter.category)))];

const imagePositions: Record<string, string> = {
  "Japanese Anime": "50% 0%",
  "Claude Monet": "50% 28%",
  "Art Nouveau": "50% 62%",
  "Toy Figure": "50% 100%",
  "Exhibit Artwork": "50% 0%",
  "Children's Book": "50% 32%",
  "3D Animation": "50% 66%",
  "Pencil Sketch": "50% 100%",
  Gold: "50% 0%",
  "Watercolor Art": "50% 32%",
  "Starry Night": "50% 66%",
  "Sketch on a box": "50% 100%",
  "Low poly 3D": "50% 0%",
  "Art deco": "50% 32%",
  "Energetic Manga": "50% 66%",
  "Classic Comics": "50% 100%",
  "Funny Caricature": "50% 0%",
  "Picasso Art": "50% 32%",
  "Blue Pen Sketch": "50% 66%",
  "Pop Art": "50% 100%",
  Cartoon: "50% 0%",
  "Fam Guy Cartoon": "50% 32%",
  "Noir Comics": "50% 66%",
  "Clay Figure": "50% 100%",
  Doll: "50% 0%",
  Manga: "50% 32%",
  "Oil Painting Art": "50% 66%",
  "Papercut Art": "50% 100%",
  "Retro Game": "50% 0%",
  Sticker: "50% 32%",
  "Block Toy": "50% 66%",
  "Crayon Drawing": "50% 100%",
  "Enamel Pin": "50% 0%",
  "Line Art": "50% 32%",
  "Felt Art": "50% 66%",
  "South Style Cartoon": "50% 100%",
  "Mini me doll": "50% 15%",
  "Cube Face Toy": "50% 88%",
};

export function PhotoStudio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<StudioFilter>(studioFilters[0]);
  const [copied, setCopied] = useState(false);

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
    await navigator.clipboard.writeText(selectedFilter.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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
              Access the visual filters from the provided references as reusable creator recipes for lively portraits, thumbnails, avatars, and social-ready AI images.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center min-w-[280px]">
            <Metric label="Filters" value={studioFilters.length.toString()} />
            <Metric label="Categories" value={(categories.length - 1).toString()} />
            <Metric label="Premium" value={studioFilters.filter((filter) => filter.premium).length.toString()} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="space-y-4 xl:sticky xl:top-6 self-start">
          <Card className="bg-card border-border theme-glow-box">
            <CardHeader className="border-b border-border bg-secondary/50">
              <CardTitle className="uppercase text-sm tracking-wider text-primary flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Active Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="relative overflow-hidden border border-border bg-secondary/30 min-h-[220px]">
                <img
                  src={selectedFilter.image}
                  alt={`${selectedFilter.name} reference board`}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  style={{ objectPosition: imagePositions[selectedFilter.name] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground uppercase text-[10px]">
                      {selectedFilter.category}
                    </Badge>
                    {selectedFilter.premium && (
                      <Badge variant="outline" className="border-accent text-accent uppercase text-[10px]">
                        <Crown className="w-3 h-3 mr-1" />
                        Crown
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedFilter.name}</h2>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                  Vitality Formula
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {selectedFilter.vitality}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Prompt Recipe
                  </p>
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="bg-secondary/50 border border-border p-3 text-xs text-foreground/80 leading-relaxed font-mono">
                  {selectedFilter.prompt}
                </div>
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
                    Copy Filter Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4 min-w-0">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search filters, categories, or vitality cues..."
                  className="w-full bg-secondary/40 border border-border pl-10 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-colors",
                      activeCategory === category
                        ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                        : "border-border text-muted-foreground hover:text-primary hover:border-primary/70"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredFilters.map((filter) => (
              <button
                key={filter.name}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "group text-left border bg-card overflow-hidden transition-all hover:border-primary hover:theme-glow-box",
                  selectedFilter.name === filter.name ? "border-primary theme-glow-box" : "border-border"
                )}
              >
                <div className="relative h-44 bg-secondary overflow-hidden">
                  <img
                    src={filter.image}
                    alt={`${filter.name} filter reference`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: imagePositions[filter.name] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-background/80 text-primary border border-primary/40 uppercase text-[10px]">
                      {filter.category}
                    </Badge>
                    {filter.premium && (
                      <span className="w-7 h-7 rounded-full border border-accent bg-background/80 text-accent flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-xl font-bold text-foreground drop-shadow-lg">{filter.name}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[48px]">
                    {filter.vitality}
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-primary">
                      <Palette className="w-3 h-3" />
                      Load Filter
                    </span>
                    <span className="text-muted-foreground">
                      {selectedFilter.name === filter.name ? "Active" : "Studio"}
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