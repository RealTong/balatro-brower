import { balatroLocaleData } from "@/lib/balatroLocaleData"
import { challengeNamesByLocale } from "@/lib/challengeNames"

export type Locale = "zh-CN" | "zh-TW" | "en" | "ja" | "ko"

export const locales: Locale[] = ["zh-CN", "zh-TW", "en", "ja", "ko"]

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "en"
  }
  const languages =
    navigator.languages?.length > 0 ? navigator.languages : [navigator.language]
  for (const language of languages) {
    const code = (language || "").toLowerCase()
    if (
      code.startsWith("zh-hant") ||
      code.includes("tw") ||
      code.includes("hk") ||
      code.includes("mo")
    ) {
      return "zh-TW"
    }
    if (code.startsWith("zh")) return "zh-CN"
    if (code.startsWith("ja")) return "ja"
    if (code.startsWith("ko")) return "ko"
    if (code.startsWith("en")) return "en"
  }
  return "en"
}

export type BalatroLocale = {
  dictionary: Record<string, string>
  itemNames: Record<string, string>
  itemNamesByEnglish: Record<string, string>
  pokerHandsByEnglish: Record<string, string>
  pokerHandsByKey: Record<string, string>
  challengeNames: Record<string, string>
}

const parsed = balatroLocaleData as Record<
  Locale,
  Omit<
    BalatroLocale,
    "itemNamesByEnglish" | "pokerHandsByEnglish" | "challengeNames"
  >
>

const cache = new Map<Locale, BalatroLocale>()

export function getBalatroLocale(locale: Locale): BalatroLocale {
  const cached = cache.get(locale)
  if (cached) {
    return cached
  }

  const current = parsed[locale]
  const english = parsed.en
  const itemNamesByEnglish = Object.fromEntries(
    Object.entries(english.itemNames).map(([key, name]) => [
      name,
      current.itemNames[key] || name,
    ])
  )
  const pokerHandsByEnglish = Object.fromEntries(
    Object.entries(english.pokerHandsByKey).map(([key, name]) => [
      name,
      current.pokerHandsByKey[key] || name,
    ])
  )
  const result = {
    ...current,
    itemNamesByEnglish,
    pokerHandsByEnglish,
    challengeNames: challengeNamesByLocale[locale] ?? challengeNamesByLocale.en,
  }

  cache.set(locale, result)
  return result
}
