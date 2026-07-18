import fs from "node:fs";

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl([r,g,b]) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max===r) h = ((g-b)/d + (g<b?6:0));
    else if (max===g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h *= 60;
  }
  return [h, s*100, l*100];
}

const derived = JSON.parse(fs.readFileSync("/tmp/derived_themes.json", "utf8"));

const existingNames = new Set(["light","corporate","forest","nord","dracula","business","cosmo","flatly","litera","lumen","zephyr","silk","winter","cupcake","sandstone","garden","autumn","lemonade","caramellatte","everforest","gruvbox","aqua","emerald","slate","spacelab","cerulean","quartz","journal","dim","night","darkly","cyborg","superhero","abyss","synthwave","cyberpunk","tokyonight","halloween","luxury","retro","coffee","rosepine","catppuccin","aurora","obsidian","linen","graphite","nebula","prism"]);

// Word bank grouped by hue bucket + polarity, single evocative words
const bank = {
  red_light: ["scarlet","ember","poppy","brick","garnet","crimson"],
  red_dark: ["blaze","cinder","magma","carmine","vermillion"],
  orange_light: ["amber","apricot","saffron","clementine","copper"],
  orange_dark: ["rust","ochre","bronze","tawny"],
  yellow_light: ["citrine","daffodil","honeycomb","marigold"],
  yellow_dark: ["gilded","brass"],
  green_light: ["fern","sage","mint","clover","meadow","jade"],
  green_dark: ["moss","pine","juniper","verdant","spruce"],
  cyan_light: ["seafoam","glacier","lagoon","teal"],
  cyan_dark: ["abyssal","deepsea","tidal"],
  blue_light: ["cobalt","skyline","azure","denim","cove"],
  blue_dark: ["midnight","navy","indigo","cosmos","voyager"],
  violet_light: ["lilac","wisteria","orchid","lavenderfield"],
  violet_dark: ["amethyst","velvet","twilight","eclipse"],
  magenta_light: ["fuchsia","peony","blossom"],
  magenta_dark: ["mulberry","plum"],
  gray_light: ["chalk","pebble","fog","cloudline","porcelain"],
  gray_dark: ["charcoal","onyx","shadowline","graphene","basalt"],
};

function bucketFor(hue, sat, light, isLightTheme) {
  let hueBucket;
  if (sat < 12) hueBucket = "gray";
  else if (hue < 20 || hue >= 345) hueBucket = "red";
  else if (hue < 45) hueBucket = "orange";
  else if (hue < 70) hueBucket = "yellow";
  else if (hue < 160) hueBucket = "green";
  else if (hue < 195) hueBucket = "cyan";
  else if (hue < 250) hueBucket = "blue";
  else if (hue < 290) hueBucket = "violet";
  else hueBucket = "magenta";
  return hueBucket + "_" + (isLightTheme ? "light" : "dark");
}

const used = new Set(existingNames);
const assignment = {};
const order = Object.keys(derived).sort(); // deterministic order

for (const slug of order) {
  const t = derived[slug];
  const [h,s,l] = rgbToHsl(hexToRgb(t.tokens.brand));
  const key = bucketFor(h, s, l, t.isLight);
  const list = bank[key] || bank["gray_" + (t.isLight ? "light" : "dark")];
  let chosen = list.find(w => !used.has(w));
  if (!chosen) {
    // fallback: try any bucket word, then synthesize
    for (const arr of Object.values(bank)) {
      chosen = arr.find(w => !used.has(w));
      if (chosen) break;
    }
  }
  if (!chosen) chosen = key + "-" + slug; // last resort, guaranteed unique
  used.add(chosen);
  assignment[slug] = { name: chosen, hue: Math.round(h), sat: Math.round(s), light: Math.round(l), bucket: key };
}

fs.writeFileSync("/tmp/name_assignment.json", JSON.stringify(assignment, null, 1));
console.log(Object.entries(assignment).map(([k,v]) => `${k} -> ${v.name} (${v.bucket}, H${v.hue}/S${v.sat}/L${v.light})`).join("\n"));
