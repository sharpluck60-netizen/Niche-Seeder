import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Copy, Check, Shuffle, Upload, X, ImageIcon,
  ChevronDown, ChevronUp, Sparkles, Star, AlertCircle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type Gender = "female" | "male";
type Tab = "explorer" | "vendor";

interface HairStyle {
  id: string;
  name: string;
  category: string;
  desc: string;
  tags: string[];
  visualDetail: string;
  technicalDetail: string;
}

/* ═══════════════════════════════════════════════════════
   FEMALE HAIRSTYLE DATABASE
═══════════════════════════════════════════════════════ */
const femaleStyles: HairStyle[] = [
  // BRAIDS & PROTECTIVE
  { id: "knotless-box", name: "Knotless Box Braids", category: "Braids", desc: "Tension-free box braids without knots at the root", tags: ["TRENDING", "PROTECTIVE"], visualDetail: "perfect knotless box braids with smooth, flat roots and no visible knots, each braid uniform in size and tension, hanging straight down in a natural fall", technicalDetail: "individual box-section partings across the scalp, braids tapering gradually toward the ends, seamless synthetic hair blending at the root, no bulge at the attachment point" },
  { id: "box-braids", name: "Box Braids", category: "Braids", desc: "Classic squared-section individual braids", tags: ["CLASSIC", "VIRAL"], visualDetail: "thick classic box braids with clean square parting grids across the scalp, braids with a slight sheen from added synthetic hair, uniform braid diameter throughout", technicalDetail: "evenly squared sections, 3-strand plaiting method, sealed ends, available in micro, medium, and jumbo sizes" },
  { id: "cornrows", name: "Cornrows", category: "Braids", desc: "Flat braids plaited close to the scalp", tags: ["CLASSIC", "VERSATILE"], visualDetail: "neat straight-back cornrows with perfectly straight rows following the scalp contour, close to the head, showing the scalp cleanly between each row", technicalDetail: "underhand plaiting directly against the scalp, rows parallel to each other, consistent sizing and tension throughout, feed-in method optional for thickness" },
  { id: "fulani-braids", name: "Fulani Braids", category: "Braids", desc: "Center cornrow with loose braids + beads", tags: ["CULTURAL", "HOT"], visualDetail: "a central cornrow down the middle of the scalp with loose braids falling around the face framing it, thin gold ring beads threaded on hanging braid ends, side cornrows swept back", technicalDetail: "combination of central parted cornrows and individual braids, cowrie shell and gold ring adornment, sometimes with side feeds, traditional Fula/Peul-inspired pattern" },
  { id: "stitch-braids", name: "Stitch Braids", category: "Braids", desc: "Cornrows with horizontal feed-in stitching effect", tags: ["VIRAL", "BOLD"], visualDetail: "cornrows with visible horizontal stitch-like parting lines feeding into the braid at regular intervals, creating a geometric ladder effect across the scalp", technicalDetail: "horizontal zigzag partings every half inch feeding into the main cornrow, requires feed-in synthetic hair, creates elevated horizontal lines visible against the scalp" },
  { id: "faux-locs", name: "Faux Locs", category: "Braids", desc: "Synthetic locs for the loc look without commitment", tags: ["POPULAR"], visualDetail: "locs that look naturally matted and textured, with a rough wrapping visible around each loc, freeform loose hairs at the root creating a natural loc appearance", technicalDetail: "crocheted synthetic loc extensions wrapped around braided base hair, twisted or wrapped method, varying thickness from thin to jumbo" },
  { id: "butterfly-locs", name: "Butterfly Locs", category: "Braids", desc: "Distressed boho locs with looped texture", tags: ["TRENDING", "VIRAL"], visualDetail: "short distressed locs with loops of hair visible on the surface of each loc, giving a boho messy textured appearance, can have loose wisps escaping the loc for a freeform look", technicalDetail: "crocheted or hand-looped synthetic hair wrapped loosely to create intentional distressed loops, shorter than regular faux locs, very textured" },
  { id: "goddess-locs", name: "Goddess Locs", category: "Braids", desc: "Faux locs with curly wavy ends", tags: ["GLAMOROUS"], visualDetail: "neat faux locs from root to mid-shaft that open into flowing curly or wavy ends, a mix of tight loc texture at top transitioning to loose ringlets or waves at the ends", technicalDetail: "loc extension with open curly or wet-and-wavy ends, the braid is wrapped tight at top and left loose at the bottom third, creating a dual-texture effect" },
  // LOCS
  { id: "starter-locs", name: "Starter Locs", category: "Locs", desc: "Early-stage natural locs, freshly twisted", tags: ["NATURAL", "JOURNEY"], visualDetail: "neatly twisted small starter locs in the early budding phase, small uniformly sized twists that are beginning to loc, round at the ends, close to the scalp", technicalDetail: "palm-rolled or two-strand twisted sections at the beginning of the loc journey, typically 1-2 months old, uniform parting pattern" },
  { id: "mature-locs", name: "Mature Locs", category: "Locs", desc: "Fully formed locs with length and maturity", tags: ["NATURAL", "ICONIC"], visualDetail: "fully matured locs ranging from thin to medium thickness, each loc individually distinct with slight variation in texture, hanging with natural weight and movement, healthy sheen", technicalDetail: "locs aged 2+ years, passed the budding and teenage phases, fully locked and consolidated, cylindrical shape with closed ends, natural variation in size" },
  { id: "sisterlocks", name: "Sisterlocks", category: "Locs", desc: "Ultra-fine micro locs with a specific grid pattern", tags: ["ELEGANT", "PRECISE"], visualDetail: "hundreds of very fine thin locs no bigger than a pencil tip, densely packed across the scalp creating a full head of tiny uniform locs, extremely neat grid parting", technicalDetail: "proprietary Sisterlocks grid parting system, retightening every 4-6 weeks, uses a special tool, no product required, extremely fine uniform locs" },
  // NATURAL HAIR
  { id: "wash-n-go", name: "4C Wash & Go", category: "Natural", desc: "Defined coils on 4C natural hair", tags: ["NATURAL", "TRENDING"], visualDetail: "fully defined tight coil pattern on 4C natural hair, small tight springy coils perfectly defined all over the head, high shrinkage creating a halo of coils, healthy shine from gel or cream", technicalDetail: "4C coil pattern (very tight zig-zag), defined with leave-in conditioner and gel, refreshed with water spray, maximum shrinkage, very dense coil pattern" },
  { id: "twist-out", name: "Twist-Out", category: "Natural", desc: "Elongated defined coils from unraveled twists", tags: ["NATURAL", "CLASSIC"], visualDetail: "stretched defined coil pattern with elongated spiral curls from unraveled two-strand twists, fuller volume than a wash-n-go with less shrinkage, soft touchable coils", technicalDetail: "two-strand twists applied to damp hair, allowed to dry fully then unraveled in sections for defined elongated curls, stretched 20-30% beyond natural shrinkage" },
  { id: "natural-afro", name: "Natural Afro", category: "Natural", desc: "Round shaped full natural afro", tags: ["ICONIC", "BOLD"], visualDetail: "perfectly rounded full afro with an even spherical shape, dense natural 4C or 3C coils picked out into a wide halo around the head, symmetrical shape, rich natural texture", technicalDetail: "picked out and shaped with an afro pick, natural coil pattern, can be any curl type 3A-4C, shaped into perfect sphere or oval shape, moisturized for sheen" },
  { id: "bantu-knots", name: "Bantu Knots", category: "Natural", desc: "Spiral coiled knots pinned at the scalp", tags: ["CULTURAL", "BOLD"], visualDetail: "small perfectly coiled knots pinned flat against the scalp arranged in a neat pattern, each knot a perfect tight spiral of hair wound and tucked, evenly distributed across the head", technicalDetail: "sections of hair twisted and wound tightly around itself against the scalp, secured by tucking the end under the coil, traditional Zulu-originated style" },
  { id: "high-puff", name: "High Natural Puff", category: "Natural", desc: "High ponytail puff with natural hair", tags: ["QUICK", "VIRAL"], visualDetail: "a large fluffy natural hair puff pulled high at the crown, the sides slicked down with edge control, natural coils forming a large round cloud at the top of the head", technicalDetail: "all hair gathered high at the crown with a silk scrunchie or band, edges laid with edge control gel, halo of natural coils or curls at the top" },
  // STRAIGHT & SLEEK
  { id: "silk-press", name: "Silk Press", category: "Straight", desc: "Bone-straight flat-ironed natural hair with silk shine", tags: ["VIRAL", "GLAMOROUS"], visualDetail: "natural hair flat-ironed to a glass-like bone-straight finish with incredible reflective shine, hair swings and moves with every head movement, silky smooth surface with no frizz, healthy appearance", technicalDetail: "blow-dried then flat-ironed section by section at 375-400°F on natural hair, uses silk press serum for heat protection and shine, swings with movement, no breakage look" },
  { id: "bone-straight", name: "Bone Straight Weave", category: "Straight", desc: "Ultra-sleek bone-straight weave or wig", tags: ["SLEEK", "POPULAR"], visualDetail: "ultra-pin-straight weave or wig laying flat with a mirror-like shine, every strand perfectly aligned and laying flat, high-gloss reflective sheen under light, clean middle or side part", technicalDetail: "bone-straight grade hair (usually Brazilian or Malaysian), high-grade remy hair, flat-iron finished at 450°F, light-reflecting surface, no wave or curl" },
  // BOBS & CUTS
  { id: "blunt-bob", name: "Blunt Bob", category: "Bob", desc: "Sharp blunt-cut bob at jaw level", tags: ["TRENDING", "CHIC"], visualDetail: "a perfectly blunt-cut bob with a razor-sharp bottom line, hair cut straight across at jaw level with no layering, sleek and heavy looking, geometric precision", technicalDetail: "one-length cut with no graduation or layering, all hair cut to the same length with a razor or sharp scissors for a blunt heavy look, usually chin to jaw length" },
  { id: "curly-bob", name: "Curly Bob", category: "Bob", desc: "Curly or coily bob with volume", tags: ["TRENDY", "FUN"], visualDetail: "a short bouncy bob with curly or coily texture, curls springing outward creating a rounded full silhouette, the bob shape visible beneath the curl volume", technicalDetail: "cut to bob length on naturally curly or textured hair, curls create volume that extends the visual length, can be done on 2C-4B curl types" },
  { id: "asymmetric-bob", name: "Asymmetric Bob", category: "Bob", desc: "Bob longer on one side, shorter on the other", tags: ["EDGY", "BOLD"], visualDetail: "a dramatic asymmetric bob with one side cut short at the ear and the other side sweeping down to jaw or collarbone length, strong angular silhouette", technicalDetail: "graduated cut with intentional length difference between sides, strong diagonal line, usually paired with a deep side part" },
  // WEAVE & WIGS
  { id: "hd-lace-frontal", name: "HD Lace Frontal Wig", category: "Wigs", desc: "Undetectable lace frontal wig with natural hairline", tags: ["VIRAL", "LUXE"], visualDetail: "a HD lace frontal wig with an invisible lace hairline that melts seamlessly into any skin tone, the hairline appearing completely natural with baby hairs laid and styled, the hair body smooth and natural-looking", technicalDetail: "HD Swiss lace 13x4 or 13x6 frontal, pre-bleached knots, pre-plucked hairline, installed with Got2B glue or tape, baby hairs styled with edges for natural look" },
  { id: "body-wave", name: "Body Wave Weave", category: "Wigs", desc: "Soft loose S-wave pattern weave", tags: ["POPULAR", "NATURAL"], visualDetail: "soft gentle S-shaped waves flowing down the hair, not tight curls but not straight, a loose natural-looking wave pattern that moves with the head, glossy and soft", technicalDetail: "medium wave pattern, 2-3 inch wave definition, usually Brazilian or Peruvian body wave hair, 3-4 bundle weave installation, looks natural and luxurious" },
  { id: "deep-wave", name: "Deep Wave Wig", category: "Wigs", desc: "Deep defined corkscrew wave pattern", tags: ["LUXE", "FULL"], visualDetail: "tightly defined deep wave curls from root to end, each wave a deep consistent corkscrew wave, very voluminous and full, hair spiraling in tight consistent waves", technicalDetail: "tight consistent wave pattern approx 1-inch wave definition, water wave variation is looser, usually installed as a full wig or weft sew-in, bundles stacked for volume" },
  // COLOR
  { id: "honey-blonde", name: "Honey Blonde", category: "Color", desc: "Rich warm honey blonde all-over color", tags: ["TRENDING", "WARM"], visualDetail: "rich warm honey blonde color throughout the hair, a mix of golden, amber, and caramel tones that look multi-dimensional in light, warmth against the skin tone", technicalDetail: "level 7-9 blonde with warm gold undertones, usually achieved with bleach + toner or pre-colored weave/wig, no ashy undertones" },
  { id: "ombre-black-honey", name: "Black to Honey Ombré", category: "Color", desc: "Natural roots fading to honey blonde ends", tags: ["VIRAL", "STUNNING"], visualDetail: "natural dark roots at the crown gradually transitioning to honey blonde or copper at the mid-shaft and ends, a seamless gradient of dark to light", technicalDetail: "balayage or ombre coloring technique, usually hand-painted for natural graduation, color deposited at mid-lengths and ends only, roots left natural or dark" },
  { id: "burgundy", name: "Burgundy / Wine", category: "Color", desc: "Deep red-wine burgundy color", tags: ["HOT", "BOLD"], visualDetail: "deep rich burgundy-wine color throughout the hair, a dark red-purple tone that shows vibrancy in sunlight, appearing dark indoors and vibrant red-wine in the sun", technicalDetail: "level 3-4 red-violet, achieved with burgundy dye or pre-colored hair, looks dark in shade and shows red tones in sunlight, warm tones complement most skin tones" },
  { id: "pink-fantasy", name: "Fantasy Pink", category: "Color", desc: "Bold pastel to hot pink statement color", tags: ["BOLD", "VIRAL"], visualDetail: "bold vibrant pink hair ranging from pastel blush to hot neon pink, high-impact color that catches attention in any lighting, glowing in natural light", technicalDetail: "requires pre-lightening to level 10 platinum for pastel, level 8-9 for hot pink, semi-permanent or direct dye application, fades gracefully" },
];

/* ═══════════════════════════════════════════════════════
   MALE HAIRSTYLE DATABASE
═══════════════════════════════════════════════════════ */
const maleStyles: HairStyle[] = [
  // FADES
  { id: "skin-fade", name: "Skin Fade", category: "Fade", desc: "Zero taper all the way to the skin", tags: ["CLASSIC", "SHARP"], visualDetail: "a bald/skin fade with the hair tapering completely to the skin at the sides and back, the fade line clean and sharp, a clear contrast between the skin and the hair on top", technicalDetail: "clipper fade from 0 (skin) blending up to the natural length on top, using guards 0, 0.5, 1, 1.5 to create a seamless gradient" },
  { id: "low-fade", name: "Low Fade", category: "Fade", desc: "Fade starting just above the ear", tags: ["CLEAN", "VERSATILE"], visualDetail: "a low fade that begins just above the ear and nape, with the fade line sitting low on the sides, clean and subtle, most of the side hair maintained at natural length", technicalDetail: "fade begins 1-2 finger-widths above the ear, minimal fade with maximum hair retention, subtle and professional" },
  { id: "mid-fade", name: "Mid Fade", category: "Fade", desc: "Fade beginning at the temple level", tags: ["POPULAR", "BALANCED"], visualDetail: "fade beginning at mid-temple height, creating a clear contrast mid-way up the sides, balanced between the subtle low fade and dramatic high fade", technicalDetail: "fade begins at the temple level, around 2-3 inches above the ear, most versatile and commonly requested fade height" },
  { id: "burst-fade", name: "Burst Fade Mohawk", category: "Fade", desc: "Curved burst fade creating a mohawk silhouette", tags: ["VIRAL", "BOLD"], visualDetail: "a burst fade curving around the ear in a semi-circular arc, the fade radiating outward like a sunburst from behind the ear, leaving a strip of hair on top like a mohawk or Mohican", technicalDetail: "curved fade line sweeping behind the ear in a crescent shape, requires precise clipper work to maintain the curve, creates a curved burst effect" },
  { id: "temple-fade", name: "Temple Fade (808)", category: "Fade", desc: "Tight fade at the temples only", tags: ["CLEAN", "FRESH"], visualDetail: "fade concentrated at the temples and sideburn area only, cleaning up the hairline dramatically at the temple, the rest of the sides left full, creating a sharp temple definition", technicalDetail: "also called 808 or Brooklyn fade, fade only at temple corners, very conservative and professional" },
  { id: "drop-fade", name: "Drop Fade", category: "Fade", desc: "Fade that drops behind the ear", tags: ["MODERN", "SHARP"], visualDetail: "a fade line that drops down behind the ear instead of going straight across, the back section lower than the sides, creating a curved arc drop effect", technicalDetail: "the taper line curves downward behind the ear toward the nape, creates a curved silhouette from the front" },
  // WAVES
  { id: "360-waves", name: "360 Waves", category: "Waves", desc: "Deep spinning wave pattern around the entire head", tags: ["ICONIC", "VIRAL"], visualDetail: "360-degree deep wave pattern spinning from the crown outward in all directions, deep rippling waves covering the full head, a consistent dark-light-dark ripple visible when hair is in motion or caught in light", technicalDetail: "achieved through daily wolfing (not cutting), consistent brushing in rotational pattern with soft and hard brushes, du-rag compression, moisturizer and pomade" },
  { id: "540-waves", name: "540 Waves", category: "Waves", desc: "Waves covering top and connecting to back", tags: ["ELITE", "RARE"], visualDetail: "extreme wave pattern covering 540 degrees — the full crown plus sides and back connected seamlessly, deep consistent wave depth throughout, every angle showing rippling wave patterns", technicalDetail: "advanced level beyond 360, requires growing hair longer, connecting wave patterns from front to sides to back, usually done by experienced wavers" },
  // LOCS
  { id: "male-starter-locs", name: "Starter Locs", category: "Locs", desc: "Early stage locs on male hair", tags: ["JOURNEY", "NATURAL"], visualDetail: "freshly twisted starter locs on short to medium male hair, small uniform coils beginning to loc, clean parts between sections, young loc journey look", technicalDetail: "palm rolled or comb-coiled starter locs, uniform size, early budding stage, some shine from water or oil moisture" },
  { id: "mature-male-locs", name: "Mature Locs with Fade", category: "Locs", desc: "Long mature locs paired with a skin fade", tags: ["TRENDING", "VIRAL"], visualDetail: "long mature thick locs on top combined with a tight skin or mid-fade on the sides and back, dramatic contrast between the loc length on top and clean fade below", technicalDetail: "undercut or fade applied to locs, locs grouped or loose on top, sides clean-faded, a modern loc style popular with athletes and artists" },
  { id: "loc-mohawk", name: "Loc Mohawk / Frohawk", category: "Locs", desc: "Locs styled into a mohawk shape", tags: ["BOLD", "EDITORIAL"], visualDetail: "locs gathered and secured into a tall central mohawk or frohawk ridge from front to back, the sides either faded or twisted flat, locs standing and falling in the center strip", technicalDetail: "locs pinned or banded into a central strip running crown to nape, can have faded sides, locs falling forward or back from the ridge" },
  // BRAIDS
  { id: "male-cornrows", name: "Cornrow Braids", category: "Braids", desc: "Straight-back or designed cornrows on male hair", tags: ["CLASSIC", "CULTURAL"], visualDetail: "neat straight-back cornrows on male hair running front to back, clean side parts, scalp visible between rows, fresh and neat appearance with sharp lines", technicalDetail: "underhand plaiting on male hair, usually 4-8 rows depending on head size, often paired with a fade on the sides" },
  { id: "male-box-braids", name: "Box Braids Male", category: "Braids", desc: "Individual box braids on male hair", tags: ["BOLD", "TRENDING"], visualDetail: "short to medium individual box braids on male hair, usually shoulder length or shorter, braids hanging freely all over the head, can have a low fade underneath", technicalDetail: "individual box-sectioned braids on male hair, can be done with or without extensions, popular in hip-hop and athletic communities" },
  // AFRO & NATURAL
  { id: "shaped-afro", name: "Shaped Afro", category: "Natural", desc: "Natural afro with a precise geometric shape", tags: ["ICONIC", "BOLD"], visualDetail: "a precisely shaped natural afro with clean, geometric edges picked out into a perfect sphere or flat-top rectangle, sharp line-up on the edges, confident and bold", technicalDetail: "natural hair picked out with an afro pick, edges lined up with clippers, can be rounded, square, or angled top shape" },
  { id: "frohawk", name: "Frohawk", category: "Natural", desc: "Afro styled into a mohawk ridge", tags: ["EDGY", "CREATIVE"], visualDetail: "natural afro hair gathered into a central mohawk strip from forehead to nape, sides either faded or twisted flat against the head, natural coils forming a tall center ridge", technicalDetail: "sides twisted, braided, or faded down, center natural hair combed upward into a ridge, strong styling product to hold" },
  { id: "high-top-fade", name: "High-Top Fade", category: "Natural", desc: "Flat-top natural hair with sides faded", tags: ["RETRO", "ICONIC"], visualDetail: "a flat-top box shape on natural hair, the top section of hair grown out and shaped flat and level creating a square plateau, sides and back faded cleanly below", technicalDetail: "natural hair grown on top and shaped with a level comb-cut into a flat horizontal plane, sides faded or tapered, iconic 80s/90s style with modern comeback" },
  // CURLY & TEXTURED
  { id: "curly-top-fade", name: "Curly Top Fade", category: "Curly", desc: "Natural curls on top with a fade", tags: ["POPULAR", "FRESH"], visualDetail: "natural curly or wavy hair left full on top with loose defined curls, the sides and back faded cleanly, curls bouncing naturally on top creating volume", technicalDetail: "fade on sides and back, natural curl pattern (2C-3C) left natural on top, often with a deep side part or French crop taper" },
  { id: "taper-fade-curls", name: "Taper + Defined Curls", category: "Curly", desc: "Tapered sides with defined curl product on top", tags: ["CLEAN", "MODERN"], visualDetail: "a classic taper on the sides fading to the skin, natural curls on top defined with product creating shiny defined coils or waves, the contrast between faded sides and textured top", technicalDetail: "standard taper on sides, curl cream or twisting cream applied on top to define natural curl pattern, 2C-4A curl types" },
];

/* ═══════════════════════════════════════════════════════
   AI TOOLS FOR STYLE EXPLORER
═══════════════════════════════════════════════════════ */
const explorerTools = [
  { id: "midjourney", label: "Midjourney", note: "Use --v 7 for realism" },
  { id: "nano-banana", label: "Nano Banana", note: "Use for fast image editing with references" },
  { id: "flux", label: "Flux Pro", note: "Best for photorealism" },
  { id: "dalle3", label: "DALL-E 3", note: "Via ChatGPT or API" },
  { id: "firefly", label: "Adobe Firefly", note: "Generative fill works great" },
  { id: "leonardoai", label: "Leonardo.AI", note: "Phoenix model" },
  { id: "stable-diffusion", label: "Stable Diffusion", note: "Best with ControlNet" },
];

/* ═══════════════════════════════════════════════════════
   VENDOR STUDIO AI TOOLS
═══════════════════════════════════════════════════════ */
const vendorTools = [
  {
    id: "nano-banana",
    label: "Nano Banana",
    color: "text-yellow-300 border-yellow-400/40 bg-yellow-400/5",
    instructions: `HOW TO USE IN NANO BANANA:
1. Upload TWO reference images when possible:
   - Reference 1: the hair product image
   - Reference 2: the female model image
2. Paste the prompt below and tell Nano Banana to preserve the model's face, skin tone, pose, body shape, and identity.
3. Tell it to replace ONLY the hair area using the uploaded hair product reference.
4. If the first result glitches, regenerate with: "keep face identical, fix hairline, blend lace naturally, preserve ears and forehead."
5. Use the negative prompt section to reduce warped hairlines, floating wigs, and melted strands.`,
  },
  {
    id: "midjourney",
    label: "Midjourney",
    color: "text-blue-400 border-blue-500/40 bg-blue-500/5",
    instructions: `HOW TO USE IN MIDJOURNEY:
1. Upload your hair product image to Discord (drag & drop into chat)
2. Right-click the image → Copy Link
3. Paste the image URL at the start of your /imagine prompt
4. Use the image weight flag: --iw 1.5 to 2.0 for strong hair reference
5. Example: /imagine [your-image-url] [full prompt below] --iw 1.8 --v 7`,
  },
  {
    id: "flux",
    label: "Flux + IP-Adapter",
    color: "text-purple-400 border-purple-500/40 bg-purple-500/5",
    instructions: `HOW TO USE WITH FLUX PRO + IP-ADAPTER:
1. Open Replicate, Fal.ai, or ComfyUI with Flux Pro
2. Load the IP-Adapter or Style Reference node
3. Upload your hair product image as the reference image
4. Set IP-Adapter weight to 0.8-1.0 for strong hair reference
5. Use the prompt below in the positive prompt field
6. Set the IP-Adapter to affect "style" or "composition" — not face`,
  },
  {
    id: "stable-diffusion",
    label: "Stable Diffusion",
    color: "text-green-400 border-green-500/40 bg-green-500/5",
    instructions: `HOW TO USE IN AUTOMATIC1111 / ComfyUI:
1. Use SDXL or SD 1.5 with ControlNet
2. Load your hair product image into ControlNet → set mode to "Reference Only"
3. Set ControlNet weight to 0.7-0.9
4. OR use img2img with your hair image as init image, denoising at 0.55-0.65
5. Use the prompt below in the positive prompt
6. Negative prompt: bald, hat, head covering, pixelated, blurry, distorted face`,
  },
  {
    id: "firefly",
    label: "Adobe Firefly",
    color: "text-orange-400 border-orange-500/40 bg-orange-500/5",
    instructions: `HOW TO USE IN ADOBE FIREFLY (Generative Fill):
1. Go to firefly.adobe.com → Generate Image, OR open in Photoshop
2. First generate a base model image using the prompt below
3. Once generated, use Generative Fill: select ONLY the hair area
4. Upload your hair product image as "Style Reference" 
5. Type "wearing [hair description]" in the fill prompt
6. Generate multiple variations and choose the best composite`,
  },
  {
    id: "runway",
    label: "Runway Gen-3",
    color: "text-primary border-primary/40 bg-primary/5",
    instructions: `HOW TO USE IN RUNWAY GEN-3:
1. Open Runway → Image to Image mode
2. Upload your hair product image as the reference/source image
3. Set the image influence slider to 40-60% (enough for hair, not too much)
4. Paste the prompt below into the text prompt field
5. Generate → use the "Variation" feature to get multiple tries
6. If the hair doesn't transfer cleanly, increase image influence to 70%`,
  },
];

/* ═══════════════════════════════════════════════════════
   MODEL SKIN TONES
═══════════════════════════════════════════════════════ */
const skinTones = [
  { id: "light", label: "Light", desc: "fair, porcelain, light beige skin tone" },
  { id: "medium", label: "Medium", desc: "medium olive, tan, honey-brown skin tone" },
  { id: "rich", label: "Rich Brown", desc: "rich warm brown skin tone, medium-deep" },
  { id: "deep", label: "Deep", desc: "deep melanin-rich dark brown skin tone" },
  { id: "ebony", label: "Ebony", desc: "deep ebony, very dark skin tone, blue-black undertones" },
];

/* ═══════════════════════════════════════════════════════
   HAIR LENGTHS
═══════════════════════════════════════════════════════ */
const hairLengths = ["Pixie Short", "Ear Length", "Chin / Bob", "Shoulder", "Collarbone", "Chest", "Waist", "Hip Length", "Knee Length"];

/* ═══════════════════════════════════════════════════════
   LIGHTING SETTINGS
═══════════════════════════════════════════════════════ */
const lightingOptions = [
  { id: "studio", label: "Studio Light", desc: "clean white studio, soft box lighting" },
  { id: "golden", label: "Golden Hour", desc: "warm amber sunset backlight" },
  { id: "dramatic", label: "Dramatic", desc: "rembrandt shadow, high contrast" },
  { id: "natural", label: "Natural Window", desc: "soft natural daylight from side" },
  { id: "neon", label: "Neon Glow", desc: "colorful neon light wash" },
  { id: "editorial", label: "Editorial", desc: "magazine-quality high fashion light" },
];

/* ═══════════════════════════════════════════════════════
   PROMPT BUILDERS
═══════════════════════════════════════════════════════ */
function buildExplorerPrompt(
  style: HairStyle,
  gender: Gender,
  skin: string,
  length: string,
  lighting: string,
  subject: string,
  toolId: string
): string {
  const skinTone = skinTones.find((s) => s.id === skin)?.desc ?? skin;
  const light = lightingOptions.find((l) => l.id === lighting)?.desc ?? lighting;
  const subjectLine = subject.trim() || (gender === "female" ? "a woman" : "a man");

  const toolSuffix: Record<string, string> = {
    midjourney: "photorealistic, 8K, fashion photography, --v 7 --ar 4:5",
    "nano-banana": "Nano Banana image edit prompt, preserve face and identity, realistic hair replacement, clean reference-guided result",
    flux: "photorealistic, hyperdetailed hair texture, 8K resolution, Flux Pro quality",
    dalle3: "photorealistic photography style, hyperdetailed, professional hair portrait",
    firefly: "photorealistic, Adobe Firefly generative, detailed hair texture, editorial",
    leonardoai: "photorealistic, Leonardo Phoenix engine, 8K, hyperdetailed hair",
    "stable-diffusion": "photorealistic, SDXL, highly detailed hair, 8K, RAW photo, sharp focus",
  };

  return `SELECTED HAIRSTYLE SETTINGS:
Gender: ${gender}
Style: ${style.name}
Category: ${style.category}
Skin tone: ${skinTone}
Hair length: ${gender === "female" ? length : "natural length for this male style"}
Lighting: ${lightingOptions.find((l) => l.id === lighting)?.label ?? lighting}
Image model: ${explorerTools.find((t) => t.id === toolId)?.label ?? toolId}

Photorealistic portrait of ${subjectLine} with ${skinTone}, wearing ${style.name} hairstyle. 

HAIR DETAIL: ${style.visualDetail}. Hair length: ${gender === "female" ? length : "natural length for this male style"}. ${style.technicalDetail}.

LIGHTING & SETTING: ${light}. Clean background that complements the hair color. Professional hairstyle photography composition, the hair is the hero of the image.

TECHNICAL: Head and shoulders framing, sharp focus on hair texture and definition, every strand rendered individually, ${style.tags.map((t) => t.toLowerCase()).join(", ")} aesthetic. No wigs appearing fake, no synthetic-looking hairline, photographic realism throughout.

${toolSuffix[toolId] ?? "photorealistic, 8K, hyperdetailed"}`;
}

function buildVendorPrompt(
  hairDesc: string,
  modelDesc: string,
  skinToneId: string,
  length: string,
  lighting: string,
  toolId: string,
  hasHairReference: boolean,
  hasModelReference: boolean
): string {
  const skinTone = skinTones.find((s) => s.id === skinToneId)?.desc ?? skinToneId;
  const light = lightingOptions.find((l) => l.id === lighting)?.desc ?? lighting;
  const toolName = vendorTools.find((t) => t.id === toolId)?.label ?? toolId;
  const modelReferenceRule = hasModelReference
    ? `MODEL REFERENCE: Use the uploaded female model reference image as the base. Preserve her face, pose, body shape, skin tone, expression, camera angle, and identity. Replace only the hairstyle/hair area. ${modelDesc.trim() ? `Model notes: ${modelDesc.trim()}.` : ""}`
    : `MODEL CREATION: Create a female model with ${skinTone}. ${modelDesc.trim() ? `Model notes: ${modelDesc.trim()}.` : "Use a clean professional beauty model pose."}`;
  const hairReferenceRule = hasHairReference
    ? "HAIR REFERENCE: Use the uploaded hair product reference image as the exact source for hair color, texture, density, curl/wave pattern, lace/frontal style, shine, fullness, and length behavior."
    : "HAIR REFERENCE: No hair product image is uploaded yet, so follow the written hair description exactly.";

  return `SELECTED VENDOR SETTINGS:
Image model: ${toolName}
Hair reference uploaded: ${hasHairReference ? "yes" : "no"}
Model reference uploaded: ${hasModelReference ? "yes" : "no"}
Model gender: female only
Target skin tone: ${skinTone}
Target hair length: ${length}
Lighting: ${lightingOptions.find((l) => l.id === lighting)?.label ?? lighting}

Ultra-photorealistic commercial beauty portrait of a female model only with ${skinTone}, wearing ${hairDesc || "the exact hair product shown in the uploaded hair reference image"} at ${length} length. This is a hair brand / hair vendor sales image for a real product listing, so the hair must remain the hero and must match the uploaded product reference.

REFERENCE IMAGE COMMANDS:
${hairReferenceRule}
${modelReferenceRule}
If using an image model that accepts multiple references, treat the hair product as Reference Image 1 and the female model as Reference Image 2. Do not blend the two faces or change the model identity. Apply the hair from Reference Image 1 onto the head of the female model in Reference Image 2.

HAIR PLACEMENT: The hair sits perfectly on the female model's head with a natural hairline — no visible lace, no synthetic sheen, no floating edges, no warped scalp, no unnatural hairline. The hair follows the skull shape, temples, forehead curve, ears, shoulders, and gravity correctly. Individual strands at the hairline blend seamlessly into the scalp. The hair part (if applicable) shows a natural scalp below.

HAIR DETAIL: ${length} length hair, every strand hyperdetailed, natural movement and texture consistent throughout from root to end. The hair color, density, lace/frontal style, wave pattern, curl pattern, shine level, bundle fullness, and texture match the uploaded reference product image exactly. Do not invent a different hair texture or color.

FACE & BODY: The model's face is perfectly clear and unobstructed. Natural makeup or no makeup. No accessories covering the hairline. Shoulders visible for context. Female model only; no male model, no mannequin, no child, no extra people.

LIGHTING: ${light}. Lighting specifically chosen to showcase the hair's shine, texture, and movement. Key light on the hair for maximum product visibility. Clean e-commerce beauty campaign finish.

TECHNICAL: Commercial beauty photography, 8K resolution, RAW photo quality, sharp focus on hair texture, natural skin rendering, no watermarks, no artifacts, no extra limbs, no duplicated face, no distorted ears, no melted strands, no broken curls, no glitching around the forehead or edges. The hair appears indistinguishable from professionally photographed real hair installed by an expert stylist.

NEGATIVE PROMPT: male model, mannequin, child, floating wig, detached hair, bad lace, visible wig cap, melted hairline, plastic shine, synthetic-looking fibers, blurry hair, distorted face, extra face, duplicated head, warped ears, hair clipping through skin, gaps at hairline, artifacts, watermark, text.`;
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export function HairstyleLab() {
  const [tab, setTab] = useState<Tab>("explorer");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          <Sparkles className="w-3 h-3 text-primary" />
          Hairstyle Lab
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary glitch-text" data-text="HAIR STUDIO">
          HAIR STUDIO
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Generate cinematic AI hair prompts for male or female styles — or upload a vendor hair product and get female-only prompts to place it cleanly on a model for sales visuals.
        </p>
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => setTab("explorer")}
            className={cn(
              "px-5 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all",
              tab === "explorer"
                ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
            )}
          >
            Style Explorer
          </button>
          <button
            type="button"
            onClick={() => setTab("vendor")}
            className={cn(
              "px-5 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all",
              tab === "vendor"
                ? "bg-amber-400/10 text-amber-400 border-amber-400/60"
                : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-400/40"
            )}
          >
            Vendor Studio
            <span className="ml-2 text-[8px] border border-current px-1 py-0.5">NEW</span>
          </button>
        </div>
      </div>

      {tab === "explorer" && <StyleExplorer />}
      {tab === "vendor" && <VendorStudio />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STYLE EXPLORER TAB
═══════════════════════════════════════════════════════ */
function StyleExplorer() {
  const { toast } = useToast();
  const [gender, setGender] = useState<Gender>("female");
  const [catFilter, setCatFilter] = useState("All");
  const [selected, setSelected] = useState<HairStyle | null>(null);
  const [skin, setSkin] = useState("rich");
  const [length, setLength] = useState("Shoulder");
  const [lighting, setLighting] = useState("studio");
  const [subject, setSubject] = useState("");
  const [tool, setTool] = useState("midjourney");
  const [copied, setCopied] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  const styles = gender === "female" ? femaleStyles : maleStyles;
  const categories = ["All", ...Array.from(new Set(styles.map((s) => s.category)))];
  const filtered = catFilter === "All" ? styles : styles.filter((s) => s.category === catFilter);

  const prompt = selected
    ? buildExplorerPrompt(selected, gender, skin, length, lighting, subject, tool)
    : "";

  async function copyPrompt() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: "Prompt copied!", description: "Paste into your AI image generator." });
    setTimeout(() => setCopied(false), 2000);
  }

  function shuffle() {
    const pool = filtered.length > 0 ? filtered : styles;
    setSelected(pool[Math.floor(Math.random() * pool.length)]);
    setPromptOpen(true);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      {/* LEFT: Style picker */}
      <div className="space-y-4">
        {/* Gender toggle */}
        <div className="border border-border bg-card p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-3">Gender</div>
          <div className="flex gap-2">
            {(["female", "male"] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => { setGender(g); setCatFilter("All"); setSelected(null); }}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all",
                  gender === g
                    ? "bg-primary text-primary-foreground border-primary theme-glow-box"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                )}
              >
                {g === "female" ? "♀ Female" : "♂ Male"}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="border border-border bg-card p-4 space-y-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Category</div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCatFilter(cat)}
                className={cn(
                  "px-2.5 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                  catFilter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Styles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[540px] overflow-y-auto pr-1">
          {filtered.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => { setSelected(style); setPromptOpen(true); }}
              className={cn(
                "text-left border p-3 transition-all dw-bracket group",
                selected?.id === style.id
                  ? "border-primary bg-primary/10 theme-glow-box"
                  : "border-border bg-card hover:border-primary/60 hover:bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={cn(
                  "text-[11px] font-bold leading-tight",
                  selected?.id === style.id ? "text-primary" : "text-foreground"
                )}>
                  {style.name}
                </span>
                <span className="text-[8px] border border-border px-1.5 py-0.5 text-muted-foreground shrink-0">
                  {style.category}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed mb-2">{style.desc}</p>
              <div className="flex flex-wrap gap-1">
                {style.tags.map((tag) => (
                  <span key={tag} className={cn(
                    "text-[7px] px-1.5 py-0.5 uppercase tracking-wider font-bold",
                    tag === "VIRAL" || tag === "TRENDING" || tag === "HOT"
                      ? "text-amber-400 border border-amber-400/30 bg-amber-400/5"
                      : "text-muted-foreground border border-border"
                  )}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={shuffle}
          className="w-full border border-dashed border-border py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors flex items-center justify-center gap-2"
        >
          <Shuffle className="w-3 h-3" />
          Random Style
        </button>
      </div>

      {/* RIGHT: Controls + Prompt */}
      <div className="space-y-4">
        {/* Selected style */}
        {selected ? (
          <div className="border border-primary bg-primary/5 theme-glow-box p-4">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Selected Style</div>
            <div className="text-lg font-bold text-foreground">{selected.name}</div>
            <div className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{selected.visualDetail}</div>
          </div>
        ) : (
          <div className="border border-dashed border-border bg-card p-6 text-center">
            <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-[11px] text-muted-foreground">Pick a style from the left</p>
          </div>
        )}

        {/* Subject */}
        <div className="border border-border bg-card p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Subject Description <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span>
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={gender === "female" ? "e.g. a woman in her 30s, confident expression..." : "e.g. a young man, athletic build, beard..."}
            className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Skin tone */}
        <div className="border border-border bg-card p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Skin Tone</div>
          <div className="grid grid-cols-5 gap-1">
            {skinTones.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSkin(s.id)}
                className={cn(
                  "py-2 text-[8px] uppercase tracking-wider border transition-colors text-center",
                  skin === s.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        {gender === "female" && (
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hair Length</div>
            <div className="flex flex-wrap gap-1">
              {hairLengths.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={cn(
                    "px-2 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                    length === l
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lighting */}
        <div className="border border-border bg-card p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Lighting</div>
          <div className="grid grid-cols-2 gap-1">
            {lightingOptions.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLighting(l.id)}
                className={cn(
                  "text-left px-2.5 py-2 border text-[9px] transition-colors",
                  lighting === l.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                )}
              >
                <div className="font-bold uppercase tracking-wider">{l.label}</div>
                <div className="opacity-60 mt-0.5">{l.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Tool */}
        <div className="border border-border bg-card p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">AI Image Generator</div>
          <div className="flex flex-wrap gap-1.5">
            {explorerTools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all",
                  tool === t.id
                    ? "border-primary bg-primary/10 text-primary theme-glow-box"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {explorerTools.find((t) => t.id === tool) && (
            <p className="text-[9px] text-muted-foreground">{explorerTools.find((t) => t.id === tool)!.note}</p>
          )}
        </div>

        {/* Prompt output */}
        {selected && (
          <div className="border border-primary/40 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPromptOpen((v) => !v)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold hover:text-primary/80"
              >
                {promptOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Generated Prompt
              </button>
              <button
                type="button"
                onClick={copyPrompt}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 border text-[9px] uppercase tracking-wider font-bold transition-all",
                  copied
                    ? "border-green-500 text-green-400 bg-green-500/10"
                    : "border-primary text-primary hover:bg-primary/10"
                )}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {promptOpen && (
              <textarea
                readOnly
                value={prompt}
                rows={10}
                className="w-full bg-background/50 border border-border px-3 py-2.5 text-[10px] text-foreground/80 resize-none focus:outline-none leading-relaxed font-mono"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR STUDIO TAB
═══════════════════════════════════════════════════════ */
function VendorStudio() {
  const { toast } = useToast();
  const hairFileInputRef = useRef<HTMLInputElement>(null);
  const modelFileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [modelDragActive, setModelDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [modelUploadError, setModelUploadError] = useState<string | null>(null);
  const [hairDesc, setHairDesc] = useState("");
  const [modelDesc, setModelDesc] = useState("");
  const [skin, setSkin] = useState("rich");
  const [length, setLength] = useState("Shoulder");
  const [lighting, setLighting] = useState("studio");
  const [tool, setTool] = useState("nano-banana");
  const [copied, setCopied] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const processHairFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a JPG, PNG, or WebP hair product image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Hair product image must be under 15MB.");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const processModelFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setModelUploadError("Please upload a JPG, PNG, or WebP female model image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setModelUploadError("Model reference image must be under 15MB.");
      return;
    }
    setModelUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => setModelPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processHairFile(file);
  }, [processHairFile]);

  const handleModelDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setModelDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processModelFile(file);
  }, [processModelFile]);

  const prompt = buildVendorPrompt(
    hairDesc,
    modelDesc,
    skin,
    length,
    lighting,
    tool,
    Boolean(imagePreview),
    Boolean(modelPreview)
  );
  const currentTool = vendorTools.find((t) => t.id === tool) ?? vendorTools[0];

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: "Prompt copied!", description: "Follow the platform instructions to use with your hair image." });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Vendor intro */}
      <div className="border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-foreground/80 leading-relaxed">
        <div className="flex items-start gap-3">
          <Star className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider mb-1">For Hair Vendors & Brands</p>
            <p className="text-[12px]">Upload a photo of hair you sell and optionally upload the female model you want to use. The prompt will tell the image model to use the hair image as the product reference and the model image as the preserved identity/body reference. Works with Nano Banana, Midjourney, Flux, Stable Diffusion, Firefly, and Runway.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        {/* LEFT: Upload + description */}
        <div className="space-y-4">
          {/* Hair product upload */}
          <div className="border border-border bg-card">
            <div className="border-b border-border bg-secondary/50 px-4 py-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold">
              <Upload className="w-3 h-3" />
              Hair Product Reference Image
            </div>
            <div className="p-4">
              {!imagePreview ? (
                <div
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => hairFileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 min-h-[260px]",
                    dragActive
                      ? "border-amber-400/60 bg-amber-400/5"
                      : "border-border hover:border-amber-400/40 hover:bg-amber-400/3"
                  )}
                >
                  <ImageIcon className={cn("w-12 h-12", dragActive ? "text-amber-400" : "text-muted-foreground/40")} />
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Upload your hair product photo</p>
                    <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP · The cleaner the product shot, the better</p>
                  </div>
                  <div className="text-[10px] text-amber-400 border border-amber-400/40 px-3 py-1.5">
                    or click to browse
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Hair product" className="w-full max-h-[400px] object-contain border border-border" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-card border border-border p-1.5 text-muted-foreground hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-green-400 border border-green-500/30 bg-green-500/5 px-3 py-2">
                    <Check className="w-3 h-3" />
                    Product image loaded — reference this image when using your chosen AI tool
                  </div>
                </div>
              )}
              {uploadError && (
                <div className="mt-3 flex items-start gap-2 text-[10px] text-destructive border border-destructive/40 bg-destructive/10 px-3 py-2">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  {uploadError}
                </div>
              )}
              <input ref={hairFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processHairFile(f); }} />
            </div>
          </div>

          <div className="border border-border bg-card">
            <div className="border-b border-border bg-secondary/50 px-4 py-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              <Upload className="w-3 h-3" />
              Female Model Reference Image
              <span className="text-[8px] border border-border px-1.5 py-0.5 text-muted-foreground">Optional</span>
            </div>
            <div className="p-4">
              {!modelPreview ? (
                <div
                  onDragEnter={() => setModelDragActive(true)}
                  onDragLeave={() => setModelDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleModelDrop}
                  onClick={() => modelFileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 min-h-[220px]",
                    modelDragActive
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-primary/3"
                  )}
                >
                  <ImageIcon className={cn("w-10 h-10", modelDragActive ? "text-primary" : "text-muted-foreground/40")} />
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Upload the female model photo</p>
                    <p className="text-[10px] text-muted-foreground">The prompt will preserve her face, pose, body, and identity</p>
                  </div>
                  <div className="text-[10px] text-primary border border-primary/40 px-3 py-1.5">
                    or click to browse
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={modelPreview} alt="Female model reference" className="w-full max-h-[360px] object-contain border border-border" />
                  <button
                    type="button"
                    onClick={() => setModelPreview(null)}
                    className="absolute top-2 right-2 bg-card border border-border p-1.5 text-muted-foreground hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-green-400 border border-green-500/30 bg-green-500/5 px-3 py-2">
                    <Check className="w-3 h-3" />
                    Model image loaded — prompt will preserve this female model and replace only the hair
                  </div>
                </div>
              )}
              {modelUploadError && (
                <div className="mt-3 flex items-start gap-2 text-[10px] text-destructive border border-destructive/40 bg-destructive/10 px-3 py-2">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  {modelUploadError}
                </div>
              )}
              <input ref={modelFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processModelFile(f); }} />
            </div>
          </div>

          {/* Hair description */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Describe Your Hair Product
            </div>
            <textarea
              value={hairDesc}
              onChange={(e) => setHairDesc(e.target.value)}
              placeholder="e.g. 30-inch bone straight Brazilian weave in natural black (1B), silky smooth with a high shine finish, no shedding..."
              rows={3}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary leading-relaxed"
            />
            <p className="text-[9px] text-muted-foreground">Include: length, texture, color, finish (matte/shine), and any unique features</p>
          </div>

          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Female Model Notes <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span>
            </div>
            <textarea
              value={modelDesc}
              onChange={(e) => setModelDesc(e.target.value)}
              placeholder="e.g. preserve the model's exact face and pose, keep the gold dress visible, shoulder-up crop, soft smile..."
              rows={3}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary leading-relaxed"
            />
            <p className="text-[9px] text-muted-foreground">If you upload a model image, these notes tell the image model what to preserve.</p>
          </div>

          {/* Pro tips */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Tips for Perfect Results</div>
            <ul className="space-y-2">
              {[
                "Use a clean white or neutral background product photo — no model wearing it yet",
                "Shoot the hair laid flat or on a mannequin head for best AI reference",
                "For lace frontals/closures, photograph them installed on a wig cap if possible",
                "Upload a female model reference when you want the AI to preserve a specific face, pose, or body",
                "The more accurate your hair description, the better the AI match",
                "Use the generated negative prompt to reduce floating wigs, bad lace, warped hairlines, and other glitches",
                "Midjourney image weight (--iw 2.0) gives the strongest hair reference",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground leading-relaxed">
                  <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Controls + output */}
        <div className="space-y-4">
          {/* Skin tone */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Model Skin Tone</div>
            <div className="text-[9px] text-amber-400/80 border border-amber-400/30 bg-amber-400/5 px-2 py-1 uppercase tracking-wider">
              Vendor Studio uses female models only
            </div>
            <div className="grid grid-cols-5 gap-1">
              {skinTones.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSkin(s.id)}
                  className={cn(
                    "py-2 text-[8px] uppercase tracking-wider border transition-colors",
                    skin === s.id
                      ? "border-amber-400 bg-amber-400/10 text-amber-400"
                      : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-400/40"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hair Length on Model</div>
            <div className="flex flex-wrap gap-1">
              {hairLengths.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={cn(
                    "px-2 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                    length === l
                      ? "border-amber-400 bg-amber-400/10 text-amber-400"
                      : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-400/40"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Lighting Style</div>
            <div className="grid grid-cols-2 gap-1">
              {lightingOptions.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLighting(l.id)}
                  className={cn(
                    "text-left px-2.5 py-2 border text-[9px] transition-colors",
                    lighting === l.id
                      ? "border-amber-400 bg-amber-400/10 text-amber-400"
                      : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-400/40"
                  )}
                >
                  <div className="font-bold uppercase tracking-wider">{l.label}</div>
                  <div className="opacity-60 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tool */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">AI Platform</div>
            <div className="flex flex-col gap-1.5">
              {vendorTools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTool(t.id)}
                  className={cn(
                    "text-left px-3 py-2 border text-[10px] font-bold uppercase tracking-wider transition-all",
                    tool === t.id
                      ? t.color + " theme-glow-box"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform instructions */}
          <div className="border border-border bg-card p-4 space-y-3">
            <button
              type="button"
              onClick={() => setInstructionsOpen((v) => !v)}
              className="w-full flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-bold hover:text-primary transition-colors"
            >
              <span>Platform Instructions — {currentTool.label}</span>
              {instructionsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {instructionsOpen && (
              <pre className="text-[9px] text-foreground/70 leading-relaxed whitespace-pre-wrap font-mono bg-secondary/40 p-3 border border-border">
                {currentTool.instructions}
              </pre>
            )}
          </div>

          {/* Prompt output */}
          <div className="border border-amber-400/40 bg-amber-400/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                Composite Prompt — {currentTool.label}
              </div>
              <button
                type="button"
                onClick={copyPrompt}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 border text-[9px] uppercase tracking-wider font-bold transition-all",
                  copied
                    ? "border-green-500 text-green-400 bg-green-500/10"
                    : "border-amber-400/60 text-amber-400 hover:bg-amber-400/10"
                )}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={prompt}
              rows={12}
              className="w-full bg-background/50 border border-border px-3 py-2.5 text-[10px] text-foreground/80 resize-none focus:outline-none leading-relaxed font-mono"
            />
            {!imagePreview && (
              <div className="flex items-start gap-2 text-[9px] text-amber-400/70">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                Upload your hair product image above, then use it as a reference image alongside this prompt in your chosen AI platform.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
