import { useMemo, useState } from "react"

import { formatInt, formatPercent } from "@/lib/format"
import { hueFromKey, shortBadge } from "@/lib/gameData"
import { sortJokers, type JokerSortKey, type JokerStat } from "@/lib/profile"
import { useT, type TFn, type UIText } from "@/lib/uiText"

const SORTS: { key: JokerSortKey; labelKey: keyof UIText }[] = [
  { key: "count", labelKey: "sortMostUsed" },
  { key: "wins", labelKey: "sortMostObservedWins" },
  { key: "winRate", labelKey: "sortHighestObservedWinRate" },
  { key: "order", labelKey: "sortOriginalOrder" },
]

const DEFAULT_LIMIT = 12

function JokerCard({ joker, t }: { joker: JokerStat; t: TFn }) {
  return (
    <article className="joker-card">
      <div
        className="joker-art"
        style={{ ["--jh" as string]: String(hueFromKey(joker.key)) }}
      >
        {joker.image ? (
          <img
            className="joker-img"
            src={joker.image}
            alt={joker.name}
            loading="lazy"
            onError={(event) => {
              const img = event.currentTarget
              img.style.display = "none"
              img.parentElement?.classList.add("art-fallback")
            }}
          />
        ) : null}
        <span className="joker-badge-text" aria-hidden="true">
          {shortBadge(joker.name)}
        </span>
      </div>
      <div className="joker-info">
        <span className="joker-name">{joker.name}</span>
        <span className="joker-count">
          {t("usesTemplate", { n: formatInt(joker.count) })}
        </span>
        <span className="joker-wl">
          <b>{formatInt(joker.observedWins)}W</b> ·{" "}
          <i>{formatInt(joker.observedLosses)}L</i>
        </span>
        <span className="joker-rate">
          {formatPercent(joker.observedWinRate)} {t("observedWinRate")} · #
          {joker.order}
        </span>
        {joker.lowSample ? <span className="flag">{t("lowSample")}</span> : null}
      </div>
    </article>
  )
}

export function JokerHall({ jokers }: { jokers: JokerStat[] }) {
  const t = useT()
  const [sort, setSort] = useState<JokerSortKey>("count")
  const [expanded, setExpanded] = useState(false)

  const sorted = useMemo(() => sortJokers(jokers, sort), [jokers, sort])
  const visible = expanded ? sorted : sorted.slice(0, DEFAULT_LIMIT)

  return (
    <section className="panel panel-pad span-12 enter" aria-label="Joker hall of fame">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("jokerHall")}</h2>
          <p className="section-sub">{t("jokerHallSub")}</p>
        </div>
        <div className="seg">
          {SORTS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={sort === option.key ? "is-active" : ""}
              onClick={() => setSort(option.key)}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="joker-grid">
        {visible.map((joker) => (
          <JokerCard key={joker.key} joker={joker} t={t} />
        ))}
      </div>

      {sorted.length > DEFAULT_LIMIT ? (
        <div style={{ marginTop: "1.1rem", textAlign: "center" }}>
          <button
            className="btn"
            type="button"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded
              ? t("showTop12")
              : t("showAll", { n: formatInt(sorted.length) })}
          </button>
        </div>
      ) : null}
    </section>
  )
}
