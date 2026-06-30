import { BarList, type BarItem } from "@/components/profile/BarList"
import { formatInt, formatPercent } from "@/lib/format"
import type { DeckStat, HandStat } from "@/lib/profile"
import { useT, type TFn } from "@/lib/uiText"

export function DeckUsageRanking({ decks }: { decks: DeckStat[] }) {
  const t = useT()
  const ranked = [...decks]
    .filter((d) => d.attempts > 0)
    .sort((a, b) => b.attempts - a.attempts)

  const items: BarItem[] = ranked.map((deck) => ({
    key: deck.key,
    name: deck.name,
    value: deck.attempts,
    color: deck.accentHex,
    title: `${deck.name} — ${formatInt(deck.wins)}W / ${formatInt(
      deck.losses
    )}L · ${formatPercent(deck.winRate)}`,
  }))

  return (
    <section className="panel panel-pad span-7 enter" aria-label="Deck usage ranking">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("deckUsage")}</h2>
          <p className="section-sub">{t("deckUsageSub")}</p>
        </div>
      </div>
      <BarList items={items} />
    </section>
  )
}

function handSentence(playerName: string, hands: HandStat[], t: TFn): string {
  const played = hands.filter((h) => h.count > 0)
  const [a, b, c] = played
  if (played.length === 0) {
    return t("handsSentenceNone", { name: playerName })
  }
  if (played.length === 1) {
    return t("handsSentence1", { name: playerName, a: a.name })
  }
  if (played.length === 2) {
    return t("handsSentence2", { name: playerName, a: a.name, b: b.name })
  }
  return t("handsSentence3", {
    name: playerName,
    a: a.name,
    b: b.name,
    c: c.name,
  })
}

export function HandProfile({
  playerName,
  hands,
}: {
  playerName: string
  hands: HandStat[]
}) {
  const t = useT()
  const played = hands.filter((h) => h.count > 0)
  const total = played.reduce((sum, h) => sum + h.count, 0)
  const most = played[0]
  const rarest = played[played.length - 1]

  const items: BarItem[] = played.map((hand) => ({
    key: hand.key,
    name: hand.name,
    value: hand.count,
    color: "var(--blue)",
    title: `${hand.name} — ${formatInt(hand.count)} (${formatPercent(
      total > 0 ? hand.count / total : 0
    )})`,
  }))

  return (
    <section className="panel panel-pad span-5 enter" aria-label="Hand profile">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("handProfile")}</h2>
        </div>
      </div>

      <p className="summary-line">{handSentence(playerName, hands, t)}</p>

      <BarList items={items} />

      <div className="tag-row">
        <div className="tag">
          <div className="tag-label">{t("mostPlayed")}</div>
          <div className="tag-value">
            {most ? most.name : "—"}
            {most ? <small> · {formatInt(most.count)}</small> : null}
          </div>
        </div>
        <div className="tag">
          <div className="tag-label">{t("rarestPlayed")}</div>
          <div className="tag-value">
            {rarest ? rarest.name : "—"}
            {rarest ? <small> · {formatInt(rarest.count)}</small> : null}
          </div>
        </div>
        <div className="tag">
          <div className="tag-label">{t("totalHands")}</div>
          <div className="tag-value">{formatInt(total)}</div>
        </div>
      </div>
    </section>
  )
}
