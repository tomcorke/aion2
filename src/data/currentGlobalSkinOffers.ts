import type {
  SkinCatalogueEntry,
  SkinCatalogueKind,
  SkinCatalogueListedPrice,
} from "./skinCatalogueTypes.ts";
import { sources, type SourceId } from "./sources.ts";

type OfferSpec = {
  id: string;
  name: string;
  kind: SkinCatalogueKind;
  category: SkinCatalogueEntry["category"];
  pieceNames: string[];
  sourceId: SourceId;
  notice: string;
  endNote: string;
  price?: SkinCatalogueListedPrice;
  limit?: { quantity: 1; scope: "character"; appliesTo: "piece" };
  detail?: string;
};

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeOffer({
  id,
  name,
  kind,
  category,
  pieceNames,
  sourceId,
  notice,
  endNote,
  price,
  limit,
  detail,
}: OfferSpec): SkinCatalogueEntry {
  const pieces = pieceNames.map((pieceName) => ({
    id: `${id}-${slug(pieceName)}`,
    name: pieceName,
  }));
  const source = sources[sourceId];

  if (!("url" in source) || !source.url)
    throw new Error(`The source ${sourceId} needs a public URL.`);

  return {
    id,
    name,
    kind,
    category,
    aliases: [],
    pieces,
    sources: ["global-offer"],
    acquisitions: [
      {
        id: "global-offer",
        source: "global-offer",
        name: notice,
        pieceIds: pieces.map(({ id: pieceId }) => pieceId),
        ...(price ? { listedPrice: price } : {}),
        ...(limit ? { limit } : {}),
        condition: [
          `The notice lists this offer through its stated window. ${endNote}`,
          detail,
          "This is dated notice information, not a live check of current shop stock.",
        ]
          .filter(Boolean)
          .join(" "),
        sourceIds: [sourceId],
      },
    ],
    unknownPieceIds: [],
    attribution: [
      {
        name: source.name,
        url: source.url,
      },
    ],
  };
}

const outfitSlots = [
  "Breastplate",
  "Greaves",
  "Helm",
  "Gloves",
  "Boots",
  "Cloak",
];

const fivePieceOutfitSlots = outfitSlots.slice(0, 5);

const october13 = {
  sourceId: "ncPetOffers13Oct",
  notice: "Global skin offers · 13 October",
  endNote:
    "The notice gives the end as before maintenance on 24 November PST / 25 November CET.",
} as const;

const october28 = {
  sourceId: "ncPetOffers28Oct",
  notice: "Global skin offers · 28 October",
  endNote:
    "The notice gives the end as before maintenance on 11 November CET and labels the end time PST.",
} as const;

function outfits(
  names: { id: string; name: string; slots: string[] }[],
  offer: typeof october13 | typeof october28,
): OfferSpec[] {
  return names.map(({ id, name, slots }) => ({
    ...offer,
    id,
    name,
    kind: "costume",
    category: "outfit",
    pieceNames: slots,
    price: { amount: 29.99, currency: "USD", unit: "set" },
    detail:
      "The $29.99 set price is a PURPLE Store reference and can vary by store.",
  }));
}

function singles(
  offer: typeof october13 | typeof october28,
  kind: "accessory" | "vanity",
  names: { id: string; name: string; piece: string; price?: number }[],
): OfferSpec[] {
  return names.map(({ id, name, piece, price }) => ({
    ...offer,
    id,
    name,
    kind,
    category: "accessory",
    pieceNames: [piece],
    ...(price === undefined
      ? {}
      : {
          price: {
            amount: price,
            currency: "Quna" as const,
            unit: "piece" as const,
          },
        }),
  }));
}

const offers: OfferSpec[] = [
  ...outfits(
    [
      { id: "monarch-of-blood", name: "Monarch of Blood", slots: outfitSlots },
      {
        id: "midnight-witch",
        name: "Midnight Witch",
        slots: fivePieceOutfitSlots,
      },
      {
        id: "midnight-slasher",
        name: "Midnight Slasher",
        slots: fivePieceOutfitSlots,
      },
    ],
    october13,
  ),
  {
    ...october13,
    id: "spider-wings-offer",
    name: "Spider Wings",
    kind: "wing",
    category: "wing",
    pieceNames: ["Spider Wings"],
    price: { amount: 19.99, currency: "USD", unit: "piece" },
    detail:
      "The $19.99 price is a PURPLE Store reference and can vary by store. The notice's product table says once per character; a separate note says once per server and level 10+. The purchase cap is unresolved and is not shown as a limit.",
  },
  ...singles(october13, "vanity", [
    { id: "dapper-o-lantern", name: "Dapper-O'-Lantern", piece: "Headwear" },
    { id: "jack-o-lantern", name: "Jack-O'-Lantern", piece: "Headwear" },
    { id: "face-bandages", name: "Face Bandages", piece: "Facewear" },
    { id: "frankenstein-bolts", name: "Frankenstein Bolts", piece: "Facewear" },
    {
      id: "tears-of-blood",
      name: "Tears of Blood",
      piece: "Decor",
      price: 300,
    },
    {
      id: "clown-facepaint",
      name: "Clown Facepaint",
      piece: "Decor",
      price: 300,
    },
    { id: "pumpkin-clown", name: "Pumpkin Clown", piece: "Decor", price: 300 },
    {
      id: "red-scar-facepaint",
      name: "Red Scar Facepaint",
      piece: "Decor",
      price: 300,
    },
    { id: "death-mask", name: "Death Mask", piece: "Decor", price: 300 },
    {
      id: "black-cat-facepaint",
      name: "Black Cat Facepaint",
      piece: "Decor",
      price: 300,
    },
    { id: "vampire-night", name: "Vampire Night", piece: "Decor", price: 300 },
    { id: "ghost-tattoo", name: "Ghost Tattoo", piece: "Decor", price: 300 },
    { id: "pumpkin-cutie", name: "Pumpkin Cutie", piece: "Decor", price: 300 },
    { id: "dracula-fangs", name: "Dracula Fangs", piece: "Decor", price: 300 },
    {
      id: "slashers-muzzle",
      name: "Slasher's Muzzle",
      piece: "Decor",
      price: 300,
    },
  ]),
  ...outfits(
    [
      {
        id: "vulpine-sunshower",
        name: "Vulpine Sunshower",
        slots: outfitSlots,
      },
      {
        id: "no-nonsense-maid",
        name: "No-Nonsense Maid",
        slots: fivePieceOutfitSlots,
      },
    ],
    october28,
  ),
  {
    ...october28,
    id: "maid-ribbon-wings",
    name: "Maid Ribbon Wings",
    kind: "wing",
    category: "wing",
    pieceNames: ["Maid Ribbon Wings"],
    price: { amount: 19.99, currency: "USD", unit: "piece" },
    limit: { quantity: 1, scope: "character", appliesTo: "piece" },
    detail:
      "The $19.99 price is a PURPLE Store reference and can vary by store.",
  },
  ...singles(october28, "vanity", [
    { id: "black-crow-mask", name: "Black Crow Mask", piece: "Headwear" },
    { id: "dark-maid-hairband", name: "Dark Maid Hairband", piece: "Headwear" },
    {
      id: "red-devil-glasses",
      name: "Red Devil Glasses",
      piece: "Eyewear",
      price: 300,
    },
    {
      id: "silver-line-glasses",
      name: "Silver Line Glasses",
      piece: "Eyewear",
      price: 300,
    },
    {
      id: "silver-face-chain",
      name: "Silver Face Chain",
      piece: "Eyewear",
      price: 300,
    },
  ]),
  ...singles(october28, "accessory", [
    {
      id: "soaring-earrings",
      name: "Soaring Earrings",
      piece: "Earrings",
      price: 300,
    },
    {
      id: "soaring-necklace",
      name: "Soaring Necklace",
      piece: "Necklace",
      price: 300,
    },
    {
      id: "riders-earrings",
      name: "Rider's Earrings",
      piece: "Earrings",
      price: 300,
    },
    {
      id: "riders-necklace",
      name: "Rider's Necklace",
      piece: "Necklace",
      price: 300,
    },
    {
      id: "midnight-teatime-earrings",
      name: "Midnight Teatime Earrings",
      piece: "Earrings",
      price: 300,
    },
    {
      id: "midnight-teatime-necklace",
      name: "Midnight Teatime Necklace",
      piece: "Necklace",
      price: 300,
    },
  ]),
];

export const currentGlobalSkinOfferEntries = offers.map(makeOffer);
