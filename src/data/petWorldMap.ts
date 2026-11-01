import type { PetRegionId } from "./pets.ts";

/**
 * A drawn map of the world, not a survey. The game data gives zone names and
 * no coordinates, so each zone sits where its name and description suggest
 * (Eastern Tolbas Forest beside Aullaeu Village, Steel Titan's Grave at the
 * north of Middle Reshanta). Treat positions as approximate.
 */
export const worldMapSize = { width: 600, height: 800 };

type Box = { x: number; y: number; width: number; height: number };
type Spot = [x: number, y: number];

// Each region's spots are 0 to 100 within its box.
const boxes: Record<Exclude<PetRegionId, "dungeons">, Box> = {
  verteron: { x: 24, y: 56, width: 270, height: 350 },
  altgard: { x: 326, y: 56, width: 250, height: 350 },
  "middle-reshanta": { x: 176, y: 462, width: 250, height: 130 },
  "lower-reshanta": { x: 120, y: 640, width: 360, height: 130 },
  other: { x: 24, y: 462, width: 110, height: 130 },
};

const spots: Record<keyof typeof boxes, Record<string, Spot>> = {
  verteron: {
    "western-altamia-highland": [12, 22],
    "eastern-altamia-highland": [26, 26],
    "rock-tomb-hill": [14, 38],
    "altamia-canyon": [8, 52],
    "southern-altamia-highland": [20, 62],
    "pilgrim-s-ridge": [38, 14],
    "pilgrim-s-rest": [50, 24],
    "destroyed-temple-site": [32, 42],
    "contaminated-sanctum": [30, 54],
    "kraka-footpath": [58, 10],
    "romlon-s-hideout": [72, 8],
    "drana-cultivation-area": [84, 14],
    "drana-processing-area": [92, 26],
    "nahid-brigade-fortress": [70, 24],
    "scarlet-forest": [82, 38],
    "garden-of-the-illusion-god": [92, 50],
    "illusion-oratory": [78, 54],
    "western-cantas-valley": [46, 38],
    "eastern-cantas-valley": [60, 44],
    "ellun-river-meadow": [52, 56],
    "ellun-river-midstream": [40, 66],
    "ellun-river-marsh": [60, 68],
    "anguish-hill": [26, 74],
    "contaminated-marsh": [46, 84],
    "spirit-s-rest": [12, 78],
    "dundu-s-rest": [6, 66],
    "miros-post": [14, 90],
    "pamos-farm": [32, 90],
    "collapsed-verteron-barrier-tower": [74, 68],
    "destroyed-abyss-gate": [86, 66],
    "verteron-fortress-ruins": [92, 78],
    "krall-command-post": [64, 82],
    "northern-tolbas-forest": [80, 82],
    "southern-tolbas-forest": [72, 94],
    "eastern-tolbas-forest": [90, 92],
    "aullaeu-village": [58, 94],
    "deserter-encampment": [44, 96],
    "forest-of-exiles": [4, 94],
    "night-dew-cave": [22, 98],
    "crimson-isle": [100, 8],
    "eternal-isle": [100, 38],
  },
  altgard: {
    "dredgion-crash-site": [22, 10],
    "calderon-canyon": [42, 8],
    "galorik-s-inspection-area": [62, 10],
    "quai-campsite": [74, 20],
    "sanctum-dumpsite": [88, 12],
    dranactus: [92, 26],
    "munin-s-bridge": [30, 22],
    "battlescar-mound": [48, 24],
    "moslan-forest": [16, 32],
    "purifying-forest": [8, 44],
    "nameless-cemetery": [34, 38],
    "silent-hill": [50, 40],
    "sanctum-outpost": [64, 34],
    "sanctum-outskirts-watch": [78, 36],
    "tranein-highland": [66, 50],
    "tranein-pond": [80, 50],
    "safe-haven": [24, 52],
    crypt: [38, 54],
    uruthumheim: [52, 58],
    "mahindel-river": [94, 44],
    "mahindel-cliff": [88, 62],
    "fafnite-deposit": [76, 68],
    "basfelt-ruins": [12, 62],
    "flauke-legion-outpost": [28, 68],
    "idun-s-lake": [44, 70],
    "western-gribade-highland": [10, 78],
    "southern-gribade-highland": [32, 80],
    "eastern-gribade-highland": [56, 78],
    "amunta-s-hideout": [22, 90],
    "barahta-extermination-unit-outpost": [66, 84],
    "black-claw-village": [84, 78],
    "kumrica-s-cellar": [94, 90],
    "lagta-fortress": [78, 94],
    "impetusium-square": [56, 92],
    "spirit-isle": [4, 98],
    "immortal-isle": [38, 98],
  },
  "middle-reshanta": {
    "steel-titan-s-grave": [50, 10],
    "distorted-old-growth-forest": [18, 46],
    "corroded-heart": [50, 50],
    "contaminated-marsh": [82, 46],
    "eroded-fragment-area": [50, 90],
  },
  "lower-reshanta": {
    "devastated-remnants": [14, 30],
    "reshanta-s-root": [50, 30],
    "black-fragments-area": [86, 30],
    "archipelago-of-siel-s-wings": [32, 80],
    "sulfur-tree-island": [68, 80],
  },
  other: {
    "eltnen-barrier-tower-ruins": [50, 16],
    "nephra-snowfield": [24, 56],
    "patamor-plains": [76, 80],
  },
};

// Dungeons sit beside the zone with their entrance.
const dungeons: Record<string, { zone: string; shift: Spot }> = {
  "dungeons-draupnir": {
    zone: "verteron-garden-of-the-illusion-god",
    shift: [-22, -16],
  },
  "dungeons-krao-cave": {
    zone: "verteron-ellun-river-midstream",
    shift: [-22, 16],
  },
};

const place = (region: keyof typeof boxes, [x, y]: Spot): Spot => {
  const box = boxes[region];

  return [box.x + (box.width * x) / 100, box.y + (box.height * y) / 100];
};

const zonePoints = new Map<string, Spot>(
  Object.entries(spots).flatMap(([region, zones]) =>
    Object.entries(zones).map(([zone, spot]): [string, Spot] => [
      `${region}-${zone}`,
      place(region as keyof typeof boxes, spot),
    ]),
  ),
);

/** Where an area is drawn, in map units. */
export const worldPoints = new Map<string, Spot>([
  ...zonePoints,
  ...Object.entries(dungeons).map(([id, { zone, shift }]): [string, Spot] => {
    const [x, y] = zonePoints.get(zone)!;

    return [id, [x + shift[0], y + shift[1]]];
  }),
]);

/** A rounded landmass wide enough to hold a region's corners. */
function landmass({ x, y, width, height }: Box, phase: number) {
  const steps = 56;
  const points = Array.from({ length: steps }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2;
    const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
    // A squarish ellipse, wobbled so it reads as coast, not a shape.
    const wobble = 1 + 0.045 * Math.sin(3 * angle + phase);
    const px =
      x +
      width / 2 +
      width * 0.58 * wobble * Math.sign(cos) * Math.sqrt(Math.abs(cos));
    const py =
      y +
      height / 2 +
      height * 0.58 * wobble * Math.sign(sin) * Math.sqrt(Math.abs(sin));

    return `${px.toFixed(1)} ${py.toFixed(1)}`;
  });

  return `M${points.join("L")}Z`;
}

export const worldLand = (Object.keys(boxes) as (keyof typeof boxes)[]).map(
  (id, index) => ({
    id,
    path: landmass(boxes[id], index * 1.7),
    // Where the region's name is written, above its coast.
    label: [
      boxes[id].x + boxes[id].width / 2,
      boxes[id].y - boxes[id].height * 0.08 - 16,
    ] as Spot,
  }),
);
