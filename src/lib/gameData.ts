/**
 * Static Balatro reference data. None of this is player-specific; it only maps
 * the codes found inside a save to human-readable, official game vocabulary.
 */

export const STAKES = [
  "White",
  "Red",
  "Green",
  "Black",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
] as const

export type StakeName = (typeof STAKES)[number]

/** Chip colors used for the per-stake mini grid. */
export const STAKE_COLORS: Record<StakeName, string> = {
  White: "#f5eddf",
  Red: "#ef5350",
  Green: "#52c98b",
  Black: "#8a93a6",
  Blue: "#4c9aff",
  Purple: "#a879ff",
  Orange: "#f0883e",
  Gold: "#f2c14e",
}

type AccentToken = "red" | "blue" | "gold" | "green" | "purple" | "cream" | "orange"

export const ACCENT_HEX: Record<AccentToken, string> = {
  red: "#ef5350",
  blue: "#4c9aff",
  gold: "#f2c14e",
  green: "#52c98b",
  purple: "#a879ff",
  cream: "#f5eddf",
  orange: "#f0883e",
}

/** Deck code -> accent token, themed after each deck's identity in game. */
const DECK_ACCENTS: Record<string, AccentToken> = {
  b_red: "red",
  b_blue: "blue",
  b_yellow: "gold",
  b_green: "green",
  b_black: "purple",
  b_magic: "purple",
  b_nebula: "blue",
  b_ghost: "purple",
  b_abandoned: "cream",
  b_checkered: "red",
  b_zodiac: "gold",
  b_painted: "blue",
  b_anaglyph: "red",
  b_plasma: "orange",
  b_erratic: "purple",
  b_challenge: "gold",
}

export function deckAccentToken(deckKey: string): AccentToken {
  return DECK_ACCENTS[deckKey] ?? "cream"
}

export function deckAccentHex(deckKey: string): string {
  return ACCENT_HEX[deckAccentToken(deckKey)]
}

/**
 * Official challenge list with canonical English names, in game order.
 * Used so the grid can show all 20 challenges (including incomplete ones)
 * with real names rather than fabricated translations.
 */
export const CHALLENGES: { id: string; name: string }[] = [
  { id: "c_omelette_1", name: "The Omelette" },
  { id: "c_city_1", name: "15 Minute City" },
  { id: "c_rich_1", name: "Rich get Richer" },
  { id: "c_knife_1", name: "On a Knife's Edge" },
  { id: "c_xray_1", name: "X-ray Vision" },
  { id: "c_mad_world_1", name: "Mad World" },
  { id: "c_luxury_1", name: "Luxury Tax" },
  { id: "c_non_perishable_1", name: "Non-Perishable" },
  { id: "c_medusa_1", name: "Medusa" },
  { id: "c_double_nothing_1", name: "Double or Nothing" },
  { id: "c_typecast_1", name: "Typecast" },
  { id: "c_inflation_1", name: "Inflation" },
  { id: "c_bram_poker_1", name: "Bram Poker" },
  { id: "c_fragile_1", name: "Fragile" },
  { id: "c_monolith_1", name: "Monolith" },
  { id: "c_blast_off_1", name: "Blast Off" },
  { id: "c_five_card_1", name: "Five-Card Draw" },
  { id: "c_golden_needle_1", name: "Golden Needle" },
  { id: "c_cruelty_1", name: "Cruelty" },
  { id: "c_jokerless_1", name: "Jokerless" },
]

/** Turn an arbitrary id like "c_double_nothing_1" into "Double Nothing". */
export function humanizeId(id: string): string {
  return id
    .replace(/^[a-z]_/, "")
    .replace(/_\d+$/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Compact two-or-three letter badge for a joker placeholder card. */
export function shortBadge(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return "??"
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Build a balatrowiki.org image URL from an English item name.
 * e.g. "Blue Joker" -> https://balatrowiki.org/images/Blue_Joker.png
 * The wiki serves these with `access-control-allow-origin: *`, so they are
 * safe to embed and survive html-to-image export. Missing images fall back to
 * the CSS placeholder via the element's onError handler.
 */
export function wikiImageUrl(englishName: string | undefined): string | undefined {
  if (!englishName) {
    return undefined
  }
  const file = englishName.trim().replace(/\s+/g, "_")
  return `https://balatrowiki.org/images/${encodeURIComponent(file)}.png`
}

/** Deterministic hue from a string, for joker placeholder tints. */
export function hueFromKey(key: string): number {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 360
  }
  return hash
}
