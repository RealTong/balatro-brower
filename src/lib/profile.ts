import {
  CHALLENGES,
  STAKES,
  deckAccentHex,
  deckAccentToken,
  humanizeId,
  wikiImageUrl,
} from "@/lib/gameData"
import { getBalatroLocale, type BalatroLocale, type Locale } from "@/lib/balatroLocale"

export type RawProfile = Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

/** Sum numeric values from an array or object, ignoring null / non-numbers. */
export function sumNumericValues(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce<number>((total, item) => total + asNumber(item), 0)
  }
  if (isRecord(value)) {
    return Object.values(value).reduce<number>(
      (total, item) => total + asNumber(item),
      0
    )
  }
  return 0
}

/** Normalize a wins/losses field (array, or empty {}) into a number[]. */
function toStakeArray(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.map((item) => asNumber(item))
  }
  return []
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ParseErrorCode = "not_object" | "not_profile"

export type ParseResult =
  | { ok: true; profile: RawProfile; bestHandDigits?: string }
  | { ok: false; error: ParseErrorCode }

const PROFILE_SIGNAL_KEYS = [
  "career_stats",
  "deck_usage",
  "high_scores",
  "progress",
  "joker_usage",
]

export function validateProfile(value: unknown): ParseResult {
  if (!isRecord(value)) {
    return { ok: false, error: "not_object" }
  }
  const hasSignal = PROFILE_SIGNAL_KEYS.some((key) => key in value)
  if (!hasSignal) {
    return { ok: false, error: "not_profile" }
  }
  return { ok: true, profile: value }
}

/** Pull the exact best-hand digit string out of raw source text. */
export function extractBestHandDigits(rawText: string): string | undefined {
  const json = rawText.match(/"hand"\s*:\s*\{\s*"amt"\s*:\s*(-?\d+)/)
  if (json) {
    return json[1]
  }
  const lua = rawText.match(/\["hand"\]\s*=\s*\{\s*\["amt"\]\s*=\s*(-?\d+)/)
  if (lua) {
    return lua[1]
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Career / records
// ---------------------------------------------------------------------------

export type CareerSummary = {
  wins: number
  losses: number
  attempts: number
  winRate: number
}

export function getCareer(profile: RawProfile): CareerSummary {
  const stats = asRecord(profile.career_stats)
  const wins = asNumber(stats?.c_wins)
  const losses = asNumber(stats?.c_losses)
  const attempts = wins + losses
  return {
    wins,
    losses,
    attempts,
    winRate: attempts > 0 ? wins / attempts : 0,
  }
}

export type HighScore = {
  key: string
  amount: number
  total: number
  rawDigits?: string
}

export function getHighScore(profile: RawProfile, key: string): HighScore {
  const scores = asRecord(profile.high_scores)
  const entry = asRecord(scores?.[key])
  return {
    key,
    amount: asNumber(entry?.amt),
    total: asNumber(entry?.tot),
  }
}

// ---------------------------------------------------------------------------
// Progress strip
// ---------------------------------------------------------------------------

export type ProgressStat = {
  key: string
  label: string
  tally: number
  of: number
  ratio: number
}

function progressOf(profile: RawProfile, key: string, label: string): ProgressStat {
  const progress = asRecord(profile.progress)
  const entry = asRecord(progress?.[key])
  const tally = asNumber(entry?.tally)
  const of = asNumber(entry?.of)
  return { key, label, tally, of, ratio: of > 0 ? tally / of : 0 }
}

export function getProgressStats(profile: RawProfile): ProgressStat[] {
  return [
    progressOf(profile, "discovered", "Collection"),
    progressOf(profile, "deck_stakes", "Deck Stakes"),
    progressOf(profile, "joker_stickers", "Joker Stickers"),
    progressOf(profile, "challenges", "Challenges"),
  ]
}

// ---------------------------------------------------------------------------
// Decks
// ---------------------------------------------------------------------------

export type StakeCell = {
  stake: string
  wins: number
  losses: number
  status: "cleared" | "attempted" | "untried"
}

export type DeckStat = {
  key: string
  name: string
  order: number
  wins: number
  losses: number
  attempts: number
  winRate: number
  highestClearedStake: number // index into STAKES, -1 if none
  stakes: StakeCell[]
  accentToken: string
  accentHex: string
}

export function getDeckStats(
  profile: RawProfile,
  locale: BalatroLocale
): DeckStat[] {
  const decks = asRecord(profile.deck_usage)
  if (!decks) {
    return []
  }

  return Object.entries(decks).map(([key, value]) => {
    const item = asRecord(value)
    const winsArr = toStakeArray(item?.wins)
    const lossesArr = toStakeArray(item?.losses)
    const wins = winsArr.reduce((a, b) => a + b, 0)
    const losses = lossesArr.reduce((a, b) => a + b, 0)
    const attempts = wins + losses

    let highestClearedStake = -1
    for (let i = 0; i < winsArr.length; i += 1) {
      if (winsArr[i] > 0) {
        highestClearedStake = i
      }
    }

    const stakes: StakeCell[] = STAKES.map((stake, i) => {
      const w = winsArr[i] ?? 0
      const l = lossesArr[i] ?? 0
      const status: StakeCell["status"] =
        w > 0 ? "cleared" : l > 0 ? "attempted" : "untried"
      return { stake, wins: w, losses: l, status }
    })

    return {
      key,
      name: locale.itemNames[key] || humanizeId(key),
      order: asNumber(item?.order),
      wins,
      losses,
      attempts,
      winRate: attempts > 0 ? wins / attempts : 0,
      highestClearedStake,
      stakes,
      accentToken: deckAccentToken(key),
      accentHex: deckAccentHex(key),
    }
  })
}

export type DeckSortKey =
  | "order"
  | "attempts"
  | "wins"
  | "winRate"
  | "stake"

export function sortDecks(decks: DeckStat[], sort: DeckSortKey): DeckStat[] {
  const copy = [...decks]
  switch (sort) {
    case "attempts":
      return copy.sort((a, b) => b.attempts - a.attempts || a.order - b.order)
    case "wins":
      return copy.sort((a, b) => b.wins - a.wins || a.order - b.order)
    case "winRate":
      return copy.sort(
        (a, b) => b.winRate - a.winRate || b.attempts - a.attempts
      )
    case "stake":
      return copy.sort(
        (a, b) =>
          b.highestClearedStake - a.highestClearedStake ||
          b.winRate - a.winRate
      )
    case "order":
    default:
      return copy.sort((a, b) => a.order - b.order)
  }
}

export type FleetAverages = {
  attempts: number
  wins: number
  winRate: number
}

export function getFleetAverages(decks: DeckStat[]): FleetAverages {
  const played = decks.filter((d) => d.attempts > 0)
  if (played.length === 0) {
    return { attempts: 0, wins: 0, winRate: 0 }
  }
  const attempts = played.reduce((a, d) => a + d.attempts, 0) / played.length
  const wins = played.reduce((a, d) => a + d.wins, 0) / played.length
  const winRate = played.reduce((a, d) => a + d.winRate, 0) / played.length
  return { attempts, wins, winRate }
}

// ---------------------------------------------------------------------------
// Hands
// ---------------------------------------------------------------------------

export type HandStat = {
  key: string
  name: string
  count: number
}

export function getHandStats(
  profile: RawProfile,
  locale: BalatroLocale
): HandStat[] {
  const hands = asRecord(profile.hand_usage)
  if (!hands) {
    return []
  }
  return Object.entries(hands)
    .map(([key, value]) => {
      const item = asRecord(value)
      const display = asString(item?.order)
      const name =
        (display && locale.pokerHandsByEnglish[display]) ||
        locale.pokerHandsByKey[display] ||
        display ||
        humanizeId(key)
      return { key, name, count: asNumber(item?.count) }
    })
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// Jokers
// ---------------------------------------------------------------------------

export type JokerStat = {
  key: string
  name: string
  image?: string
  order: number
  count: number
  observedWins: number
  observedLosses: number
  observedWinRate: number
  lowSample: boolean
}

const LOW_SAMPLE_THRESHOLD = 10

export function getJokerStats(
  profile: RawProfile,
  locale: BalatroLocale
): JokerStat[] {
  const jokers = asRecord(profile.joker_usage)
  if (!jokers) {
    return []
  }
  const english = getBalatroLocale("en")
  return Object.entries(jokers).map(([key, value]) => {
    const item = asRecord(value)
    const observedWins = sumNumericValues(item?.wins)
    const observedLosses = sumNumericValues(item?.losses)
    const observed = observedWins + observedLosses
    return {
      key,
      name: locale.itemNames[key] || humanizeId(key),
      image: wikiImageUrl(english.itemNames[key]),
      order: asNumber(item?.order),
      count: asNumber(item?.count),
      observedWins,
      observedLosses,
      observedWinRate: observed > 0 ? observedWins / observed : 0,
      lowSample: observed < LOW_SAMPLE_THRESHOLD,
    }
  })
}

export type JokerSortKey = "count" | "wins" | "winRate" | "order"

export function sortJokers(jokers: JokerStat[], sort: JokerSortKey): JokerStat[] {
  const copy = [...jokers]
  switch (sort) {
    case "wins":
      return copy.sort((a, b) => b.observedWins - a.observedWins || b.count - a.count)
    case "winRate":
      return copy.sort(
        (a, b) =>
          b.observedWinRate - a.observedWinRate ||
          b.observedWins + b.observedLosses - (a.observedWins + a.observedLosses)
      )
    case "order":
      return copy.sort((a, b) => a.order - b.order)
    case "count":
    default:
      return copy.sort((a, b) => b.count - a.count || a.order - b.order)
  }
}

// ---------------------------------------------------------------------------
// Generic usage (consumables / vouchers)
// ---------------------------------------------------------------------------

export type UsageStat = {
  key: string
  name: string
  image?: string
  count: number
}

export function getUsageStats(
  source: unknown,
  locale: BalatroLocale
): UsageStat[] {
  const record = asRecord(source)
  if (!record) {
    return []
  }
  const english = getBalatroLocale("en")
  return Object.entries(record)
    .map(([key, value]) => {
      const item = asRecord(value)
      return {
        key,
        name: locale.itemNames[key] || humanizeId(key),
        image: wikiImageUrl(english.itemNames[key]),
        count: asNumber(item?.count),
      }
    })
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// Economy
// ---------------------------------------------------------------------------

export type EconomyStat = { key: string; value: number; money?: boolean }

export type EconomySummary = {
  blocks: EconomyStat[]
  netDollarDifference: number
  signals: { key: string; value: string }[]
}

export function getEconomy(profile: RawProfile): EconomySummary {
  const s = asRecord(profile.career_stats) ?? {}
  const n = (key: string) => asNumber(s[key])

  const earned = n("c_dollars_earned")
  const spent = n("c_shop_dollars_spent")
  const rounds = n("c_rounds")
  const cardsPlayed = n("c_cards_played")
  const cardsDiscarded = n("c_cards_discarded")
  const handsPlayed = n("c_hands_played")
  const rerolls = n("c_shop_rerolls")

  const netDollarDifference = earned - spent

  const blocks: EconomyStat[] = [
    { key: "dollarsEarned", value: earned, money: true },
    { key: "shopDollarsSpent", value: spent, money: true },
    { key: "netRetained", value: netDollarDifference, money: true },
    { key: "shopRerolls", value: rerolls },
    { key: "jokersSold", value: n("c_jokers_sold") },
    { key: "cardsSold", value: n("c_cards_sold") },
    { key: "vouchersBought", value: n("c_vouchers_bought") },
    { key: "tarotBought", value: n("c_tarots_bought") },
    { key: "planetBought", value: n("c_planets_bought") },
    { key: "cardsPlayed", value: cardsPlayed },
    { key: "cardsDiscarded", value: cardsDiscarded },
  ]

  const rerollsPerRound = rounds > 0 ? rerolls / rounds : 0
  const discardRate =
    cardsPlayed + cardsDiscarded > 0
      ? cardsDiscarded / (cardsPlayed + cardsDiscarded)
      : 0
  const cardsPerHand = handsPlayed > 0 ? cardsPlayed / handsPlayed : 0

  const signals = [
    { key: "rerollsPerRound", value: rerollsPerRound.toFixed(2) },
    { key: "discardRate", value: `${(discardRate * 100).toFixed(1)}%` },
    { key: "cardsPerHand", value: cardsPerHand.toFixed(2) },
  ]

  return { blocks, netDollarDifference, signals }
}

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

export type ChallengeStat = { id: string; name: string; completed: boolean }

export type ChallengeSummary = {
  items: ChallengeStat[]
  completed: number
  total: number
}

export function getChallenges(
  profile: RawProfile,
  locale: BalatroLocale
): ChallengeSummary {
  const progress = asRecord(profile.challenge_progress)
  const completedMap = asRecord(progress?.completed) ?? {}
  const progressEntry = asRecord(asRecord(profile.progress)?.challenges)

  const challengeName = (id: string, fallback?: string) =>
    locale.challengeNames[id] || fallback || humanizeId(id)

  const ids = new Set(CHALLENGES.map((c) => c.id))
  const items: ChallengeStat[] = CHALLENGES.map((c) => ({
    id: c.id,
    name: challengeName(c.id, c.name),
    completed: completedMap[c.id] === true,
  }))

  // Include any completed challenges not in the canonical list (e.g. mods).
  for (const id of Object.keys(completedMap)) {
    if (!ids.has(id) && completedMap[id] === true) {
      items.push({ id, name: challengeName(id), completed: true })
    }
  }

  const completedFromProgress = asNumber(progressEntry?.tally)
  const totalFromProgress = asNumber(progressEntry?.of)
  const completedCount = items.filter((i) => i.completed).length

  return {
    items,
    completed: completedFromProgress || completedCount,
    total: totalFromProgress || items.length,
  }
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export type Identity = {
  name: string
  deck: string
  stake: number
  stakeName: string
}

export function getIdentity(
  profile: RawProfile,
  locale: BalatroLocale
): Identity {
  const memory = asRecord(profile.MEMORY)
  const deckName = asString(memory?.deck)
  const stake = asNumber(memory?.stake ?? profile.stake)
  return {
    name: asString(profile.name) || "P1",
    deck: locale.itemNamesByEnglish[deckName] || deckName || "-",
    stake,
    stakeName: STAKES[stake - 1] ?? `Stake ${stake}`,
  }
}

export { getBalatroLocale }
export type { BalatroLocale, Locale }
