import { useState, useMemo } from "react";
import { MapPin, Shuffle, Copy, Check, Globe, Camera, Zap, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/* ─── LANDMARK DATABASE ─────────────────────────────── */
interface Landmark {
  id: string;
  city: string;
  country: string;
  flag: string;
  name: string;
  tagline: string;
  visualDetail: string;
  skyDetail: string;
  groundDetail: string;
  region: string;
  vibe: string[];
}

const landmarks: Landmark[] = [
  { id: "statue-liberty", city: "New York", country: "USA", flag: "🇺🇸", name: "Statue of Liberty", tagline: "Liberty Island, New York Harbor", visualDetail: "the towering oxidized copper Statue of Liberty rising 93 meters, torch raised high, crown spiked with seven rays representing seven continents, stone pedestal base with red granite blocks", skyDetail: "golden late-afternoon sky with scattered cirrus clouds over the Hudson River, Manhattan skyline blurred in the distance", groundDetail: "wide gray granite plaza with iron railings, tourists visible at distance, American flags on poles flanking the entrance promenade", region: "North America", vibe: ["iconic", "patriotic", "cinematic"] },
  { id: "eiffel-tower", city: "Paris", country: "France", flag: "🇫🇷", name: "Eiffel Tower", tagline: "Champ de Mars, 7th Arrondissement", visualDetail: "the full iron lattice Eiffel Tower rising 330m, warm amber uplighting at dusk, intricate diagonal crossbeam ironwork, first and second platform observation decks visible", skyDetail: "deep blue Parisian twilight with first stars appearing, lavender-pink horizon over the Seine, soft fog at base of tower", groundDetail: "Champ de Mars green lawn stretching away, gravel walkways, park benches, light crowds of visitors silhouetted against the glowing tower", region: "Europe", vibe: ["romantic", "golden-hour", "iconic"] },
  { id: "big-ben", city: "London", country: "UK", flag: "🇬🇧", name: "Big Ben & Westminster", tagline: "Palace of Westminster, London", visualDetail: "Elizabeth Tower (Big Ben) clock face glowing amber, neo-Gothic stonework with ornate pinnacles and carved reliefs, the Houses of Parliament stretching along the Thames embankment", skyDetail: "overcast silver-gray London sky with dramatic low clouds, Thames River reflecting the cloudy silver light, Westminster Bridge visible", groundDetail: "stone embankment with iron lamp posts, red double-decker bus blurred past, black cabs, stone bridge with pedestrians", region: "Europe", vibe: ["classic", "moody", "london"] },
  { id: "colosseum", city: "Rome", country: "Italy", flag: "🇮🇹", name: "Colosseum", tagline: "Via Sacra, Ancient Rome", visualDetail: "the vast oval Colosseum with its three tiers of arched arcades in travertine limestone, ruined upper fourth level, 80 entrance arches framing deep shadows, ancient stone weathered and golden", skyDetail: "warm terracotta Mediterranean sunset sky, deep blue fading to amber at the horizon, ancient Rome skyline with umbrella pines", groundDetail: "original Roman paving stones of Via Sacra, gladiatorial tourists in costume, low stone barriers, ancient stone columns in foreground", region: "Europe", vibe: ["ancient", "golden-hour", "cinematic"] },
  { id: "taj-mahal", city: "Agra", country: "India", flag: "🇮🇳", name: "Taj Mahal", tagline: "Banks of the Yamuna River", visualDetail: "the white Makrana marble Taj Mahal dome and four 40m minarets perfectly mirrored in the long reflecting pool, intricate pietra dura inlay floral patterns on the exterior, arched iwans framing the entry", skyDetail: "warm orange-pink sunrise sky reflected in the reflecting pool, light mist rising from the Yamuna River, soft backlight creating a golden aura around the dome", groundDetail: "long sandstone causeway with cypress trees lining each side, reflecting pool surface with ripples, rose-pink sandstone pathway leading to the main plinth", region: "Asia", vibe: ["magical", "sunrise", "romantic"] },
  { id: "great-wall", city: "Beijing", country: "China", flag: "🇨🇳", name: "Great Wall of China", tagline: "Mutianyu Section, Beijing", visualDetail: "the Great Wall of China snaking over forested mountain ridges as far as the eye can see, ancient gray stone watchtowers every 500 meters, crenelated battlements with arrow slits, worn stone steps descending steeply", skyDetail: "crisp autumn sky in deep blue, forested mountains in shades of amber, red, and dark green below, light morning mist filling the valley between ridges", groundDetail: "worn granite-slab walkway of the wall itself, stone battlements left and right, cable car station visible far below, autumn leaves on surrounding trees", region: "Asia", vibe: ["epic", "ancient", "autumn"] },
  { id: "machu-picchu", city: "Cusco", country: "Peru", flag: "🇵🇪", name: "Machu Picchu", tagline: "Sacred Valley of the Incas", visualDetail: "the Inca citadel of Machu Picchu with perfectly fitted dry-stone terraces cascading down steep mountain sides, Temple of the Sun, Intihuatana stone, agricultural terraces carved into sheer cliffs", skyDetail: "dramatic Andean sky with towering white cumulus clouds rolling over Huayna Picchu mountain, shafts of golden light breaking through cloud, morning mist in the valley 400 meters below", groundDetail: "ancient Inca stone pathways between temples, original grass growing between the stones, llamas grazing on the lower terraces, steep mountain drops on all sides", region: "South America", vibe: ["mystical", "epic", "jungle"] },
  { id: "santorini", city: "Oia", country: "Greece", flag: "🇬🇷", name: "Santorini Cliffs & Domes", tagline: "Oia, Santorini Island", visualDetail: "iconic sugar-white Cycladic buildings and blue-domed churches stacked on the volcanic caldera cliffs, domed bell towers, whitewashed stairs carved into rock face, bougainvillea cascading over walls", skyDetail: "deep Aegean blue sky at golden hour, the sun descending toward the caldera, warm amber and rose light washing the white buildings, Aegean Sea shimmering cobalt below", groundDetail: "narrow winding cobblestone alleyways between white walls, terracotta pots, wrought iron gates, the caldera sea 300 meters below visible at the cliff edge", region: "Europe", vibe: ["romantic", "blue-white", "golden-hour"] },
  { id: "dubai-burj", city: "Dubai", country: "UAE", flag: "🇦🇪", name: "Burj Khalifa", tagline: "Downtown Dubai, UAE", visualDetail: "the Burj Khalifa tapering spire rising 828m with its Y-shaped cross section structural system and setbacks every 26 floors, glass curtain wall exterior reflecting sky, observation deck at floor 124 and 148", skyDetail: "gradient blue desert sky turning orange-gold at sunset behind the tower, the Dubai Fountain illuminated below, light haze giving the skyline a soft glow", groundDetail: "Dubai Fountain pool and the Dubai Mall boardwalk below, palm trees, the Address Dubai hotel facade, tourists on the waterfront promenade", region: "Middle East", vibe: ["futuristic", "luxury", "sunset"] },
  { id: "sydney-opera", city: "Sydney", country: "Australia", flag: "🇦🇺", name: "Sydney Opera House", tagline: "Bennelong Point, Sydney Harbour", visualDetail: "the white interlocking concrete shell vaults of the Sydney Opera House rising from the promontory, 1,056,000 chevron-patterned glazed tiles on each shell, Concert Hall and Joan Sutherland Theatre wings", skyDetail: "deep blue summer sky over Sydney Harbour, harbour bridge steel arch visible beyond, sparkling blue harbour with white sailboats and ferries", groundDetail: "sandstone harbour promenade, circular quay with ferry wharves behind, harbour water lapping the Bennelong Point foreshore, tourists on the forecourt steps", region: "Oceania", vibe: ["iconic", "blue-water", "summer"] },
  { id: "petra", city: "Wadi Musa", country: "Jordan", flag: "🇯🇴", name: "Petra — The Treasury", tagline: "Rose-Red City, Southern Jordan", visualDetail: "Al-Khazneh (The Treasury) carved directly into the rose-red Nabataean sandstone cliff face, 40m high Hellenistic facade with Doric columns, decorative pediments, urn atop the broken pediment, deep red and orange stone", skyDetail: "narrow strip of deep blue desert sky visible above the Siq canyon walls, warm amber afternoon light raking across the carved facade, long diagonal shadows", groundDetail: "sandy floor of the Siq canyon, camel caravans and Bedouin guides, rose-colored sand underfoot, canyon walls pressing close on both sides before opening to reveal the facade", region: "Middle East", vibe: ["ancient", "desert", "cinematic"] },
  { id: "northern-lights", city: "Tromsø", country: "Norway", flag: "🇳🇴", name: "Northern Lights", tagline: "Arctic Circle, Tromsø, Norway", visualDetail: "sweeping curtains of electric green Aurora Borealis rippling across the night sky, streaks of violet and magenta at the edges, dancing light beams pulsing and folding over snow-covered mountain peaks", skyDetail: "pitch-black Arctic sky with the Milky Way visible through the aurora, snow-dusted pine forests silhouetted below, the fjord reflecting the light on its black water surface", groundDetail: "deep snow underfoot, bare birch trees, frozen lake surface, small traditional Norwegian cabin with warm orange light in windows, breath visible in the -15°C air", region: "Europe", vibe: ["magical", "arctic", "nighttime"] },
  { id: "angkor-wat", city: "Siem Reap", country: "Cambodia", flag: "🇰🇭", name: "Angkor Wat", tagline: "Khmer Empire Capital, Cambodia", visualDetail: "the five lotus-bud towers of Angkor Wat rising from the jungle plain, intricate sandstone bas-reliefs depicting Hindu mythology on every surface, long causeway over the reflection moat, jungle canopy pressing in", skyDetail: "dramatic monsoon sky with towering cumulonimbus clouds, tropical orange sunrise light painting the lotus towers gold, steam rising from the jungle floor, the moat reflecting the temple perfectly", groundDetail: "wide sandstone causeway lined with nagas (serpent balustrades), the reflection moat 190m wide with lily pads at edges, monks in saffron robes walking the causeway", region: "Asia", vibe: ["ancient", "jungle", "sunrise"] },
  { id: "rio-christ", city: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", name: "Christ the Redeemer", tagline: "Corcovado Mountain, Rio de Janeiro", visualDetail: "the 38m Art Deco statue of Cristo Redentor with arms outstretched 28m wide, soapstone exterior, standing atop the 710m Corcovado granite peak, overlooking the entire city", skyDetail: "dramatic carioca sky with tropical clouds sweeping around the statue at high altitude, Guanabara Bay and Sugarloaf Mountain visible in the distance, Copacabana beach arcing below", groundDetail: "the circular viewing platform at the statue's base, panoramic railings, the city of Rio de Janeiro spreading below in every direction, Tijuca Forest jungle covering Corcovado's slopes", region: "South America", vibe: ["iconic", "elevated", "panoramic"] },
  { id: "maldives", city: "Malé Atoll", country: "Maldives", flag: "🇲🇻", name: "Maldives Overwater Bungalow", tagline: "Indian Ocean, Maldives", visualDetail: "luxury overwater bungalow on stilts over impossibly clear turquoise lagoon, thatched roof, private deck with steps descending directly into the water, the coral reef visible through the crystal-clear shallows", skyDetail: "perfect tropical blue sky with high cirrus clouds, blazing midday sun turning the lagoon ten shades of turquoise and electric blue, the horizon a perfect line between sky and sea", groundDetail: "turquoise and aquamarine water below the deck, white sand visible through the water 2 meters deep, coral formations and tropical fish visible, neighboring bungalows on the horizon", region: "Asia", vibe: ["tropical", "luxury", "blue-water"] },
  { id: "louvre", city: "Paris", country: "France", flag: "🇫🇷", name: "The Louvre", tagline: "Musée du Louvre, Paris", visualDetail: "the iconic glass and steel Pei Pyramid entrance rising from the Napoléon Courtyard, surrounded by the historic U-shaped Louvre Palace wings in Baroque and Renaissance stone, the inverted glass pyramid visible below", skyDetail: "soft Parisian overcast sky casting even diffused light on the stone palace facade, the Seine visible beyond, interior courtyards lit by ambient cloud-filtered sunlight", groundDetail: "cobblestone Cour Napoléon around the pyramid, long queues of visitors reflected in the pool around the pyramid base, stone benches and lamp posts of the palace complex", region: "Europe", vibe: ["cultural", "classic", "paris"] },
  { id: "bali-temples", city: "Ubud", country: "Indonesia", flag: "🇮🇩", name: "Pura Besakih Temple", tagline: "Mount Agung, Bali", visualDetail: "the Mother Temple of Pura Besakih climbing the volcanic slopes of Mount Agung in tiered black volcanic stone pagoda merus (towers) with seven and eleven thatched tiers, wrapped with sacred cloth in black and white poleng", skyDetail: "dramatic tropical sky with Mount Agung volcano summit partially shrouded in low cloud, golden afternoon light breaking through gaps in the cloud, deep green rice terraces below", groundDetail: "ancient stone stairways with carved demons flanking each gate, offerings of flowers and incense, Balinese Hindus in traditional sarong and udeng entering the temple grounds", region: "Asia", vibe: ["mystical", "spiritual", "tropical"] },
  { id: "kyoto-bamboo", city: "Kyoto", country: "Japan", flag: "🇯🇵", name: "Arashiyama Bamboo Grove", tagline: "Sagano, Kyoto, Japan", visualDetail: "impossibly tall green bamboo stalks 15-20 meters high forming a dense cathedral ceiling, sunlight filtering through the dense canopy in broken shafts, bamboo stalks swaying gently, the path disappearing into the green tunnel", skyDetail: "soft diffused forest light through the bamboo canopy, patches of pale blue sky between swaying tops, gentle rustling sound of bamboo in the wind, dappled light patterns on the path", groundDetail: "wide smooth stone path through the grove, perfectly maintained bamboo walls on both sides, traditional rickshaw visible, other visitors in the distance, sound of bamboo creaking", region: "Asia", vibe: ["zen", "green", "japan"] },
  { id: "iceland-waterfalls", city: "Southern Iceland", country: "Iceland", flag: "🇮🇸", name: "Skógafoss Waterfall", tagline: "Skógá River, Southern Iceland", visualDetail: "Skógafoss waterfall 60m high and 25m wide crashing into the river, perpetual rainbow arcing in the mist at the base, mossy black basalt cliffs framing each side, emerald green meadows above the cliff edge", skyDetail: "dramatic Icelandic sky with fast-moving heavy clouds, shafts of Nordic sunlight cutting through cloud to spotlight the waterfall, the rainbow forming and dissolving in the mist", groundDetail: "slippery black basalt stones at the waterfall's base, the Skógá River flowing away, the famous staircase climbing 370 steps up the cliff to the left, mist soaking everything within 30 meters", region: "Europe", vibe: ["dramatic", "nature", "nordic"] },
  { id: "times-square", city: "New York", country: "USA", flag: "🇺🇸", name: "Times Square", tagline: "Broadway & 7th Ave, Manhattan", visualDetail: "Times Square at night with towering LED and neon billboard displays covering every building face, colors of red, blue, yellow and white light reflecting off wet pavement, yellow taxis and crowds", skyDetail: "artificial night sky completely blocked by the blaze of advertising LED screens and neon signs, the surrounding Manhattan skyscrapers rising above the light show, no natural sky visible", groundDetail: "rain-slicked black asphalt reflecting all the neon colors, yellow taxi cabs stopped in traffic, dense crowds on the sidewalks, TKTS red stairs stage visible", region: "North America", vibe: ["neon", "nighttime", "urban"] },
  { id: "sahara-desert", city: "Merzouga", country: "Morocco", flag: "🇲🇦", name: "Sahara Desert Dunes", tagline: "Erg Chebbi, Merzouga, Morocco", visualDetail: "towering orange-red Sahara sand dunes of Erg Chebbi rising 150 meters, razor-sharp wind-carved ridgelines, rippled sand texture on the faces, camel caravan silhouettes on the ridge", skyDetail: "blazing Saharan sunset in deep amber, orange, and crimson, the sun touching the dune horizon, thin dusty haze turning the sky a warm peachy orange, stars beginning to appear at zenith", groundDetail: "deep soft orange sand shifting underfoot, camel tracks leading over the dune, Berber camp tent flaps visible behind, the complete silence of the desert, no vegetation in any direction", region: "Africa", vibe: ["desert", "sunset", "epic"] },
  { id: "barcelona-sagrada", city: "Barcelona", country: "Spain", flag: "🇪🇸", name: "Sagrada Família", tagline: "Eixample District, Barcelona", visualDetail: "Gaudí's Sagrada Família with its 18 planned spires in organic stone, Nativity Facade with intricate stone carvings of figures and foliage in his naturalist style, warm sandstone exterior glowing amber", skyDetail: "bright Mediterranean blue sky, Barcelona's grid Eixample neighborhood rooftops visible beyond, light aircraft contrails, sunlight on the stone faces catching every carved detail", groundDetail: "wide stone plaza around the cathedral with fountains, park benches under palm trees, audio guide tourists, Barcelona street grid visible in the surrounding neighborhood", region: "Europe", vibe: ["artistic", "gothic", "mediterranean"] },
  { id: "venice-canals", city: "Venice", country: "Italy", flag: "🇮🇹", name: "Grand Canal, Venice", tagline: "Canal Grande, Venice", visualDetail: "the Grand Canal with gondolas gliding through the water, ornate Renaissance and Byzantine palazzos lining each bank in pastel colors — ochre, terracotta, pale pink — reflected in the canal water, Rialto Bridge in background", skyDetail: "soft golden Venetian afternoon light, thin haze over the lagoon, the sky a pale blue-gold, striped gondola poles casting long shadows across the water surface", groundDetail: "the canal water in deep jade-green, gondoliers in traditional striped shirts and straw hats, water lapping at the mossy stone steps of palazzo foundations, vaporetto water bus passing", region: "Europe", vibe: ["romantic", "waterway", "golden-hour"] },
  { id: "alaska-glaciers", city: "Juneau", country: "USA", flag: "🇺🇸", name: "Mendenhall Glacier", tagline: "Tongass National Forest, Alaska", visualDetail: "the Mendenhall Glacier face, a towering ice wall of electric blue and white, deep crevasses splitting the ice into towers and columns, icebergs calving off into the dark glacial lake below", skyDetail: "overcast cool gray Alaskan sky with low cloud rolling over the mountains, diffuse light making the glacier's electric blue glow even more intense, mountains snow-capped above the treeline", groundDetail: "dark glacial lake with floating blue-white icebergs at the glacier's base, the visitor center trail through Sitka spruce forest, gray rocky moraine at the glacier's edges", region: "North America", vibe: ["nature", "arctic", "blue-ice"] },
  { id: "budapest-parliament", city: "Budapest", country: "Hungary", flag: "🇭🇺", name: "Hungarian Parliament", tagline: "Banks of the Danube, Budapest", visualDetail: "the Hungarian Parliament Building's neo-Gothic spires and central dome rising along the Danube, 691 meters long with 96m central dome, terracotta-red limestone facade, 88 statues on the exterior", skyDetail: "deep blue Danubian dusk sky, golden lights illuminating every spire and arch of the parliament, the Danube reflecting the illumination in a long shimmering trail", groundDetail: "the wide stone Danube promenade, the Chain Bridge lit up in the background, tourist boats on the river, the Buda hills and castle visible across the Danube", region: "Europe", vibe: ["gothic", "nighttime", "river"] },
  { id: "machu-picchu-2", city: "Cappadocia", country: "Turkey", flag: "🇹🇷", name: "Cappadocia Hot Air Balloons", tagline: "Göreme Valley, Cappadocia, Turkey", visualDetail: "a sky full of 100+ colorful hot air balloons of every color and pattern floating above the fairy chimney rock formations of Cappadocia at sunrise, the volcanic tuff landscape below in pink and cream", skyDetail: "blazing orange and rose pink sunrise behind the volcanic tuff horizon, the balloons casting long shadows on the valley floor below, the sky transitioning from deep blue at zenith to vivid orange at the horizon", groundDetail: "the eerie fairy chimney rock formations below carved with ancient cave dwellings, vineyard terraces, stone lanes between cave hotels, other balloons landing in the valley", region: "Middle East", vibe: ["magical", "sunrise", "colorful"] },
];

/* ─── AI TOOLS ───────────────────────────────────────── */
const aiTools = [
  { id: "veo3", label: "Veo 3", color: "text-blue-400 border-blue-400/40 bg-blue-400/5" },
  { id: "kling", label: "Kling AI", color: "text-purple-400 border-purple-400/40 bg-purple-400/5" },
  { id: "runway", label: "Runway Gen-3", color: "text-primary border-primary/40 bg-primary/5" },
  { id: "pika", label: "Pika 2.0", color: "text-pink-400 border-pink-400/40 bg-pink-400/5" },
  { id: "hailuo", label: "Hailuo AI", color: "text-amber-400 border-amber-400/40 bg-amber-400/5" },
];

/* ─── VIDEO STYLES ───────────────────────────────────── */
const videoStyles = [
  { id: "golden-hour", label: "Golden Hour", desc: "warm amber sunset backlight" },
  { id: "blue-hour", label: "Blue Hour", desc: "twilight dusk, deep indigo sky" },
  { id: "midday", label: "Midday", desc: "bright sun, crisp shadows" },
  { id: "overcast", label: "Overcast", desc: "diffused soft natural light" },
  { id: "night", label: "Night / Neon", desc: "city lights, artificial glow" },
  { id: "sunrise", label: "Sunrise", desc: "rosy dawn mist and warmth" },
  { id: "storm", label: "Dramatic Storm", desc: "dark skies, volumetric light shafts" },
  { id: "magic", label: "Magical Glow", desc: "ethereal haze, soft dreamy light" },
];

/* ─── SHOT TYPES ─────────────────────────────────────── */
const shotTypes = [
  { id: "wide", label: "Wide Establishing", desc: "subject + full landmark" },
  { id: "medium", label: "Medium Shot", desc: "waist up, landmark behind" },
  { id: "portrait", label: "Portrait Close-up", desc: "face + landmark soft-focus bg" },
  { id: "selfie", label: "POV Selfie Angle", desc: "low lens, looking up" },
  { id: "aerial", label: "Aerial Reveal", desc: "drone pull-up to landmark" },
  { id: "dolly", label: "Dolly Push-in", desc: "camera moves toward subject" },
];

/* ─── PROMPT BUILDER ─────────────────────────────────── */
function buildPrompt(
  landmark: Landmark,
  subject: string,
  tool: string,
  style: (typeof videoStyles)[number],
  shot: (typeof shotTypes)[number]
): string {
  const subjectLine = subject.trim()
    ? subject.trim()
    : "a person";

  const shotLines: Record<string, string> = {
    wide: `The camera holds a wide establishing shot — ${subjectLine} stands in the foreground, full-body centered, with ${landmark.name} rising dramatically behind them in sharp detail.`,
    medium: `Medium shot from chest-up — ${subjectLine} faces the camera with casual confidence, ${landmark.name} spread across the background in soft bokeh depth.`,
    portrait: `Tight portrait close-up — ${subjectLine} looks slightly off-camera, expression relaxed and natural, ${landmark.name} rendered in shallow-focus painterly blur behind them.`,
    selfie: `POV selfie angle — low camera tilted upward at ${subjectLine}, arm extended toward lens, ${landmark.name} looming above and behind filling the upper frame.`,
    aerial: `Slow drone reveal — begins on ${landmark.name} from high altitude, camera tilts down to reveal ${subjectLine} standing on the ground below, arms wide open.`,
    dolly: `Dolly push-in from 10 meters — camera glides slowly toward ${subjectLine} who holds position, ${landmark.name} gradually expanding to fill the background as camera closes distance.`,
  };

  const lightingMap: Record<string, string> = {
    "golden-hour": "warm amber backlight at golden hour, the setting sun casting a soft halo glow, long shadows stretching across the ground, skin warmly lit from the side",
    "blue-hour": "deep twilight blue-hour illumination, indigo sky, landmark beginning to light up artificially, cool blue shadows and warm accent pockets of light",
    midday: "bright midday sun directly overhead, crisp hard shadows, high contrast light, vivid saturated colors under a cloudless sky",
    overcast: "soft overcast diffused light, no harsh shadows, even flattering illumination across subject and landmark, moody silver-gray sky",
    night: "nighttime city glow, LED and neon lights reflecting on surfaces, artificial warm light sources with pools of shadow between, stars or light-polluted haze above",
    sunrise: "early morning sunrise warmth, rosy pink and peach tones, low soft sunlight from the horizon, thin mist rising from the ground, birdsong quiet energy",
    storm: "dramatic pre-storm light, dark bruised purple-gray sky, one dramatic shaft of golden-silver light cutting through the clouds spotlighting the scene, wind-movement in hair and fabric",
    magic: "soft ethereal magical glow, warm diffused haze in the atmosphere, light catching particles in the air, dreamlike quality with gentle lens flare artefacts",
  };

  const toolLine: Record<string, string> = {
    veo3: "Veo 3 ultra-photorealistic render, 4K cinematic quality, no CGI artifacting, natural human skin texture, 24fps film grain",
    kling: "Kling AI cinematic mode, 1080p filmic output, natural motion with physics-accurate hair and fabric movement, realistic crowd behavior in background",
    runway: "Runway Gen-3 Alpha mode, cinematic quality, photorealistic lighting response, natural camera motion, 24fps film aesthetic",
    pika: "Pika 2.0 photorealistic engine, cinematic framing, natural motion, no plastic skin, realistic ambient occlusion",
    hailuo: "Hailuo AI MiniMax cinematic engine, ultra-high detail, photorealistic human rendering, cinematic color grade, 1080p",
  };

  return `${shotLines[shot.id]}

ENVIRONMENT: ${landmark.visualDetail}. ${landmark.groundDetail}.

ATMOSPHERE & LIGHTING: ${lightingMap[style.id]}. ${landmark.skyDetail}.

SUBJECT BEHAVIOR: ${subjectLine} — natural unscripted body language, weight shifting slightly, a spontaneous smile or genuine relaxed expression. Hair and clothing moving naturally in the breeze. No stiff posing.

CAMERA PHYSICS: The shot has natural camera micro-sway as if handheld or on a fluid-head gimbal. The depth-of-field separates subject from background with natural lens roll-off.

TECHNICAL SPEC: ${toolLine[tool]}. 6-8 seconds duration. No text overlays, no watermarks, no color banding. Photorealistic travel photography aesthetic — looks indistinguishable from genuine on-location footage.`;
}

/* ─── REGIONS ────────────────────────────────────────── */
const regions = ["All", "North America", "Europe", "Asia", "Middle East", "South America", "Africa", "Oceania"];

/* ─── COMPONENT ──────────────────────────────────────── */
export function PhantomPassport() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<Landmark | null>(null);
  const [subject, setSubject] = useState("");
  const [tool, setTool] = useState("veo3");
  const [styleId, setStyleId] = useState("golden-hour");
  const [shotId, setShotId] = useState("wide");
  const [copied, setCopied] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);

  const filteredLandmarks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return landmarks.filter((l) => {
      const matchRegion = region === "All" || l.region === region;
      const matchQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q);
      return matchRegion && matchQ;
    });
  }, [search, region]);

  const currentStyle = videoStyles.find((s) => s.id === styleId) ?? videoStyles[0];
  const currentShot = shotTypes.find((s) => s.id === shotId) ?? shotTypes[0];
  const currentTool = aiTools.find((t) => t.id === tool) ?? aiTools[0];

  const prompt = selected
    ? buildPrompt(selected, subject, tool, currentStyle, currentShot)
    : "";

  function handleSelect(l: Landmark) {
    setSelected(l);
    setPromptVisible(false);
    setTimeout(() => setPromptVisible(true), 50);
  }

  function handleShuffle() {
    const pool = filteredLandmarks.length > 0 ? filteredLandmarks : landmarks;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    handleSelect(pick);
  }

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: "Prompt copied", description: "Paste into your AI video generator." });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            <Globe className="w-3 h-3 text-primary" />
            Phantom Passport
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary glitch-text" data-text="MAP STUDIO">
            MAP STUDIO
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Pin a world landmark → describe yourself → generate a cinematic AI prompt that makes it look like you were actually there.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] font-mono">
          <div className="border border-border px-3 py-2 bg-card">
            <div className="text-muted-foreground uppercase tracking-widest">LOCATIONS</div>
            <div className="text-primary font-bold text-lg">{landmarks.length}</div>
          </div>
          <div className="border border-border px-3 py-2 bg-card">
            <div className="text-muted-foreground uppercase tracking-widest">REGIONS</div>
            <div className="text-primary font-bold text-lg">{regions.length - 1}</div>
          </div>
          <div className="border border-border px-3 py-2 bg-card">
            <div className="text-muted-foreground uppercase tracking-widest">AI TOOLS</div>
            <div className="text-primary font-bold text-lg">{aiTools.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        {/* LEFT: Location picker */}
        <div className="space-y-4">
          {/* Search + filter */}
          <div className="border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <MapPin className="w-3 h-3 text-primary" />
              Pin Your Location
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search landmarks, cities, countries..."
                className="w-full bg-background border border-border pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Region tabs */}
            <div className="flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={cn(
                    "px-2.5 py-1 text-[9px] uppercase tracking-wider border transition-colors",
                    region === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Landmark grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredLandmarks.length === 0 && (
              <div className="col-span-2 text-center py-10 text-muted-foreground text-sm">
                No landmarks matched "{search}"
              </div>
            )}
            {filteredLandmarks.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => handleSelect(l)}
                className={cn(
                  "text-left border p-3 transition-all duration-200 dw-bracket group",
                  selected?.id === l.id
                    ? "border-primary bg-primary/10 theme-glow-box"
                    : "border-border bg-card hover:border-primary/60 hover:bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base leading-none">{l.flag}</span>
                      <span className={cn(
                        "text-[9px] uppercase tracking-wider font-bold",
                        selected?.id === l.id ? "text-primary" : "text-muted-foreground"
                      )}>
                        {l.country}
                      </span>
                    </div>
                    <div className="text-[12px] font-bold text-foreground leading-tight truncate">
                      {l.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 truncate">{l.city}</div>
                  </div>
                  <ChevronRight className={cn(
                    "w-3 h-3 shrink-0 mt-1 transition-transform",
                    selected?.id === l.id ? "text-primary rotate-90" : "text-muted-foreground/30 group-hover:text-muted-foreground"
                  )} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {l.vibe.map((v) => (
                    <span key={v} className="text-[8px] px-1.5 py-0.5 bg-secondary text-muted-foreground uppercase tracking-wider">
                      {v}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Shuffle CTA */}
          <button
            type="button"
            onClick={handleShuffle}
            className="w-full border border-dashed border-border py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle className="w-3 h-3" />
            Random Location
          </button>
        </div>

        {/* RIGHT: Controls + Prompt */}
        <div className="space-y-4">
          {/* Selected landmark reveal */}
          {selected ? (
            <div className="border border-primary bg-primary/5 theme-glow-box p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold mb-2">
                <MapPin className="w-3 h-3" />
                Location Locked
              </div>
              <div className="text-xl font-bold text-foreground">{selected.flag} {selected.name}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{selected.tagline}</div>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed line-clamp-3">
                {selected.visualDetail}
              </p>
            </div>
          ) : (
            <div className="border border-dashed border-border bg-card p-6 text-center">
              <Globe className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-[11px] text-muted-foreground">Select a location from the left panel to begin</p>
            </div>
          )}

          {/* Subject */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Describe Yourself
            </div>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. a woman with curly dark hair, sitting cross-legged, wearing a white shirt with a red tie and patterned jeans..."
              rows={3}
              className="w-full bg-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary leading-relaxed"
            />
            <p className="text-[9px] text-muted-foreground">The more detail, the more convincing the output looks</p>
          </div>

          {/* Shot type */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
              <Camera className="w-3 h-3 text-primary" />
              Shot Type
            </div>
            <div className="grid grid-cols-2 gap-1">
              {shotTypes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShotId(s.id)}
                  className={cn(
                    "text-left px-2.5 py-2 border text-[9px] transition-colors",
                    shotId === s.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                  )}
                >
                  <div className="font-bold uppercase tracking-wider">{s.label}</div>
                  <div className="opacity-70 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Light style */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Lighting & Time of Day
            </div>
            <div className="grid grid-cols-2 gap-1">
              {videoStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyleId(s.id)}
                  className={cn(
                    "text-left px-2.5 py-2 border text-[9px] transition-colors",
                    styleId === s.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                  )}
                >
                  <div className="font-bold uppercase tracking-wider">{s.label}</div>
                  <div className="opacity-70 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tool */}
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" />
              AI Video Generator
            </div>
            <div className="flex flex-wrap gap-1.5">
              {aiTools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTool(t.id)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all",
                    tool === t.id ? t.color + " theme-glow-box" : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate prompt */}
          {selected && (
            <div className="border border-primary/50 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  Generated Prompt — {currentTool.label}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 border text-[9px] uppercase tracking-wider transition-all font-bold",
                    copied
                      ? "border-green-500 text-green-400 bg-green-500/10"
                      : "border-primary text-primary hover:bg-primary/10"
                  )}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className={cn(
                "transition-opacity duration-300",
                promptVisible ? "opacity-100" : "opacity-0"
              )}>
                <textarea
                  readOnly
                  value={prompt}
                  rows={12}
                  className="w-full bg-background/50 border border-border px-3 py-3 text-[10px] text-foreground/80 resize-none focus:outline-none leading-relaxed font-mono"
                />
              </div>
              <p className="text-[9px] text-muted-foreground">
                Paste into {currentTool.label} · adjust subject detail for best results · {currentShot.label} · {currentStyle.label} lighting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
