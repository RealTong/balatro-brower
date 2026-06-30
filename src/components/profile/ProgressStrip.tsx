import { formatInt, formatPercent } from "@/lib/format"
import type { ProgressStat } from "@/lib/profile"
import { useT, type TFn, type UIText } from "@/lib/uiText"

const LABEL_KEYS: Record<string, keyof UIText> = {
  discovered: "collection",
  deck_stakes: "deckStakes",
  joker_stickers: "jokerStickers",
  challenges: "challenges",
}

function statusLabel(stat: ProgressStat, t: TFn): string {
  if (stat.of === 0) return t("noData")
  const remaining = Math.max(0, Math.round(stat.of - stat.tally))
  if (remaining === 0) return t("complete")
  switch (stat.key) {
    case "discovered":
      return t("discovered", { v: formatPercent(stat.ratio) })
    case "deck_stakes":
      return t("stakesToGo", { n: remaining })
    case "joker_stickers":
      return t("stickersLeft", { n: formatInt(remaining) })
    case "challenges":
      return t("challengesToGo", { n: remaining })
    default:
      return formatPercent(stat.ratio)
  }
}

export function ProgressStrip({ stats }: { stats: ProgressStat[] }) {
  const t = useT()
  return (
    <section className="progress-strip enter" aria-label="Collection progress">
      {stats.map((stat) => {
        const gold = stat.key === "challenges" && stat.ratio >= 0.9
        const pct = Math.min(100, Math.round(stat.ratio * 100))
        const labelKey = LABEL_KEYS[stat.key]
        return (
          <div
            key={stat.key}
            className={`panel progress-card${gold ? " is-gold" : ""}`}
          >
            <span className="progress-card-label">
              {labelKey ? t(labelKey) : stat.label}
            </span>
            <span className="progress-card-value">
              {formatInt(stat.tally)} <small>/ {formatInt(stat.of)}</small>
            </span>
            <div
              className="bar-track"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-card-status">{statusLabel(stat, t)}</span>
          </div>
        )
      })}
    </section>
  )
}
