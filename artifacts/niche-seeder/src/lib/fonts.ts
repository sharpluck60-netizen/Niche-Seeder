export type FontCategory = "display" | "sans" | "serif" | "mono" | "hand";

export type AppFont = {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
  weights?: string;
};

export const appFonts: AppFont[] = [
  // ── Display / Decorative ──────────────────────────────────────────────────
  { id: "bebas-neue",        label: "Bebas Neue",        family: "Bebas Neue",        category: "display", weights: "400" },
  { id: "playfair-display",  label: "Playfair Display",  family: "Playfair Display",  category: "display", weights: "400;700" },
  { id: "cinzel",            label: "Cinzel",            family: "Cinzel",            category: "display", weights: "400;700" },
  { id: "abril-fatface",     label: "Abril Fatface",     family: "Abril Fatface",     category: "display", weights: "400" },
  { id: "alfa-slab-one",     label: "Alfa Slab One",     family: "Alfa Slab One",     category: "display", weights: "400" },
  { id: "righteous",         label: "Righteous",         family: "Righteous",         category: "display", weights: "400" },
  { id: "russo-one",         label: "Russo One",         family: "Russo One",         category: "display", weights: "400" },
  { id: "bangers",           label: "Bangers",           family: "Bangers",           category: "display", weights: "400" },
  { id: "bungee",            label: "Bungee",            family: "Bungee",            category: "display", weights: "400" },
  { id: "fredoka-one",       label: "Fredoka One",       family: "Fredoka One",       category: "display", weights: "400" },
  { id: "pacifico",          label: "Pacifico",          family: "Pacifico",          category: "display", weights: "400" },
  { id: "lobster",           label: "Lobster",           family: "Lobster",           category: "display", weights: "400" },
  { id: "boogaloo",          label: "Boogaloo",          family: "Boogaloo",          category: "display", weights: "400" },
  { id: "monoton",           label: "Monoton",           family: "Monoton",           category: "display", weights: "400" },
  { id: "shrikhand",         label: "Shrikhand",         family: "Shrikhand",         category: "display", weights: "400" },
  { id: "bree-serif",        label: "Bree Serif",        family: "Bree Serif",        category: "display", weights: "400" },
  { id: "baloo-2",           label: "Baloo 2",           family: "Baloo 2",           category: "display", weights: "400;700" },
  { id: "changa",            label: "Changa",            family: "Changa",            category: "display", weights: "400;700" },
  { id: "comfortaa",         label: "Comfortaa",         family: "Comfortaa",         category: "display", weights: "400;700" },
  { id: "exo-2",             label: "Exo 2",             family: "Exo 2",             category: "display", weights: "400;700" },
  { id: "rajdhani",          label: "Rajdhani",          family: "Rajdhani",          category: "display", weights: "400;700" },
  { id: "rammetto-one",      label: "Rammetto One",      family: "Rammetto One",      category: "display", weights: "400" },
  { id: "permanent-marker",  label: "Permanent Marker",  family: "Permanent Marker",  category: "display", weights: "400" },
  { id: "black-han-sans",    label: "Black Han Sans",    family: "Black Han Sans",    category: "display", weights: "400" },
  { id: "architects-daughter", label: "Architects Daughter", family: "Architects Daughter", category: "display", weights: "400" },
  { id: "ultra",             label: "Ultra",             family: "Ultra",             category: "display", weights: "400" },
  { id: "luckiest-guy",      label: "Luckiest Guy",      family: "Luckiest Guy",      category: "display", weights: "400" },
  { id: "teko",              label: "Teko",              family: "Teko",              category: "display", weights: "400;700" },
  { id: "squada-one",        label: "Squada One",        family: "Squada One",        category: "display", weights: "400" },
  { id: "press-start-2p",    label: "Press Start 2P",    family: "Press Start 2P",    category: "display", weights: "400" },
  { id: "unica-one",         label: "Unica One",         family: "Unica One",         category: "display", weights: "400" },
  { id: "michroma",          label: "Michroma",          family: "Michroma",          category: "display", weights: "400" },
  { id: "audiowide",         label: "Audiowide",         family: "Audiowide",         category: "display", weights: "400" },

  // ── Sans-Serif ────────────────────────────────────────────────────────────
  { id: "inter",             label: "Inter",             family: "Inter",             category: "sans", weights: "400;700" },
  { id: "roboto",            label: "Roboto",            family: "Roboto",            category: "sans", weights: "400;700" },
  { id: "open-sans",         label: "Open Sans",         family: "Open Sans",         category: "sans", weights: "400;700" },
  { id: "lato",              label: "Lato",              family: "Lato",              category: "sans", weights: "400;700" },
  { id: "montserrat",        label: "Montserrat",        family: "Montserrat",        category: "sans", weights: "400;700" },
  { id: "poppins",           label: "Poppins",           family: "Poppins",           category: "sans", weights: "400;700" },
  { id: "nunito",            label: "Nunito",            family: "Nunito",            category: "sans", weights: "400;700" },
  { id: "raleway",           label: "Raleway",           family: "Raleway",           category: "sans", weights: "400;700" },
  { id: "ubuntu",            label: "Ubuntu",            family: "Ubuntu",            category: "sans", weights: "400;700" },
  { id: "work-sans",         label: "Work Sans",         family: "Work Sans",         category: "sans", weights: "400;700" },
  { id: "dm-sans",           label: "DM Sans",           family: "DM Sans",           category: "sans", weights: "400;700" },
  { id: "figtree",           label: "Figtree",           family: "Figtree",           category: "sans", weights: "400;700" },
  { id: "plus-jakarta-sans", label: "Plus Jakarta Sans", family: "Plus Jakarta Sans", category: "sans", weights: "400;700" },
  { id: "sora",              label: "Sora",              family: "Sora",              category: "sans", weights: "400;700" },
  { id: "outfit",            label: "Outfit",            family: "Outfit",            category: "sans", weights: "400;700" },
  { id: "cabin",             label: "Cabin",             family: "Cabin",             category: "sans", weights: "400;700" },
  { id: "karla",             label: "Karla",             family: "Karla",             category: "sans", weights: "400;700" },
  { id: "barlow",            label: "Barlow",            family: "Barlow",            category: "sans", weights: "400;700" },
  { id: "mulish",            label: "Mulish",            family: "Mulish",            category: "sans", weights: "400;700" },
  { id: "manrope",           label: "Manrope",           family: "Manrope",           category: "sans", weights: "400;700" },
  { id: "jost",              label: "Jost",              family: "Jost",              category: "sans", weights: "400;700" },
  { id: "lexend",            label: "Lexend",            family: "Lexend",            category: "sans", weights: "400;700" },
  { id: "source-sans-3",     label: "Source Sans 3",     family: "Source Sans 3",     category: "sans", weights: "400;700" },
  { id: "hind",              label: "Hind",              family: "Hind",              category: "sans", weights: "400;700" },
  { id: "titillium-web",     label: "Titillium Web",     family: "Titillium Web",     category: "sans", weights: "400;700" },
  { id: "questrial",         label: "Questrial",         family: "Questrial",         category: "sans", weights: "400" },
  { id: "asap",              label: "Asap",              family: "Asap",              category: "sans", weights: "400;700" },
  { id: "rubik",             label: "Rubik",             family: "Rubik",             category: "sans", weights: "400;700" },
  { id: "josefin-sans",      label: "Josefin Sans",      family: "Josefin Sans",      category: "sans", weights: "400;700" },
  { id: "noto-sans",         label: "Noto Sans",         family: "Noto Sans",         category: "sans", weights: "400;700" },
  { id: "quicksand",         label: "Quicksand",         family: "Quicksand",         category: "sans", weights: "400;700" },
  { id: "dosis",             label: "Dosis",             family: "Dosis",             category: "sans", weights: "400;700" },
  { id: "heebo",             label: "Heebo",             family: "Heebo",             category: "sans", weights: "400;700" },
  { id: "fira-sans",         label: "Fira Sans",         family: "Fira Sans",         category: "sans", weights: "400;700" },

  // ── Serif ─────────────────────────────────────────────────────────────────
  { id: "merriweather",      label: "Merriweather",      family: "Merriweather",      category: "serif", weights: "400;700" },
  { id: "lora",              label: "Lora",              family: "Lora",              category: "serif", weights: "400;700" },
  { id: "pt-serif",          label: "PT Serif",          family: "PT Serif",          category: "serif", weights: "400;700" },
  { id: "libre-baskerville", label: "Libre Baskerville", family: "Libre Baskerville", category: "serif", weights: "400;700" },
  { id: "crimson-text",      label: "Crimson Text",      family: "Crimson Text",      category: "serif", weights: "400;700" },
  { id: "eb-garamond",       label: "EB Garamond",       family: "EB Garamond",       category: "serif", weights: "400;700" },
  { id: "cormorant-garamond",label: "Cormorant Garamond",family: "Cormorant Garamond",category: "serif", weights: "400;700" },
  { id: "josefin-slab",      label: "Josefin Slab",      family: "Josefin Slab",      category: "serif", weights: "400;700" },
  { id: "cardo",             label: "Cardo",             family: "Cardo",             category: "serif", weights: "400;700" },
  { id: "spectral",          label: "Spectral",          family: "Spectral",          category: "serif", weights: "400;700" },
  { id: "bitter",            label: "Bitter",            family: "Bitter",            category: "serif", weights: "400;700" },
  { id: "arvo",              label: "Arvo",              family: "Arvo",              category: "serif", weights: "400;700" },
  { id: "zilla-slab",        label: "Zilla Slab",        family: "Zilla Slab",        category: "serif", weights: "400;700" },
  { id: "domine",            label: "Domine",            family: "Domine",            category: "serif", weights: "400;700" },
  { id: "trocchi",           label: "Trocchi",           family: "Trocchi",           category: "serif", weights: "400" },
  { id: "dm-serif-display",  label: "DM Serif Display",  family: "DM Serif Display",  category: "serif", weights: "400" },
  { id: "source-serif-4",    label: "Source Serif 4",    family: "Source Serif 4",    category: "serif", weights: "400;700" },
  { id: "noto-serif",        label: "Noto Serif",        family: "Noto Serif",        category: "serif", weights: "400;700" },

  // ── Monospace ─────────────────────────────────────────────────────────────
  { id: "jetbrains-mono",    label: "JetBrains Mono",    family: "JetBrains Mono",    category: "mono", weights: "400;700" },
  { id: "fira-code",         label: "Fira Code",         family: "Fira Code",         category: "mono", weights: "400;700" },
  { id: "source-code-pro",   label: "Source Code Pro",   family: "Source Code Pro",   category: "mono", weights: "400;700" },
  { id: "space-mono",        label: "Space Mono",        family: "Space Mono",        category: "mono", weights: "400;700" },
  { id: "roboto-mono",       label: "Roboto Mono",       family: "Roboto Mono",       category: "mono", weights: "400;700" },
  { id: "courier-prime",     label: "Courier Prime",     family: "Courier Prime",     category: "mono", weights: "400;700" },
  { id: "ibm-plex-mono",     label: "IBM Plex Mono",     family: "IBM Plex Mono",     category: "mono", weights: "400;700" },
  { id: "inconsolata",       label: "Inconsolata",       family: "Inconsolata",       category: "mono", weights: "400;700" },
  { id: "oxanium",           label: "Oxanium",           family: "Oxanium",           category: "mono", weights: "400;700" },
  { id: "share-tech-mono",   label: "Share Tech Mono",   family: "Share Tech Mono",   category: "mono", weights: "400" },
  { id: "vt323",             label: "VT323",             family: "VT323",             category: "mono", weights: "400" },
  { id: "nova-mono",         label: "Nova Mono",         family: "Nova Mono",         category: "mono", weights: "400" },
  { id: "cutive-mono",       label: "Cutive Mono",       family: "Cutive Mono",       category: "mono", weights: "400" },

  // ── Handwriting / Script ──────────────────────────────────────────────────
  { id: "dancing-script",    label: "Dancing Script",    family: "Dancing Script",    category: "hand", weights: "400;700" },
  { id: "great-vibes",       label: "Great Vibes",       family: "Great Vibes",       category: "hand", weights: "400" },
  { id: "sacramento",        label: "Sacramento",        family: "Sacramento",        category: "hand", weights: "400" },
  { id: "satisfy",           label: "Satisfy",           family: "Satisfy",           category: "hand", weights: "400" },
  { id: "alex-brush",        label: "Alex Brush",        family: "Alex Brush",        category: "hand", weights: "400" },
  { id: "parisienne",        label: "Parisienne",        family: "Parisienne",        category: "hand", weights: "400" },
  { id: "kaushan-script",    label: "Kaushan Script",    family: "Kaushan Script",    category: "hand", weights: "400" },
  { id: "allura",            label: "Allura",            family: "Allura",            category: "hand", weights: "400" },
  { id: "cookie",            label: "Cookie",            family: "Cookie",            category: "hand", weights: "400" },
  { id: "yellowtail",        label: "Yellowtail",        family: "Yellowtail",        category: "hand", weights: "400" },
  { id: "amatic-sc",         label: "Amatic SC",         family: "Amatic SC",         category: "hand", weights: "400;700" },
  { id: "handlee",           label: "Handlee",           family: "Handlee",           category: "hand", weights: "400" },
  { id: "caveat",            label: "Caveat",            family: "Caveat",            category: "hand", weights: "400;700" },
  { id: "kalam",             label: "Kalam",             family: "Kalam",             category: "hand", weights: "400;700" },
  { id: "indie-flower",      label: "Indie Flower",      family: "Indie Flower",      category: "hand", weights: "400" },
  { id: "patrick-hand",      label: "Patrick Hand",      family: "Patrick Hand",      category: "hand", weights: "400" },
  { id: "shadows-into-light",label: "Shadows Into Light",family: "Shadows Into Light",category: "hand", weights: "400" },
];

export const fontCategories: Array<{ id: FontCategory | "all"; label: string }> = [
  { id: "all",     label: "All" },
  { id: "display", label: "Display" },
  { id: "sans",    label: "Sans" },
  { id: "serif",   label: "Serif" },
  { id: "mono",    label: "Mono" },
  { id: "hand",    label: "Script" },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(font: AppFont): void {
  if (loadedFonts.has(font.id)) return;
  loadedFonts.add(font.id);

  const name = font.family.replace(/ /g, "+");
  const weights = font.weights ?? "400;700";
  const href = `https://fonts.googleapis.com/css2?family=${name}:wght@${weights}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function applyBodyFont(font: AppFont | null): void {
  if (!font) {
    document.documentElement.style.removeProperty("--app-font-sans");
    document.body.style.removeProperty("font-family");
    return;
  }
  loadGoogleFont(font);
  const value = `"${font.family}", system-ui, sans-serif`;
  document.documentElement.style.setProperty("--app-font-sans", value);
  document.body.style.setProperty("font-family", value);
}

export const DEFAULT_FONT_ID = "inter";
export const FONT_KEY = "niche-seeder-font";
