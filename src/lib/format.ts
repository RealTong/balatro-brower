const intFormatter = new Intl.NumberFormat("en-US")

/** Thousands-separated integer, e.g. 48339 -> "48,339". */
export function formatInt(value: number): string {
  if (!Number.isFinite(value)) {
    return "0"
  }
  return intFormatter.format(Math.round(value))
}

/** Group a raw digit string with thousands separators without losing precision. */
export function groupDigits(digits: string): string {
  const negative = digits.startsWith("-")
  const body = negative ? digits.slice(1) : digits
  const clean = body.replace(/^0+(?=\d)/, "")
  const grouped = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return negative ? `-${grouped}` : grouped
}

/**
 * Compact scientific notation for very large scores, e.g.
 * "2005346843675500" -> "2.005e15". Works from a string so we never lose
 * precision on values beyond Number.MAX_SAFE_INTEGER.
 */
export function compactScientificFromDigits(digits: string): string {
  const clean = digits.replace(/^0+(?=\d)/, "")
  if (clean.length <= 1) {
    return clean || "0"
  }
  const exponent = clean.length - 1
  const mantissaDigits = clean.slice(0, 4)
  const lead = mantissaDigits[0]
  const rest = mantissaDigits.slice(1).padEnd(3, "0")
  return `${lead}.${rest}e${exponent}`
}

const SCIENTIFIC_THRESHOLD = 1_000_000_000

/**
 * Format a score that may be enormous. Prefers the raw string representation
 * (passed through from the source JSON) so floating point never degrades the
 * displayed precision.
 */
export function formatScore(value: number, rawDigits?: string): string {
  const digits = normalizeDigits(value, rawDigits)
  const magnitudeDigits = digits.replace("-", "")
  if (magnitudeDigits.replace(/^0+(?=\d)/, "").length >= 10) {
    return (digits.startsWith("-") ? "-" : "") + compactScientificFromDigits(magnitudeDigits)
  }
  if (Number(value) >= SCIENTIFIC_THRESHOLD) {
    return compactScientificFromDigits(magnitudeDigits)
  }
  return groupDigits(digits)
}

/** The full, exact number with thousands separators, for tooltips. */
export function formatScoreExact(value: number, rawDigits?: string): string {
  return groupDigits(normalizeDigits(value, rawDigits))
}

function normalizeDigits(value: number, rawDigits?: string): string {
  if (rawDigits && /^-?\d+$/.test(rawDigits)) {
    return rawDigits
  }
  if (!Number.isFinite(value)) {
    return "0"
  }
  return Math.round(value).toString()
}

/** Percentage with one decimal, e.g. 0.971 -> "97.1%". */
export function formatPercent(ratio: number, digits = 1): string {
  if (!Number.isFinite(ratio)) {
    return "0%"
  }
  return `${(ratio * 100).toFixed(digits)}%`
}

/** Ratio with two decimals; safe against zero denominators. */
export function formatRatio(numerator: number, denominator: number, digits = 2): string {
  if (!denominator) {
    return (0).toFixed(digits)
  }
  return (numerator / denominator).toFixed(digits)
}
