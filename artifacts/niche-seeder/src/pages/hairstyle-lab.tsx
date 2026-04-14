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
  { id: "fulani-braids", name: "Fulani Braids", category: "Braids", desc: "Center cornrow with loose braids + beads", tags: ["CULTURAL", "HOT"], visualDetail: "a central cornrow running down the middle of the scalp with loose box braids framing the face, thin gold ring beads and cowrie shells threaded on hanging braid ends, side cornrows swept back", technicalDetail: "combination of central parted cornrows and individual box braids, cowrie shell and gold ring adornment, traditional Fula/Peul-inspired pattern from West Africa" },
  { id: "stitch-braids", name: "Stitch Braids", category: "Braids", desc: "Cornrows with horizontal feed-in stitching effect", tags: ["VIRAL", "BOLD"], visualDetail: "cornrows with visible horizontal stitch-like parting lines feeding into the braid at regular intervals, creating a geometric ladder effect across the scalp", technicalDetail: "horizontal zigzag partings every half inch feeding into the main cornrow, requires feed-in synthetic hair, creates elevated horizontal lines visible against the scalp" },
  { id: "faux-locs", name: "Faux Locs", category: "Braids", desc: "Synthetic locs for the loc look without commitment", tags: ["POPULAR"], visualDetail: "locs that look naturally matted and textured, with a rough wrapping visible around each loc, freeform loose hairs at the root creating a natural loc appearance", technicalDetail: "crocheted synthetic loc extensions wrapped around braided base hair, twisted or wrapped method, varying thickness from thin to jumbo" },
  { id: "butterfly-locs", name: "Butterfly Locs", category: "Braids", desc: "Distressed boho locs with looped texture", tags: ["TRENDING", "VIRAL"], visualDetail: "short distressed locs with loops of hair visible on the surface of each loc, giving a boho messy textured appearance, loose wisps escaping the loc for a freeform bohemian look", technicalDetail: "crocheted or hand-looped synthetic hair wrapped loosely to create intentional distressed loops, shorter than regular faux locs, very textured" },
  { id: "goddess-locs", name: "Goddess Locs", category: "Braids", desc: "Faux locs with curly wavy ends", tags: ["GLAMOROUS"], visualDetail: "neat faux locs from root to mid-shaft that open into flowing curly or wavy ends, a mix of tight loc texture at top transitioning to loose ringlets or waves at the ends", technicalDetail: "loc extension with open curly or wet-and-wavy ends, braid wrapped tight at top and left loose at the bottom third, creating a dual-texture effect" },
  { id: "senegalese-twists", name: "Senegalese Twists", category: "Braids", desc: "Sleek two-strand twists with silky finish", tags: ["CULTURAL", "ELEGANT"], visualDetail: "long silky two-strand twists with a smooth, polished surface and slight natural sheen, each twist even in diameter from root to tapered end, hanging with gentle weight", technicalDetail: "kanekalon or silky synthetic hair twisted in two-strand method, very smooth outer surface unlike rough rope twists, traditional Senegalese style" },
  { id: "marley-twists", name: "Marley Twists", category: "Braids", desc: "Chunky textured twists with natural hair fiber", tags: ["NATURAL", "FULL"], visualDetail: "thick chunky two-strand twists with a natural coarse hair texture on the surface, large voluminous twists with a matte finish and natural-looking fibers", technicalDetail: "Marley hair or kinky fiber twisted in two-strand sections, very thick and full, natural-textured surface, no synthetic sheen" },
  { id: "havana-twists", name: "Havana Twists", category: "Braids", desc: "Jumbo chunky twists with a natural coil", tags: ["BOLD", "TRENDING"], visualDetail: "jumbo thick chunky Havana twists, larger in diameter than Marley twists, rich voluminous body with a slight natural coil or bend at the ends, full and dramatic look", technicalDetail: "Havana or Mambo hair in extra-large two-strand twist, wider at roots, very voluminous, popular for its big hair statement" },
  { id: "passion-twists", name: "Passion Twists", category: "Braids", desc: "Curly springy twists with wavy texture", tags: ["TRENDING", "VIRAL"], visualDetail: "long twists with a curly springy texture wrapping around each twist, the individual strand visible as a coiling texture giving depth and movement, bohemian and romantic look", technicalDetail: "water wave or curly crochet hair twisted around a two-strand base, spring-like coil texture, popular among younger demographics" },
  { id: "crochet-braids", name: "Crochet Braids", category: "Braids", desc: "Quick crochet hair installed through cornrows", tags: ["QUICK", "VERSATILE"], visualDetail: "full voluminous hair installed through cornrow tracks using crochet method, can be curly, wavy, or straight depending on hair type chosen, full and natural-looking result", technicalDetail: "cornrow base hidden beneath, hair looped through with latch hook tool, any hair texture possible from curly Afro to straight weave" },
  { id: "tribal-braids", name: "Tribal Braids", category: "Braids", desc: "Mixed cornrow + box braid pattern with accessories", tags: ["CULTURAL", "BOLD"], visualDetail: "cornrows styled in geometric or curved artistic patterns blending into individual braids with beads, gold rings, shells, and thread wrapped sections, artistic and statement-making", technicalDetail: "combination style mixing feed-in cornrows with individual braids, tribal adornments including beads, cowrie shells, metallic thread, cuffs" },
  { id: "knotless-jumbo", name: "Jumbo Knotless Braids", category: "Braids", desc: "Extra-thick knotless box braids for a bold statement", tags: ["BOLD", "TRENDING"], visualDetail: "extra-thick jumbo knotless box braids with smooth flat roots, each braid thick as a finger, hanging heavy with natural weight, dramatic volume and presence", technicalDetail: "wide box sections, jumbo kanekalon extensions blended seamlessly at root with no knot, fewer but much larger braids than standard knotless" },
  { id: "feed-in-cornrows", name: "Feed-In Cornrows Design", category: "Braids", desc: "Artistic cornrow patterns with geometric designs", tags: ["ARTISTIC", "VIRAL"], visualDetail: "precision cornrows styled in curved or geometric patterns across the scalp, artistic directional rows creating shapes like zigzags, curves, or swirls, with crisp clean lines", technicalDetail: "feed-in technique building braid thickness progressively, allows for intricate designed patterns impossible with traditional cornrows" },
  // PLAITING STYLES
  { id: "french-braid", name: "French Braid", category: "Plaits", desc: "Classic three-strand braid incorporating scalp hair", tags: ["CLASSIC", "ELEGANT"], visualDetail: "a sleek French braid starting at the crown and plaited down toward the nape, each crossover picking up new sections of scalp hair, the braid flat against the head with a neat visible pattern", technicalDetail: "three-strand plait with progressive addition of hair from scalp as the braid works downward, tight against the head, classic European plaiting technique" },
  { id: "dutch-braid", name: "Dutch Braid (Reverse French)", category: "Plaits", desc: "Inverted French braid that sits raised off the scalp", tags: ["TRENDING", "BOLD"], visualDetail: "a raised 3D Dutch braid sitting proud above the scalp, the plait appears as a raised ridge running back from forehead to nape, dimensional and defined", technicalDetail: "inverted French braid with strands crossed under rather than over, creates a raised 3D effect, used in cornrow alternatives and athletic styles" },
  { id: "fishtail-braid", name: "Fishtail Braid", category: "Plaits", desc: "Intricate V-pattern two-strand plait", tags: ["INTRICATE", "VIRAL"], visualDetail: "a long fishtail braid with tiny V-shaped sections alternating in a herringbone pattern, appearing very detailed and complex close-up with a woven lattice texture", technicalDetail: "two-section braid alternating small strands from each side, creates a woven V-shaped lattice pattern, more complex than three-strand" },
  { id: "crown-braid", name: "Crown Braid", category: "Plaits", desc: "Braids wrapped around the head like a halo", tags: ["ELEGANT", "BRIDAL"], visualDetail: "two braids plaited and pinned to wrap around the head forming a crown or halo effect, sitting like a braided headband or coronet, polished and regal", technicalDetail: "two Dutch or French braids starting at the nape, crossed and pinned across the crown, secured with bobby pins, formal updo style" },
  { id: "waterfall-braid", name: "Waterfall Braid", category: "Plaits", desc: "Flowing braid that lets sections fall loose", tags: ["ROMANTIC", "EDITORIAL"], visualDetail: "a cascading braid running horizontally at the side with flowing loose sections of hair falling through the braid like a waterfall, delicate and romantic", technicalDetail: "modified French braid where the bottom strand is dropped and replaced with a new section from above, creating a falling-through effect" },
  { id: "micro-braids", name: "Micro Braids", category: "Plaits", desc: "Hundreds of ultra-tiny individual braids", tags: ["DETAILED", "CLASSIC"], visualDetail: "hundreds of extremely thin tiny braids covering the entire head, so fine they move like hair itself, creating a full textured look with incredible detail close-up", technicalDetail: "very fine individual box sections, braided with lightweight synthetic hair, very time-intensive, the ends can be loose or sealed" },
  { id: "bubble-braids", name: "Bubble Braids", category: "Plaits", desc: "Ponytail sectioned with elastics for bubble effect", tags: ["VIRAL", "FUN"], visualDetail: "a ponytail or braid with evenly spaced hair ties creating puffy bubble sections along the length, like a chain of bubbles from root to tip, playful and fun", technicalDetail: "hair in a ponytail or braid, small elastics placed every 1-2 inches and the hair puffed out between each tie for the bubble effect" },
  // LOCS
  { id: "starter-locs", name: "Starter Locs", category: "Locs", desc: "Early-stage natural locs, freshly twisted", tags: ["NATURAL", "JOURNEY"], visualDetail: "neatly twisted small starter locs in the early budding phase, small uniformly sized twists that are beginning to loc, round at the ends, close to the scalp", technicalDetail: "palm-rolled or two-strand twisted sections at the beginning of the loc journey, typically 1-2 months old, uniform parting pattern" },
  { id: "mature-locs", name: "Mature Locs", category: "Locs", desc: "Fully formed locs with length and maturity", tags: ["NATURAL", "ICONIC"], visualDetail: "fully matured locs ranging from thin to medium thickness, each loc individually distinct with slight variation in texture, hanging with natural weight and movement, healthy sheen", technicalDetail: "locs aged 2+ years, passed the budding and teenage phases, fully locked and consolidated, cylindrical shape with closed ends, natural variation in size" },
  { id: "sisterlocks", name: "Sisterlocks", category: "Locs", desc: "Ultra-fine micro locs with a specific grid pattern", tags: ["ELEGANT", "PRECISE"], visualDetail: "hundreds of very fine thin locs no bigger than a pencil tip, densely packed across the scalp creating a full head of tiny uniform locs, extremely neat grid parting", technicalDetail: "proprietary Sisterlocks grid parting system, retightening every 4-6 weeks, uses a special tool, no product required, extremely fine uniform locs" },
  // NATURAL HAIR
  { id: "wash-n-go", name: "4C Wash & Go", category: "Natural", desc: "Defined coils on 4C natural hair", tags: ["NATURAL", "TRENDING"], visualDetail: "fully defined tight coil pattern on 4C natural hair, small tight springy coils perfectly defined all over the head, high shrinkage creating a halo of coils, healthy shine", technicalDetail: "4C coil pattern (very tight zig-zag), defined with leave-in conditioner and gel, refreshed with water spray, maximum shrinkage, very dense coil pattern" },
  { id: "twist-out", name: "Twist-Out", category: "Natural", desc: "Elongated defined coils from unraveled twists", tags: ["NATURAL", "CLASSIC"], visualDetail: "stretched defined coil pattern with elongated spiral curls from unraveled two-strand twists, fuller volume than a wash-n-go with less shrinkage, soft touchable coils", technicalDetail: "two-strand twists applied to damp hair, allowed to dry fully then unraveled in sections for defined elongated curls, stretched 20-30% beyond natural shrinkage" },
  { id: "natural-afro", name: "Natural Afro", category: "Natural", desc: "Round shaped full natural afro", tags: ["ICONIC", "BOLD"], visualDetail: "perfectly rounded full afro with an even spherical shape, dense natural 4C or 3C coils picked out into a wide halo around the head, symmetrical shape, rich natural texture", technicalDetail: "picked out and shaped with an afro pick, natural coil pattern, can be any curl type 3A-4C, shaped into perfect sphere or oval shape, moisturized for sheen" },
  { id: "bantu-knots", name: "Bantu Knots", category: "Natural", desc: "Spiral coiled knots pinned at the scalp", tags: ["CULTURAL", "BOLD"], visualDetail: "small perfectly coiled knots pinned flat against the scalp arranged in a neat geometric pattern, each knot a perfect tight spiral of hair wound and tucked, evenly distributed across the head", technicalDetail: "sections of hair twisted and wound tightly around itself against the scalp, secured by tucking the end under the coil, traditional Zulu-originated style" },
  { id: "high-puff", name: "High Natural Puff", category: "Natural", desc: "High ponytail puff with natural hair", tags: ["QUICK", "VIRAL"], visualDetail: "a large fluffy natural hair puff pulled high at the crown, the sides slicked down with edge control, natural coils forming a large round cloud at the top of the head", technicalDetail: "all hair gathered high at the crown with a silk scrunchie or band, edges laid with edge control gel, halo of natural coils or curls at the top" },
  { id: "perm-rod-set", name: "Perm Rod Set", category: "Natural", desc: "Tight bouncy spiral curls from perm rods", tags: ["DEFINED", "VIRAL"], visualDetail: "dense tight spiral ringlet curls from root to end, every curl a perfect corkscrew spiral, high volume with springy bounce, curls very defined and separate", technicalDetail: "perm rods applied to stretched or damp natural hair, allowed to dry completely before removing, creates very defined tight spiral curls throughout" },
  // ROUGH CURLS
  { id: "kinky-curly-weave", name: "Kinky Curly Weave", category: "Curly", desc: "Wild natural-looking kinky curly extensions", tags: ["NATURAL", "VOLUME"], visualDetail: "voluminous wild kinky curly weave with tight 3C-4A curls that spring outward in all directions, a full halo of textured curly hair with incredible density and movement", technicalDetail: "kinky curly or coily hair extensions sewn in or installed as wig, curl pattern matches natural 3C-4A hair, very high volume and density" },
  { id: "spiral-3c-curls", name: "3C Spiral Curls", category: "Curly", desc: "Loose to medium spiral ringlet curls", tags: ["NATURAL", "ROMANTIC"], visualDetail: "medium-tight spiral ringlet curls with good definition and separation, each curl a clear round corkscrew shape, shiny and bouncy with natural spring and movement", technicalDetail: "3C curl pattern: tighter than loose waves, looser than 4A coils, round barrel-shaped curls, defined with curl cream or flexi rods" },
  { id: "wet-wavy", name: "Wet & Wavy", category: "Curly", desc: "Wavy curly hair that transforms with water", tags: ["VERSATILE", "TRENDING"], visualDetail: "wet-looking wavy curly hair with a moist glossy finish, waves and curls defined and clumped together, appearing freshly wet with enviable shine and definition", technicalDetail: "wet-and-wavy hair texture, can be dried for straight look or activated with water for curly result, dual-texture versatility, installed as weave or wig" },
  { id: "curly-bob-wavy", name: "Curly Wavy Bob", category: "Curly", desc: "Bob length with big loose waves and curls", tags: ["CHIC", "TRENDING"], visualDetail: "a short to mid-length bob cut with large loose curl waves, the curls voluminous and bouncy creating a round full bob silhouette, romantic and effortless", technicalDetail: "bob length cut on curly or wavy extensions, 2B-3A curl pattern, natural movement within the bob shape" },
  { id: "rough-curl-afro", name: "Rough Curl Afro", category: "Curly", desc: "Wild freeform curly afro with natural texture", tags: ["BOLD", "FREEFORM"], visualDetail: "a wild freeform curly afro with natural unpredictable curl clumping and frizz, coils and curls of varying sizes creating an organic untamed halo, textured and unapologetically natural", technicalDetail: "freeform natural afro with no manipulation, natural coil clumping, intentional frizz, a mix of curl sizes from tight 4B coils to 3C spirals" },
  // STRAIGHT & SLEEK
  { id: "silk-press", name: "Silk Press", category: "Straight", desc: "Bone-straight flat-ironed natural hair with silk shine", tags: ["VIRAL", "GLAMOROUS"], visualDetail: "natural hair flat-ironed to a glass-like bone-straight finish with incredible reflective shine, hair swings and moves with every head movement, silky smooth surface with no frizz", technicalDetail: "blow-dried then flat-ironed section by section at 375-400°F on natural hair, uses silk press serum for heat protection and shine, swings with movement" },
  { id: "bone-straight", name: "Bone Straight Weave", category: "Straight", desc: "Ultra-sleek bone-straight weave or wig", tags: ["SLEEK", "POPULAR"], visualDetail: "ultra-pin-straight weave or wig laying flat with a mirror-like shine, every strand perfectly aligned and laying flat, high-gloss reflective sheen under light, clean middle or side part", technicalDetail: "bone-straight grade hair, usually Brazilian or Malaysian, high-grade remy hair, flat-iron finished, light-reflecting surface, no wave or curl" },
  // BOBS & CUTS
  { id: "blunt-bob", name: "Blunt Bob", category: "Bob", desc: "Sharp blunt-cut bob at jaw level", tags: ["TRENDING", "CHIC"], visualDetail: "a perfectly blunt-cut bob with a razor-sharp bottom line, hair cut straight across at jaw level with no layering, sleek and heavy looking, geometric precision", technicalDetail: "one-length cut with no graduation or layering, all hair cut to the same length with razor or sharp scissors for a blunt heavy look" },
  { id: "curly-bob", name: "Curly Bob", category: "Bob", desc: "Curly or coily bob with volume", tags: ["TRENDY", "FUN"], visualDetail: "a short bouncy bob with curly or coily texture, curls springing outward creating a rounded full silhouette, the bob shape visible beneath the curl volume", technicalDetail: "cut to bob length on naturally curly or textured hair, curls create volume that extends the visual length, can be done on 2C-4B curl types" },
  { id: "asymmetric-bob", name: "Asymmetric Bob", category: "Bob", desc: "Bob longer on one side, shorter on the other", tags: ["EDGY", "BOLD"], visualDetail: "a dramatic asymmetric bob with one side cut short at the ear and the other side sweeping down to jaw or collarbone length, strong angular silhouette", technicalDetail: "graduated cut with intentional length difference between sides, strong diagonal line, usually paired with a deep side part" },
  { id: "curtain-bang-waves", name: "Curtain Bangs + Waves", category: "Bob", desc: "Face-framing curtain bangs with loose waves", tags: ["TRENDING", "VIRAL"], visualDetail: "long loose wavy hair with center-parted curtain bangs that frame the face on both sides, the bangs brushing the cheekbones, waves flowing down from the bang line", technicalDetail: "curtain bangs cut to cheekbone length, parted center, blending into long layers with loose 2A-2C wave pattern, very popular 2020s style" },
  // UPDO & MODERN
  { id: "space-buns", name: "Space Buns", category: "Modern", desc: "Two high buns on either side of the head", tags: ["FUN", "VIRAL"], visualDetail: "two perfectly round buns sitting high and symmetrically on either side of the head, the center part clean between them, a playful and youthful look", technicalDetail: "hair divided into two equal sections, each pulled into a high ponytail and twisted into a bun, secured with pins and elastics" },
  { id: "y2k-updo", name: "Y2K Updo / Claw Clip Bun", category: "Modern", desc: "Messy Y2K claw clip updo", tags: ["TRENDING", "RETRO"], visualDetail: "a casually pinned messy updo using a claw clip or large decorative pin, hair loosely gathered and twisted up with face-framing tendrils falling down, effortlessly stylish", technicalDetail: "casual updo held by claw clip or large pin, intentional loose strands around the face, can be messy or sleek depending on preference, Y2K aesthetic" },
  // WEAVE & WIGS
  { id: "hd-lace-frontal", name: "HD Lace Frontal Wig", category: "Wigs", desc: "Undetectable lace frontal wig with natural hairline", tags: ["VIRAL", "LUXE"], visualDetail: "a HD lace frontal wig with an invisible lace hairline melting seamlessly into the skin, appearing completely natural with baby hairs laid and styled, the hair body smooth", technicalDetail: "HD Swiss lace 13x4 or 13x6 frontal, pre-bleached knots, pre-plucked hairline, installed with Got2B glue or tape" },
  { id: "body-wave", name: "Body Wave Weave", category: "Wigs", desc: "Soft loose S-wave pattern weave", tags: ["POPULAR", "NATURAL"], visualDetail: "soft gentle S-shaped waves flowing down the hair, not tight curls but not straight, a loose natural-looking wave pattern that moves with the head, glossy and soft", technicalDetail: "medium wave pattern, 2-3 inch wave definition, usually Brazilian or Peruvian body wave hair, 3-4 bundle weave installation" },
  { id: "deep-wave", name: "Deep Wave Wig", category: "Wigs", desc: "Deep defined corkscrew wave pattern", tags: ["LUXE", "FULL"], visualDetail: "tightly defined deep wave curls from root to end, each wave a deep consistent corkscrew wave, very voluminous and full, hair spiraling in tight consistent waves", technicalDetail: "tight consistent wave pattern approx 1-inch wave definition, usually installed as a full wig or weft sew-in, bundles stacked for volume" },
  // COLOR
  { id: "jet-black", name: "Jet Black", category: "Color", desc: "Richest true jet black with blue-black depth", tags: ["CLASSIC", "SLEEK"], visualDetail: "deep jet black hair with blue-black undertones, reflecting light with an almost iridescent depth, the darkest richest black possible, elegant and striking", technicalDetail: "color 1 (jet black), deepest black with cool blue undertones, reflective shine, works on all hair textures" },
  { id: "honey-blonde", name: "Honey Blonde", category: "Color", desc: "Rich warm honey blonde all-over color", tags: ["TRENDING", "WARM"], visualDetail: "rich warm honey blonde color throughout the hair, a mix of golden, amber, and caramel tones that look multi-dimensional in light, warmth against the skin tone", technicalDetail: "level 7-9 blonde with warm gold undertones, no ashy undertones, achieved with bleach + toner or pre-colored weave/wig" },
  { id: "platinum-blonde", name: "Platinum Blonde", category: "Color", desc: "Ice-white platinum blonde, ultra-pale", tags: ["BOLD", "EDITORIAL"], visualDetail: "ultra-pale almost white platinum blonde hair with a cool silver or icy undertone, extremely bright and light, high contrast against any skin tone, editorial and striking", technicalDetail: "level 10-11 lightest blonde, cool silver toner applied, maximum lift required, pre-bleached to level 9+ before toning" },
  { id: "ombre-black-honey", name: "Black to Honey Ombré", category: "Color", desc: "Natural roots fading to honey blonde ends", tags: ["VIRAL", "STUNNING"], visualDetail: "natural dark roots at the crown gradually transitioning to honey blonde or copper at the mid-shaft and ends, a seamless gradient of dark to light", technicalDetail: "balayage or ombre technique, hand-painted for natural graduation, color deposited at mid-lengths and ends only" },
  { id: "auburn-red", name: "Auburn Red", category: "Color", desc: "Rich warm auburn red-brown hair color", tags: ["CLASSIC", "WARM"], visualDetail: "deep rich auburn hair with reddish-brown tones, appearing deep brown indoors and vibrant red-copper in sunlight, warm and dimensional", technicalDetail: "level 4-6 red-brown, copper-red undertones, works naturally on all skin tones, warm spectrum color" },
  { id: "strawberry-blonde", name: "Strawberry Blonde", category: "Color", desc: "Warm peachy blonde with pink-red undertones", tags: ["ROMANTIC", "SOFT"], visualDetail: "warm golden blonde with subtle pink and strawberry tones running through it, soft and feminine color with a warm peachy glow", technicalDetail: "level 8-9 blonde with warm peachy-red undertones, achieved with gold-red toner over bleached hair" },
  { id: "burgundy", name: "Burgundy / Wine", category: "Color", desc: "Deep red-wine burgundy color", tags: ["HOT", "BOLD"], visualDetail: "deep rich burgundy-wine color throughout the hair, a dark red-purple tone that shows vibrancy in sunlight, appearing dark indoors and vibrant red-wine in direct light", technicalDetail: "level 3-4 red-violet, achieved with burgundy dye or pre-colored hair, looks dark in shade and shows red tones in sunlight" },
  { id: "chestnut-brown", name: "Chestnut Brown", category: "Color", desc: "Medium warm chestnut brown with golden depth", tags: ["NATURAL", "VERSATILE"], visualDetail: "medium warm chestnut brown with golden-red undertones catching in the light, multi-dimensional brown that looks rich and dimensional rather than flat", technicalDetail: "level 5-6 medium brown with warm golden-red undertones, natural-looking color with depth and dimension" },
  { id: "copper-rust", name: "Copper / Rust", category: "Color", desc: "Bold vibrant copper-orange hair", tags: ["BOLD", "HOT"], visualDetail: "vivid copper-orange hair with a metallic sheen, blazing warm orange-red tones that glow in sunlight, fiery and confident color statement", technicalDetail: "level 6-8 orange-copper, very warm spectrum, tends to be vibrant and eye-catching, can range from deep terracotta to bright copper" },
  { id: "icy-silver-blue", name: "Icy Silver / Steel Blue", category: "Color", desc: "Cool steel blue or icy silver tones", tags: ["EDITORIAL", "BOLD"], visualDetail: "cool icy silver or steel blue hair with a metallic sheen, almost reflective surface, ultra-modern and editorial color with a cool futuristic feel", technicalDetail: "level 10 platinum base with steel blue or silver-grey toner, cool undertones, very trendy editorial color" },
  { id: "pastel-lavender", name: "Pastel Lavender", category: "Color", desc: "Soft dreamy pastel purple-lavender", tags: ["SOFT", "VIRAL"], visualDetail: "soft dreamy lavender-purple hair with a pastel, almost fairy-like quality, delicate purple tones that appear almost pink-purple depending on light angle", technicalDetail: "level 9-10 blonde base with pastel lavender toner, semi-permanent dye, fades to lighter lavender gracefully" },
  { id: "chocolate-ombre", name: "Chocolate Brown Ombré", category: "Color", desc: "Dark roots fading to caramel-chocolate ends", tags: ["NATURAL", "POPULAR"], visualDetail: "rich dark brown roots gradually melting into lighter caramel and chocolate milk brown at the ends, a warm and natural-looking ombre transition", technicalDetail: "natural or dark brown roots, balayage from mid-shaft to ends lightened to caramel level 7-8, warm brown tones throughout" },
  { id: "pink-fantasy", name: "Fantasy Pink", category: "Color", desc: "Bold pastel to hot pink statement color", tags: ["BOLD", "VIRAL"], visualDetail: "bold vibrant pink hair ranging from pastel blush to hot neon pink, high-impact color that catches attention in any lighting, glowing in natural light", technicalDetail: "requires pre-lightening to level 10 platinum for pastel, level 8-9 for hot pink, semi-permanent or direct dye application" },
  { id: "forest-green", name: "Forest Green / Emerald", category: "Color", desc: "Deep jewel-toned green hair color", tags: ["BOLD", "EDITORIAL"], visualDetail: "deep rich jewel-toned green hair, ranging from forest green to emerald, an unexpected but striking color that complements deep skin tones beautifully", technicalDetail: "dark green direct dye over lightened base, deep jewel tones require level 8+ lift, can also be done as a teal-green blend" },
];

/* ═══════════════════════════════════════════════════════
   MALE HAIRSTYLE DATABASE
═══════════════════════════════════════════════════════ */
const maleStyles: HairStyle[] = [
  // FADES
  { id: "skin-fade", name: "Skin Fade", category: "Fade", desc: "Zero taper all the way to the skin", tags: ["CLASSIC", "SHARP"], visualDetail: "a bald/skin fade with the hair tapering completely to the skin at the sides and back, the fade line clean and sharp, a clear contrast between the skin and the hair on top", technicalDetail: "clipper fade from 0 (skin) blending up to natural length on top, using guards 0, 0.5, 1, 1.5 to create a seamless gradient" },
  { id: "low-fade", name: "Low Fade", category: "Fade", desc: "Fade starting just above the ear", tags: ["CLEAN", "VERSATILE"], visualDetail: "a low fade that begins just above the ear and nape, with the fade line sitting low on the sides, clean and subtle, most of the side hair maintained at natural length", technicalDetail: "fade begins 1-2 finger-widths above the ear, minimal fade with maximum hair retention, subtle and professional" },
  { id: "mid-fade", name: "Mid Fade", category: "Fade", desc: "Fade beginning at the temple level", tags: ["POPULAR", "BALANCED"], visualDetail: "fade beginning at mid-temple height, creating a clear contrast mid-way up the sides, balanced between the subtle low fade and dramatic high fade", technicalDetail: "fade begins at the temple level, around 2-3 inches above the ear, most versatile and commonly requested fade height" },
  { id: "burst-fade", name: "Burst Fade Mohawk", category: "Fade", desc: "Curved burst fade creating a mohawk silhouette", tags: ["VIRAL", "BOLD"], visualDetail: "a burst fade curving around the ear in a semi-circular arc, the fade radiating outward like a sunburst from behind the ear, leaving a strip of hair on top like a mohawk", technicalDetail: "curved fade line sweeping behind the ear in a crescent shape, requires precise clipper work to maintain the curve" },
  { id: "temple-fade", name: "Temple Fade (808)", category: "Fade", desc: "Tight fade at the temples only", tags: ["CLEAN", "FRESH"], visualDetail: "fade concentrated at the temples and sideburn area only, cleaning up the hairline dramatically at the temple, the rest of the sides left full, sharp temple definition", technicalDetail: "also called 808 or Brooklyn fade, fade only at temple corners, very conservative and professional" },
  { id: "drop-fade", name: "Drop Fade", category: "Fade", desc: "Fade that drops behind the ear", tags: ["MODERN", "SHARP"], visualDetail: "a fade line that drops down behind the ear instead of going straight across, the back section lower than the sides, creating a curved arc drop effect", technicalDetail: "the taper line curves downward behind the ear toward the nape, creates a curved silhouette from the front" },
  { id: "edgar-cut", name: "Edgar Cut", category: "Fade", desc: "Blunt fringe top with tight fade sides", tags: ["VIRAL", "TRENDING"], visualDetail: "a blunt horizontal fringe cut straight across the forehead with tight faded sides and back, the top hair flat and the forehead line sharp and squared", technicalDetail: "flat horizontal fringe (flattop line at forehead), high fade on sides, very popular in Latino and urban communities" },
  { id: "french-crop-fade", name: "French Crop Taper", category: "Fade", desc: "Short textured crop with tapered sides", tags: ["CLEAN", "MODERN"], visualDetail: "a short textured crop on top with a low taper or fade on the sides, the fringe slightly pushed forward or textured, a European-influenced clean cut", technicalDetail: "short textured top with scissor or clipper work, disconnected or blended sides, low fade taper, very popular in European and global barbershops" },
  { id: "lineup-shape-up", name: "Line Up / Shape Up", category: "Fade", desc: "Razor-sharp geometric hairline carving", tags: ["ESSENTIAL", "SHARP"], visualDetail: "a razor-sharp straight or squared hairline carved precisely at the forehead, temples, and sideburns, creating clean geometric angles that define the face, crisp and professional", technicalDetail: "used as an add-on or standalone, a straight or slightly curved razor-clean hairline at the front and sides, signature barbershop finishing technique" },
  { id: "bald-fade-design", name: "Bald Fade + Hair Design", category: "Fade", desc: "Skin fade with artistic shaved designs", tags: ["ARTISTIC", "BOLD"], visualDetail: "a skin fade with geometric or custom shaved designs carved into the hair at the sides or back, patterns may include lines, curves, stars, or custom motifs against the faded skin", technicalDetail: "bald fade as base, designs created with razor or clipper outliner, highly skilled barbering technique, intricate geometric or custom art" },
  { id: "blowout-fade", name: "Blowout Fade", category: "Fade", desc: "Curly blow-dried top with sharp fade sides", tags: ["BOLD", "URBAN"], visualDetail: "naturally curly or coily hair blow-dried outward on top creating a large rounded afro-style shape, combined with a very tight skin fade on the sides for dramatic contrast", technicalDetail: "natural curls blow-dried with a pick for maximum volume on top, extreme contrast with skin-faded sides, very high-contrast statement cut" },
  // WAVES
  { id: "360-waves", name: "360 Waves", category: "Waves", desc: "Deep spinning wave pattern around the entire head", tags: ["ICONIC", "VIRAL"], visualDetail: "360-degree deep wave pattern spinning from the crown outward in all directions, deep rippling waves covering the full head, a consistent dark-light-dark ripple visible in motion or caught in light", technicalDetail: "achieved through daily wolfing (not cutting), consistent rotational brushing with soft and hard brushes, du-rag compression, moisturizer and pomade" },
  { id: "540-waves", name: "540 Waves", category: "Waves", desc: "Waves covering top and connecting to back", tags: ["ELITE", "RARE"], visualDetail: "extreme wave pattern covering 540 degrees, the full crown plus sides and back connected seamlessly, deep consistent wave depth throughout, every angle showing rippling wave patterns", technicalDetail: "advanced level beyond 360, requires growing hair longer, connecting wave patterns from front to sides to back" },
  // LOCS
  { id: "male-starter-locs", name: "Starter Locs", category: "Locs", desc: "Early stage locs on male hair", tags: ["JOURNEY", "NATURAL"], visualDetail: "freshly twisted starter locs on short to medium male hair, small uniform coils beginning to loc, clean parts between sections, young loc journey look", technicalDetail: "palm rolled or comb-coiled starter locs, uniform size, early budding stage, some shine from water or oil moisture" },
  { id: "mature-male-locs", name: "Mature Locs with Fade", category: "Locs", desc: "Long mature locs paired with a skin fade", tags: ["TRENDING", "VIRAL"], visualDetail: "long mature thick locs on top combined with a tight skin or mid-fade on the sides and back, dramatic contrast between the loc length on top and clean fade below", technicalDetail: "undercut or fade applied to locs, locs grouped or loose on top, sides clean-faded, modern loc style popular with athletes and artists" },
  { id: "loc-mohawk", name: "Loc Mohawk / Frohawk", category: "Locs", desc: "Locs styled into a mohawk shape", tags: ["BOLD", "EDITORIAL"], visualDetail: "locs gathered and secured into a tall central mohawk or frohawk ridge from front to back, the sides either faded or twisted flat, locs standing and falling in the center strip", technicalDetail: "locs pinned or banded into a central strip running crown to nape, can have faded sides, locs falling forward or back from the ridge" },
  { id: "freeform-locs", name: "Freeform Locs", category: "Locs", desc: "Naturally coalesced freeform locs, unmanipulated", tags: ["NATURAL", "ARTISTIC"], visualDetail: "organically formed freeform locs that vary in thickness and shape, some loc sections merging naturally, no uniform size, wild and natural with an authentic organic appearance", technicalDetail: "no maintenance or manipulation, hair allowed to loc naturally into itself, varying diameters, unique to each individual, no retightening or uniformity" },
  // BRAIDS
  { id: "male-cornrows", name: "Cornrow Braids", category: "Braids", desc: "Straight-back or designed cornrows on male hair", tags: ["CLASSIC", "CULTURAL"], visualDetail: "neat straight-back cornrows on male hair running front to back, clean side parts, scalp visible between rows, fresh and neat appearance with sharp lines", technicalDetail: "underhand plaiting on male hair, usually 4-8 rows depending on head size, often paired with a fade on the sides" },
  { id: "male-box-braids", name: "Box Braids Male", category: "Braids", desc: "Individual box braids on male hair", tags: ["BOLD", "TRENDING"], visualDetail: "short to medium individual box braids on male hair, usually shoulder length or shorter, braids hanging freely all over the head, can have a low fade underneath", technicalDetail: "individual box-sectioned braids on male hair, can be done with or without extensions, popular in hip-hop and athletic communities" },
  { id: "male-fulani-braids", name: "Fulani Braids Male", category: "Braids", desc: "West African-inspired cornrows with beads on male hair", tags: ["CULTURAL", "BOLD"], visualDetail: "designed cornrows on male hair in the Fulani style with geometric patterns, gold ring beads and cowrie shell adornments threaded onto braids, cultural and distinctive", technicalDetail: "Fula-inspired pattern with central or parted cornrows, adornments including gold cuffs, cowrie shells, beads, traditional West African cultural style" },
  { id: "zig-zag-cornrows", name: "Zig-Zag Part Cornrows", category: "Braids", desc: "Cornrows with precision zig-zag part designs", tags: ["ARTISTIC", "VIRAL"], visualDetail: "cornrows with a precision zig-zag or lightning bolt shaped part carved between rows, the geometric parting pattern visible against the scalp creating a strong visual design", technicalDetail: "razor-carved geometric parts in zig-zag or angular patterns between cornrow tracks, requires skilled barber with razor precision" },
  { id: "braided-man-bun", name: "Braided Man Bun", category: "Braids", desc: "Long braids pulled into a top knot bun", tags: ["MODERN", "BOLD"], visualDetail: "long individual box braids or cornrows pulled up and secured into a high bun or top knot, the braids gathered and knotted at the crown, undercut or fade visible below", technicalDetail: "long braids or locs pulled into a high bun, sides may be faded or tapered, a modern groomed look popular in creative and athletic communities" },
  // AFRO & NATURAL
  { id: "shaped-afro", name: "Shaped Afro", category: "Natural", desc: "Natural afro with a precise geometric shape", tags: ["ICONIC", "BOLD"], visualDetail: "a precisely shaped natural afro with clean, geometric edges picked out into a perfect sphere or flat-top rectangle, sharp line-up on the edges, confident and bold", technicalDetail: "natural hair picked out with an afro pick, edges lined up with clippers, can be rounded, square, or angled top shape" },
  { id: "frohawk", name: "Frohawk", category: "Natural", desc: "Afro styled into a mohawk ridge", tags: ["EDGY", "CREATIVE"], visualDetail: "natural afro hair gathered into a central mohawk strip from forehead to nape, sides either faded or twisted flat against the head, natural coils forming a tall center ridge", technicalDetail: "sides twisted, braided, or faded down, center natural hair combed upward into a ridge, strong styling product to hold" },
  { id: "high-top-fade", name: "High-Top Fade", category: "Natural", desc: "Flat-top natural hair with sides faded", tags: ["RETRO", "ICONIC"], visualDetail: "a flat-top box shape on natural hair, the top section of hair grown out and shaped flat and level creating a square plateau, sides and back faded cleanly below", technicalDetail: "natural hair grown on top and shaped with a level comb-cut into a flat horizontal plane, sides faded or tapered, iconic 80s/90s style" },
  { id: "buzz-cut", name: "Buzz Cut", category: "Natural", desc: "Ultra-short all-over clipper cut", tags: ["CLEAN", "MINIMAL"], visualDetail: "an all-over clipper cut at a uniform short length, hair extremely close to the head showing the scalp shape clearly, clean and minimal, every part of the head at the same height", technicalDetail: "all-over clipper with a single guard size, usually 1-3, very simple and clean, shows head shape clearly" },
  { id: "zulu-knots-male", name: "Zulu Knots (Male)", category: "Natural", desc: "Traditional Zulu coil knots on male hair", tags: ["CULTURAL", "BOLD"], visualDetail: "small coiled knots wound against the scalp in geometric sections on male hair, arranged in neat rows or patterns, a striking cultural look with deep roots in Zulu tradition", technicalDetail: "hair sectioned, each section wound tightly into a coil knot against the scalp, secured at the end, from South African Zulu culture" },
  // CURLY & TEXTURED
  { id: "curly-top-fade", name: "Curly Top Fade", category: "Curly", desc: "Natural curls on top with a fade", tags: ["POPULAR", "FRESH"], visualDetail: "natural curly or wavy hair left full on top with loose defined curls, the sides and back faded cleanly, curls bouncing naturally on top creating volume", technicalDetail: "fade on sides and back, natural curl pattern (2C-3C) left natural on top, often with a deep side part or French crop taper" },
  { id: "taper-fade-curls", name: "Taper + Defined Curls", category: "Curly", desc: "Tapered sides with defined curl product on top", tags: ["CLEAN", "MODERN"], visualDetail: "a classic taper on the sides fading to the skin, natural curls on top defined with product creating shiny defined coils or waves, contrast between faded sides and textured top", technicalDetail: "standard taper on sides, curl cream or twisting cream applied on top to define natural curl pattern, 2C-4A curl types" },
  { id: "messy-curly-afro", name: "Messy Curly Afro", category: "Curly", desc: "Undone wild curly afro with natural texture", tags: ["NATURAL", "BOLD"], visualDetail: "a full, untamed curly afro with natural coils and curls in various states of definition, a lived-in organic texture with visible curl clumping and natural frizz halo", technicalDetail: "natural or lightly stretched curly afro, no heavy product, intentional undone look, curl types 3B-4B mixing naturally" },
  { id: "curly-mullet-fade", name: "Curly Mullet Fade", category: "Curly", desc: "Short curly top fading into a longer curly back", tags: ["BOLD", "TRENDING"], visualDetail: "faded short sides and a short-to-medium curly top that transitions into longer curly hair at the back, a modern textured mullet with curl-textured layers", technicalDetail: "high skin fade on sides, short curly top that grows longer toward the nape and back, a modern textured take on the mullet" },
  { id: "loose-curl-taper", name: "Loose Curl Taper", category: "Curly", desc: "Medium loose curls on top with tapered sides", tags: ["CLEAN", "VERSATILE"], visualDetail: "medium-length loose curl or wave pattern on top of a tapered cut, the curls defined and natural-looking, the sides clean and tapered, a balanced and versatile look", technicalDetail: "taper or low fade on sides, 2C-3B curl pattern on top defined with curl cream, medium length on top for curl visibility" },
  { id: "textured-twists-male", name: "Textured Twists (Male)", category: "Curly", desc: "Two-strand twists on natural male hair", tags: ["NATURAL", "TRENDING"], visualDetail: "two-strand twists on short to medium male natural hair, the twists defined and neat close to the scalp opening into coiled ends, natural textured look with definition", technicalDetail: "two-strand twists on natural 3C-4C hair, short to medium length, can be worn as is or used as a twist-out prep" },
];

/* ═══════════════════════════════════════════════════════
   AI TOOLS FOR STYLE EXPLORER
═══════════════════════════════════════════════════════ */
const explorerTools = [
  { id: "midjourney", label: "Midjourney", note: "Append --v 7 --ar 4:5 --style raw to the end of your prompt in Discord" },
  { id: "nano-banana", label: "Nano Banana", note: "Upload a reference photo alongside this prompt. Tell it to preserve face and identity" },
  { id: "flux", label: "Flux Pro", note: "Use on fal.ai or Replicate — best photorealism for hair texture" },
  { id: "dalle3", label: "DALL-E 3", note: "Paste into ChatGPT or OpenAI API — no parameter flags needed" },
  { id: "firefly", label: "Adobe Firefly", note: "Use the Generative Fill tool for best results on existing images" },
  { id: "leonardoai", label: "Leonardo.AI", note: "Select Phoenix or Kino XL model for hyperdetailed photorealism" },
  { id: "stable-diffusion", label: "Stable Diffusion", note: "Use SDXL with ControlNet Reference-Only for best hair replication" },
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
1. Upload REFERENCE 1: your hair product photo
2. Upload REFERENCE 2: your face reference photo (if using one)
3. Paste the complete prompt below — it already contains priority-ordered instructions
4. Tell Nano Banana: "Reference 1 is the hair product. Reference 2 is the face — do not change it."
5. If face identity drifts: regenerate and add "keep face identical to reference 2, no changes"
6. If hairline looks fake: add "seamless hairline, natural irregularity, no visible lace"
7. Try 3–5 generations — strict realism requires multiple attempts`,
  },
  {
    id: "midjourney",
    label: "Midjourney",
    color: "text-blue-400 border-blue-500/40 bg-blue-500/5",
    instructions: `HOW TO USE IN MIDJOURNEY:
1. Upload your HAIR PRODUCT photo to Discord → right-click → Copy Link
2. Upload your FACE REFERENCE photo (if using) → right-click → Copy Link
3. Start your /imagine with: [face-url] [hair-url] [full prompt below]
4. Face URL must come FIRST — Midjourney reads images left-to-right by weight
5. Add --iw 2.0 to lock the hair reference strongly
6. Add --cref [face-url] if you want character reference locking for the face
7. The prompt already ends with --v 7 --ar 4:5 parameters`,
  },
  {
    id: "flux",
    label: "Flux Pro",
    color: "text-purple-400 border-purple-500/40 bg-purple-500/5",
    instructions: `HOW TO USE WITH FLUX PRO:
1. Go to fal.ai, Replicate, or ComfyUI with Flux Pro loaded
2. Upload HAIR PRODUCT photo as IP-Adapter or Style Reference (weight 0.8–1.0)
3. Upload FACE REFERENCE photo as a second IP-Adapter or ControlNet (FaceID or InstantID)
4. FaceID/InstantID weight: 0.9–1.0 to prevent identity drift
5. Paste the full prompt below — priority order is built in
6. Steps: 30–40, guidance scale 7.0 for realism
7. Generate 3–5 variations — strict realism requires multiple passes`,
  },
  {
    id: "dalle3",
    label: "DALL-E 3",
    color: "text-green-400 border-green-500/40 bg-green-500/5",
    instructions: `HOW TO USE IN DALL-E 3 / CHATGPT:
1. Open ChatGPT (GPT-4o) or the OpenAI API playground
2. Tell ChatGPT: "Generate an image using this exact prompt:"
3. Paste the full prompt below
4. For best hair accuracy: also describe the hair product verbally in your chat message before the prompt
5. DALL-E 3 has no image reference upload — use the text prompt to guide everything
6. Request: "4:5 portrait format, ultra-photorealistic, editorial quality"`,
  },
  {
    id: "firefly",
    label: "Adobe Firefly",
    color: "text-orange-400 border-orange-500/40 bg-orange-500/5",
    instructions: `HOW TO USE IN ADOBE FIREFLY (Generative Fill):
1. Go to firefly.adobe.com → Generate Image with the full prompt
2. Once the base model image is generated, open in Photoshop
3. Use Generative Fill: select ONLY the hair area with lasso tool
4. Upload your hair product image as "Style Reference"
5. Type a short fill prompt like "wearing [hair style] matching reference" in the fill box
6. Generate 4 variations and choose the best composite`,
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
  { id: "light", label: "Light", desc: "fair, porcelain, light beige skin tone with cool or neutral undertones", vendorDesc: "a professional female model with fair, porcelain light beige skin, cool neutral undertones, soft light eyes, natural makeup" },
  { id: "medium", label: "Medium", desc: "medium olive, tan, honey-brown skin tone with warm or neutral undertones", vendorDesc: "a professional female model with medium olive tan skin, warm honey-brown undertones, naturally defined features, light editorial makeup" },
  { id: "rich", label: "Rich Brown", desc: "rich warm brown skin tone, medium-deep with warm golden undertones", vendorDesc: "a professional female model with rich warm brown skin, golden-brown medium-deep undertones, high cheekbones, a natural polished editorial look" },
  { id: "deep", label: "Deep", desc: "deep melanin-rich dark brown skin tone with warm or neutral undertones", vendorDesc: "a professional female model with deep melanin-rich dark brown skin, warm undertones, strong defined facial structure, editorial beauty finish" },
  { id: "ebony", label: "Ebony", desc: "deep ebony very dark skin with blue-black undertones and high-contrast features", vendorDesc: "a professional female model with deep ebony very dark skin, blue-black undertones, strikingly defined features, high-contrast editorial beauty presentation" },
];

/* ═══════════════════════════════════════════════════════
   HAIR LENGTHS
═══════════════════════════════════════════════════════ */
const hairLengths = ["Pixie Short", "Ear Length", "Chin / Bob", "Shoulder", "Collarbone", "Chest", "Waist", "Hip Length", "Knee Length"];

/* ═══════════════════════════════════════════════════════
   LIGHTING SETTINGS
═══════════════════════════════════════════════════════ */
const lightingOptions = [
  { id: "studio", label: "Studio Light", desc: "clean white studio, soft box lighting from both sides with balanced fill" },
  { id: "golden", label: "Golden Hour", desc: "warm amber sunset backlight with soft golden fill, rim-lit edges" },
  { id: "dramatic", label: "Dramatic", desc: "Rembrandt shadow lighting, high contrast, one strong side key light" },
  { id: "natural", label: "Natural Window", desc: "soft natural daylight from the side window, cool and clean" },
  { id: "neon", label: "Neon Glow", desc: "colorful neon ambient light wash, atmospheric and editorial" },
  { id: "editorial", label: "Editorial", desc: "high-fashion magazine lighting, soft directional key with rim light on hair edges" },
];

/* ═══════════════════════════════════════════════════════
   PROMPT BUILDERS
═══════════════════════════════════════════════════════ */

/* Per-engine rendering directives that actually change the prompt output */
const engineDirectives: Record<string, {
  prefix: string;
  technicalAdditions: string;
  suffix: string;
}> = {
  midjourney: {
    prefix: "Photorealistic photography prompt for Midjourney v7:",
    technicalAdditions: "rendered in Midjourney v7 photorealistic mode, no illustration, no painting, straight photography output",
    suffix: "--v 7 --ar 4:5 --style raw --q 2",
  },
  "nano-banana": {
    prefix: "Nano Banana image generation prompt — preserve face and identity:",
    technicalAdditions: "Nano Banana photorealistic engine, face-preserving identity-locked output, reference-guided hair rendering, no face morphing",
    suffix: "NANO BANANA: preserve subject identity exactly, realistic hair texture output, high-resolution photorealistic result",
  },
  flux: {
    prefix: "Flux Pro photorealistic generation prompt:",
    technicalAdditions: "Flux Pro hyperdetailed photorealism, each hair strand individually rendered, HDR tonal range, Flux Pro sampling excellence",
    suffix: "Flux Pro quality: hyperdetailed, 8K resolution, ultra-sharp strand definition, photographic accuracy",
  },
  dalle3: {
    prefix: "DALL-E 3 photorealistic image prompt:",
    technicalAdditions: "DALL-E 3 photorealistic photography style, high-fidelity portrait, professional commercial photography output, no illustration",
    suffix: "photorealistic portrait photography, 4:5 format, ultra-detailed hair, professional editorial quality — DALL-E 3",
  },
  firefly: {
    prefix: "Adobe Firefly photorealistic prompt:",
    technicalAdditions: "Adobe Firefly Generative AI photorealistic rendering, Firefly photorealistic content type, commercial quality output",
    suffix: "Adobe Firefly: photorealistic content type, editorial beauty photography, high-detail hair texture, commercial quality",
  },
  leonardoai: {
    prefix: "Leonardo.AI Phoenix model photorealistic prompt:",
    technicalAdditions: "Leonardo Phoenix engine photorealism, Kino XL hyperdetail, photorealistic preset, high-fidelity portrait rendering",
    suffix: "Leonardo Phoenix / Kino XL: photorealistic preset, ultra-detailed, 8K portrait output, sharp hair and skin fidelity",
  },
  "stable-diffusion": {
    prefix: "Stable Diffusion SDXL photorealistic prompt:",
    technicalAdditions: "SDXL photorealistic, RAW photo style, masterpiece quality, (photorealistic:1.4), (hyperdetailed:1.2), best quality, ultra-sharp",
    suffix: "RAW photo, (photorealistic:1.4), SDXL, masterpiece, (hyperdetailed hair:1.3), sharp focus, 8K — use ControlNet Reference-Only at 0.8 weight with your hair reference image",
  },
};

function buildExplorerPrompt(
  style: HairStyle,
  gender: Gender,
  skin: string,
  length: string,
  lighting: string,
  subject: string,
  toolId: string
): string {
  const skinToneObj = skinTones.find((s) => s.id === skin);
  const skinDesc = skinToneObj?.desc ?? skin;
  const light = lightingOptions.find((l) => l.id === lighting);
  const lightLabel = light?.label ?? lighting;
  const lightDesc = light?.desc ?? lighting;
  const engine = engineDirectives[toolId] ?? engineDirectives["flux"];
  const genderWord = gender === "female" ? "woman" : "man";
  const pronounWord = gender === "female" ? "her" : "his";
  const displayLength = gender === "female" ? length : "natural length appropriate for this male style";
  const subjectExtra = subject.trim() ? ` ${subject.trim()}.` : "";

  return `${engine.prefix}

IDENTITY PRESERVATION: Preserve the subject's identity with very high accuracy (90–100% likeness). Maintain key facial structure, expression, skin tone, pose, and overall likeness. No facial distortion, no identity drift, no over-smoothing.

SUBJECT: A ${genderWord} with ${skinDesc}.${subjectExtra} Authentic skin texture — natural pores and micro-detail retained for realism. Subtle subsurface scattering (SSS) so skin appears soft, dimensional, and lifelike, not plastic or overly retouched.

HAIRSTYLE (Hero Focus): ${style.name} — ${style.visualDetail}. Hair length: ${displayLength}. ${style.technicalDetail}. Hairline must look completely natural and authentic — no synthetic or wig-like appearance. No artificial enhancements or digital artifacts on the hair.

COMPOSITION: Head-and-shoulders portrait, eye-level angle, centered framing. Professional hairstyle photography composition where the hair is the primary subject. Shallow depth of field with soft background blur to isolate the subject beautifully.

LIGHTING: ${lightLabel} — ${lightDesc}. Soft directional key light with balanced fill. Subtle rim lighting to define the edges of the hair and jawline. Lighting specifically chosen to reveal the hair's texture, movement, and depth.

SKIN RENDERING: Natural light diffusion across cheeks, nose, and ears with realistic SSS behavior. Maintain natural pores and micro-texture while keeping a polished editorial finish. Skin appears soft, dimensional, alive — not plastic, not overly retouched.

BACKGROUND: Clean, minimal, studio-style or softly blurred environment that complements the hair and skin tone. No distractions. Neutral or slightly warm tones preferred.

COLOR GRADING: Balanced, true-to-life tones with slight warmth. Rich, accurate rendering of the skin tone. Moderate contrast with clean highlights and natural shadows.

TECHNICAL: ${engine.technicalAdditions}. Ultra-sharp focus on hair texture and definition — every strand and detail clearly visible. High-resolution output, crisp edges, no noise, no artifacts. Professional editorial quality.

OUTPUT FORMAT: 4:5 or 9:16 aspect ratio, optimized for Instagram/TikTok.

NEGATIVE CONSTRAINTS: No wigs, no synthetic-looking hair, no artificial hairline, no blur on ${pronounWord} face, no over-smoothing, no plastic skin, no exaggerated features, no identity drift, no extra limbs, no low-detail rendering, no watermarks, no artifacts.

${engine.suffix}`;
}

function buildVendorPrompt(
  hairDesc: string,
  skinToneId: string,
  length: string,
  lighting: string,
  toolId: string,
  hasHairReference: boolean,
  hasFaceReference: boolean,
  gender: "female" | "male"
): string {
  const skinToneObj = skinTones.find((s) => s.id === skinToneId);
  const skinDesc = skinToneObj?.desc ?? skinToneId;
  const modelDesc = skinToneObj?.vendorDesc ?? `a professional ${gender} model with ${skinDesc}`;
  const light = lightingOptions.find((l) => l.id === lighting);
  const lightLabel = light?.label ?? lighting;
  const lightDesc = light?.desc ?? lighting;
  const toolName = vendorTools.find((t) => t.id === toolId)?.label ?? toolId;
  const engine = engineDirectives[toolId] ?? engineDirectives["nano-banana"];
  const genderWord = gender === "female" ? "female" : "male";

  const faceSection = hasFaceReference
    ? `PRIORITY 1 — FACE REFERENCE (DO NOT CHANGE):
Use the uploaded face reference image.
Preserve the subject's identity with 95–100% exact likeness.
Do not alter facial structure, skin tone, proportions, or expression.
No beautification, no symmetry correction, no feature enhancement.
The face must be indistinguishable from the reference at completion.`
    : `PRIORITY 1 — SUBJECT:
Create ${modelDesc}.
Professional ${genderWord} beauty model, natural composed expression, light or no makeup.
No distracting accessories. Identity is consistent and believable throughout.`;

  const hairSection = hasHairReference
    ? `PRIORITY 2 — HAIR PRODUCT REFERENCE (EXACT MATCH REQUIRED):
Use the uploaded hair product image as the sole source of truth for:
- Color: match exactly, no reinterpretation
- Texture: replicate the exact surface quality (straight, wavy, curly, coily, etc.)
- Density: match bundle fullness and volume as shown
- Curl/wave pattern: reproduce precisely at ${length} length
- Finish: natural shine level only — not glossy, not plastic
No enhancement, no idealization. The hair must look like the exact product the customer will receive.`
    : `PRIORITY 2 — HAIR PRODUCT (FROM DESCRIPTION):
${hairDesc || "Hair product as described — follow the written details exactly."}
Length: ${length}.
Reproduce the described texture, color, density, and pattern faithfully.
No enhancement, no reinterpretation. Natural finish — not glossy, not plastic.`;

  return `MODE: Photorealistic hair product render (strict realism) — ${toolName}

${faceSection}

${hairSection}

PRIORITY 3 — INSTALLATION REALISM:
The hair must appear naturally installed on the model's head:
- Seamless hairline with no visible lace, glue, wig cap, or synthetic edge
- Slight natural irregularity at the hairline (not a perfect computer-generated line)
- Correct temple and sideburn transition — hair tapers naturally into the skin
- Hair follows the shape of the skull and responds to gravity at ${length} length
- Individual strands at the perimeter blend into the scalp organically
- No floating edges, no gap between hair and skin, no warped scalp

COMPOSITION:
Head-and-shoulders portrait, eye-level angle, centered framing.
The hair is the primary subject of the image.
Shallow depth of field — soft background blur isolates the subject cleanly.

LIGHTING: ${lightLabel} — ${lightDesc}.
Soft, balanced studio exposure with no harsh shadows.
Hair shine must appear natural — soft highlight, not wet or plastic gloss.
Lighting reveals hair texture, movement, and density without overexposing.

SKIN:
Natural skin texture with subtle SSS (subsurface scattering).
No plastic smoothing, no over-retouching, no artificial skin softening.
Pores and micro-texture retained for photographic realism.

BACKGROUND:
Clean, neutral, softly blurred studio background.
No distractions. Complements the hair and skin tone.

TECHNICAL: ${engine.technicalAdditions}.
8K resolution, RAW photo quality, ultra-sharp focus on hair texture from root to end.
No watermarks, no artifacts, no duplicated face, no extra limbs.
The finished image must be indistinguishable from a professional product photography shoot.

NEGATIVE: fake hairline, wig look, visible lace, wig cap, plastic shine, wet gloss, distorted face, blurred face, identity drift, melted strands, broken curls, floating hair, hair clipping through skin, artifacts, watermark, text.

${engine.suffix}`;
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
          Generate cinematic, reference-quality AI hair prompts for male or female styles — or create vendor product visuals with no model photo or description needed.
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
            <span className="ml-2 text-[8px] border border-current px-1 py-0.5">PRO</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-1">
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
            <p className="text-[11px] text-muted-foreground">Pick a style from the left to generate your prompt</p>
          </div>
        )}

        {/* Subject — optional extra notes only */}
        <div className="border border-border bg-card p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Extra Notes <span className="text-muted-foreground/50 normal-case font-normal">(optional — prompt is auto-built from your selections)</span>
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={gender === "female" ? "e.g. soft smile, wearing hoop earrings, gold jewelry..." : "e.g. full beard, athletic build, slight head tilt..."}
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
                <div className="opacity-60 mt-0.5 text-[8px]">{l.desc.slice(0, 45)}{l.desc.length > 45 ? "…" : ""}</div>
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
            <p className="text-[9px] text-muted-foreground leading-relaxed">{explorerTools.find((t) => t.id === tool)!.note}</p>
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
                Generated Prompt — {explorerTools.find(t => t.id === tool)?.label}
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
                rows={14}
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
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [faceDragActive, setFaceDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [faceUploadError, setFaceUploadError] = useState<string | null>(null);
  const [hairDesc, setHairDesc] = useState("");
  const [skin, setSkin] = useState("rich");
  const [length, setLength] = useState("Shoulder");
  const [lighting, setLighting] = useState("studio");
  const [vendorGender, setVendorGender] = useState<"female" | "male">("female");
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

  const processFaceFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setFaceUploadError("Please upload a JPG, PNG, or WebP face reference image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setFaceUploadError("Face reference image must be under 15MB.");
      return;
    }
    setFaceUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => setFacePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processHairFile(file);
  }, [processHairFile]);

  const handleFaceDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setFaceDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFaceFile(file);
  }, [processFaceFile]);

  const prompt = buildVendorPrompt(
    hairDesc,
    skin,
    length,
    lighting,
    tool,
    Boolean(imagePreview),
    Boolean(facePreview),
    vendorGender
  );
  const currentTool = vendorTools.find((t) => t.id === tool) ?? vendorTools[0];

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: "Prompt copied!", description: "Follow the platform instructions to use with your reference images." });
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
            <p className="text-[12px]">Upload your hair product photo (required) and optionally a face reference. The prompt follows a strict priority order — face identity is locked first, then the hair is matched exactly to your product, then installation realism is enforced. No model description needed.</p>
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
                    Product image loaded — use this as your hair reference image in the AI platform
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

          {/* Face reference upload */}
          <div className="border border-border bg-card">
            <div className="border-b border-border bg-secondary/50 px-4 py-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold">
              <Upload className="w-3 h-3" />
              Face Reference Image
              <span className="text-[8px] border border-border px-1.5 py-0.5 text-muted-foreground ml-1">Optional</span>
            </div>
            <div className="p-4">
              {!facePreview ? (
                <div
                  onDragEnter={() => setFaceDragActive(true)}
                  onDragLeave={() => setFaceDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFaceDrop}
                  onClick={() => faceFileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[180px]",
                    faceDragActive
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-primary/3"
                  )}
                >
                  <ImageIcon className={cn("w-8 h-8", faceDragActive ? "text-primary" : "text-muted-foreground/30")} />
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Upload face reference</p>
                    <p className="text-[10px] text-muted-foreground">The AI will lock the face identity — no alteration allowed</p>
                  </div>
                  <div className="text-[10px] text-primary border border-primary/40 px-3 py-1.5">
                    or click to browse
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={facePreview} alt="Face reference" className="w-full max-h-[300px] object-contain border border-border" />
                  <button
                    type="button"
                    onClick={() => setFacePreview(null)}
                    className="absolute top-2 right-2 bg-card border border-border p-1.5 text-muted-foreground hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-green-400 border border-green-500/30 bg-green-500/5 px-3 py-2">
                    <Check className="w-3 h-3" />
                    Face reference loaded — prompt will enforce 95–100% identity lock (Priority 1)
                  </div>
                </div>
              )}
              {faceUploadError && (
                <div className="mt-3 flex items-start gap-2 text-[10px] text-destructive border border-destructive/40 bg-destructive/10 px-3 py-2">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  {faceUploadError}
                </div>
              )}
              <input ref={faceFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFaceFile(f); }} />
            </div>
          </div>

          {/* Hair description */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Describe Your Hair Product <span className="text-muted-foreground/50 normal-case font-normal">(optional — uploaded image takes priority)</span>
            </div>
            <textarea
              value={hairDesc}
              onChange={(e) => setHairDesc(e.target.value)}
              placeholder="e.g. 30-inch bone straight Brazilian weave in natural black (1B), low-shine matte finish, silky smooth texture..."
              rows={3}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary leading-relaxed"
            />
            <p className="text-[9px] text-muted-foreground">Include: length, texture, color, finish (matte/low-shine), curl/wave pattern, and any unique product features</p>
          </div>

          {/* Priority legend */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">How This Prompt Works</div>
            <div className="space-y-2">
              {[
                { priority: "1", label: "Face Reference", color: "text-primary border-primary/40", note: "Identity locked at 95–100%. No alteration. Upload a face photo to activate." },
                { priority: "2", label: "Hair Product Reference", color: "text-amber-400 border-amber-400/40", note: "Hair matched exactly — color, texture, density, curl pattern, finish. No reinterpretation." },
                { priority: "3", label: "Installation Realism", color: "text-green-400 border-green-400/40", note: "Seamless hairline, correct temple transition, natural irregularity, gravity-correct placement." },
              ].map((p) => (
                <div key={p.priority} className={cn("flex items-start gap-3 border px-3 py-2", p.color.split(" ")[1], p.color.split(" ")[2] || "")}>
                  <span className={cn("text-[9px] font-black border px-1.5 py-0.5 shrink-0 mt-0.5", p.color)}>P{p.priority}</span>
                  <div>
                    <div className={cn("text-[9px] font-bold uppercase tracking-wider", p.color.split(" ")[0])}>{p.label}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro tips */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Tips for Best Results</div>
            <ul className="space-y-2">
              {[
                "Hair product photo: clean neutral background, laid flat or on a mannequin — no person wearing it",
                "Face reference: use a clear front-facing photo with good lighting and no heavy filters",
                "For lace frontals or closures: photograph installed on a wig cap for the clearest AI read",
                "Without a face upload, the AI builds a professional editorial model from your skin tone selection",
                "Hair shine in the prompt is set to natural — not glossy. This avoids the plastic/wet look",
                "Midjourney: paste hair product URL first, then face URL, then prompt — use --iw 2.0",
                "Generate 3–5 variations and select the most realistic installation result",
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
          {/* Model Gender */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Model Gender</div>
            <div className="flex gap-2">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setVendorGender(g)}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all",
                    vendorGender === g
                      ? "border-amber-400 bg-amber-400/10 text-amber-400"
                      : "border-border text-muted-foreground hover:text-amber-400 hover:border-amber-400/40"
                  )}
                >
                  {g === "female" ? "♀ Female" : "♂ Male"}
                </button>
              ))}
            </div>
          </div>

          {/* Skin tone */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Model Skin Tone</div>
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
                  <div className="opacity-60 mt-0.5 text-[8px]">{l.desc.slice(0, 40)}{l.desc.length > 40 ? "…" : ""}</div>
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
              rows={14}
              className="w-full bg-background/50 border border-border px-3 py-2.5 text-[10px] text-foreground/80 resize-none focus:outline-none leading-relaxed font-mono"
            />
            {!imagePreview && (
              <div className="flex items-start gap-2 text-[9px] text-amber-400/70">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                Upload your hair product image above for the AI to use as a visual reference. The prompt works without it if you describe the hair in text.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
