import { useEffect, useMemo, useRef, useState } from "react"
import { toPng } from "html-to-image"

import { Challenges } from "@/components/profile/Challenges"
import { DeckCollection } from "@/components/profile/DeckCollection"
import { Economy } from "@/components/profile/Economy"
import { Hero } from "@/components/profile/Hero"
import { ImportScreen } from "@/components/profile/ImportScreen"
import { JokerHall } from "@/components/profile/JokerHall"
import {
  ConsumablesBoard,
  VouchersBoard,
} from "@/components/profile/Leaderboards"
import { Nav } from "@/components/profile/Nav"
import { ProgressStrip } from "@/components/profile/ProgressStrip"
import { DeckUsageRanking, HandProfile } from "@/components/profile/Rankings"
import { detectLocale, type Locale } from "@/lib/balatroLocale"
import { decompress, processFile } from "@/lib/jkrFile"
import {
  extractBestHandDigits,
  getBalatroLocale,
  getCareer,
  getChallenges,
  getDeckStats,
  getEconomy,
  getHandStats,
  getHighScore,
  getIdentity,
  getJokerStats,
  getProgressStats,
  getUsageStats,
  validateProfile,
  type RawProfile,
} from "@/lib/profile"
import { UITextProvider, useT, type UIText } from "@/lib/uiText"

type Loaded = {
  profile: RawProfile
  bestHandDigits?: string
}

type ErrorCode = keyof UIText | ""

function ProfileApp({
  locale,
  setLocale,
}: {
  locale: Locale
  setLocale: (locale: Locale) => void
}) {
  const t = useT()
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [errorCode, setErrorCode] = useState<ErrorCode>("")
  const [exporting, setExporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  const gameLocale = useMemo(() => getBalatroLocale(locale), [locale])

  async function loadFile(file: File) {
    setErrorCode("")
    try {
      const isJson = /\.json$/i.test(file.name) || file.type.includes("json")

      let profile: RawProfile
      let bestHandDigits: string | undefined

      if (isJson) {
        const text = await file.text()
        const parsed = JSON.parse(text) as unknown
        const result = validateProfile(parsed)
        if (!result.ok) throw new Error(result.error)
        profile = result.profile
        bestHandDigits = extractBestHandDigits(text)
      } else {
        const buffer = new Uint8Array(await file.arrayBuffer())
        const decoded = processFile(buffer) as unknown
        const result = validateProfile(decoded)
        if (!result.ok) throw new Error(result.error)
        profile = result.profile
        try {
          bestHandDigits = extractBestHandDigits(decompress(buffer))
        } catch {
          bestHandDigits = undefined
        }
      }

      setLoaded({ profile, bestHandDigits })
    } catch (cause) {
      console.error(cause)
      if (cause instanceof SyntaxError) {
        setErrorCode("errInvalidJson")
      } else if (
        cause instanceof Error &&
        (cause.message === "not_profile" || cause.message === "not_object")
      ) {
        setErrorCode("errNotProfile")
      } else {
        setErrorCode("errRead")
      }
      setLoaded(null)
    }
  }

  async function handleExport() {
    if (!exportRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        backgroundColor: "#071019",
        cacheBust: true,
      })
      const link = document.createElement("a")
      link.download = "balatro-profile.png"
      link.href = dataUrl
      link.click()
    } catch (cause) {
      console.error(cause)
      setErrorCode("errExport")
    } finally {
      setExporting(false)
    }
  }

  if (!loaded) {
    return (
      <ImportScreen error={errorCode ? t(errorCode) : ""} onFile={loadFile} />
    )
  }

  const { profile, bestHandDigits } = loaded
  const identity = getIdentity(profile, gameLocale)
  const career = getCareer(profile)
  const bestHand = getHighScore(profile, "hand")
  const mostMoney = getHighScore(profile, "most_money")
  const progress = getProgressStats(profile)
  const decks = getDeckStats(profile, gameLocale)
  const hands = getHandStats(profile, gameLocale)
  const jokers = getJokerStats(profile, gameLocale)
  const economy = getEconomy(profile)
  const consumables = getUsageStats(profile.consumeable_usage, gameLocale)
  const vouchers = getUsageStats(profile.voucher_usage, gameLocale)
  const challenges = getChallenges(profile, gameLocale)

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />

      <input
        ref={inputRef}
        type="file"
        accept=".json,.jkr,.jks,application/json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.item(0)
          if (file) void loadFile(file)
          event.currentTarget.value = ""
        }}
      />

      <Nav
        playerName={identity.name}
        profileSlot={`${t("profile")} ${identity.name}`}
        locale={locale}
        onLocaleChange={setLocale}
        onImport={() => inputRef.current?.click()}
        onExport={handleExport}
        exporting={exporting}
      />

      <main className="shell" ref={exportRef}>
        <Hero
          identity={identity}
          career={career}
          bestHand={bestHand}
          bestHandDigits={bestHandDigits}
          mostMoney={mostMoney}
        />

        <ProgressStrip stats={progress} />

        <DeckCollection decks={decks} />

        <div className="grid12">
          <DeckUsageRanking decks={decks} />
          <HandProfile playerName={identity.name} hands={hands} />
        </div>

        <JokerHall jokers={jokers} />

        <div className="grid12">
          <Economy economy={economy} />
          <Challenges challenges={challenges} />
        </div>

        <div className="grid12">
          <ConsumablesBoard consumables={consumables} />
          <VouchersBoard vouchers={vouchers} />
        </div>
      </main>
    </div>
  )
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <UITextProvider locale={locale}>
      <ProfileApp locale={locale} setLocale={setLocale} />
    </UITextProvider>
  )
}

export default App
