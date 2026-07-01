import { useMemo, useState } from "react"

import { formatInt, formatPercent } from "@/lib/format"
import { STAKE_COLORS, STAKES, type StakeName } from "@/lib/gameData"
import {
  sortDecks,
  type DeckSortKey,
  type DeckStat,
} from "@/lib/profile"
import { useT, type TFn, type UIText } from "@/lib/uiText"

const SORTS: { key: DeckSortKey; labelKey: keyof UIText }[] = [
  { key: "order", labelKey: "sortGameOrder" },
  { key: "attempts", labelKey: "sortMostPlayed" },
  { key: "wins", labelKey: "sortMostWins" },
  { key: "winRate", labelKey: "sortHighestWinRate" },
  { key: "stake", labelKey: "sortHighestStake" },
]

function stakeLabel(index: number, t: TFn): string {
  return index >= 0 ? STAKES[index] : t("none")
}

function StakeChips({ deck }: { deck: DeckStat }) {
  return (
    <div className="stake-grid" aria-hidden="true">
      {deck.stakes.map((cell) => (
        <span
          key={cell.stake}
          className={`stake-cell ${cell.status}`}
          style={{ ["--st" as string]: STAKE_COLORS[cell.stake as StakeName] }}
          title={`${cell.stake} — ${cell.wins}W / ${cell.losses}L`}
        />
      ))}
    </div>
  )
}

function DeckCard({
  deck,
  onOpen,
  t,
}: {
  deck: DeckStat
  onOpen: () => void
  t: TFn
}) {
  return (
    <button
      type="button"
      className="deck-card"
      style={{ ["--accent" as string]: deck.accentHex }}
      onClick={onOpen}
    >
      <div className="deck-card-top">
        <div>
          <div className="deck-card-name">{deck.name}</div>
          <div className="deck-card-code">{deck.key}</div>
        </div>
        <span className="deck-card-order">#{deck.order}</span>
      </div>

      <div className="deck-best-stake">
        <span
          className="dot"
          style={{
            background:
              deck.highestClearedStake >= 0
                ? STAKE_COLORS[STAKES[deck.highestClearedStake]]
                : "rgba(255,255,255,0.15)",
          }}
        />
        {t("best")}: {stakeLabel(deck.highestClearedStake, t)}
      </div>

      <StakeChips deck={deck} />

      <div className="deck-card-stats">
        <div className="deck-mini">
          <span className="deck-mini-value">{formatInt(deck.attempts)}</span>
          <span className="deck-mini-label">{t("attempts")}</span>
        </div>
        <div className="deck-mini">
          <span className="deck-mini-value">{formatInt(deck.wins)}</span>
          <span className="deck-mini-label">{t("wins")}</span>
        </div>
        <div className="deck-mini">
          <span className="deck-mini-value accent">
            {formatPercent(deck.winRate)}
          </span>
          <span className="deck-mini-label">{t("winRate")}</span>
        </div>
        <div className="deck-mini">
          <span className="deck-mini-value">{formatInt(deck.losses)}</span>
          <span className="deck-mini-label">{t("losses")}</span>
        </div>
      </div>
    </button>
  )
}

export function DeckCollection({ decks }: { decks: DeckStat[] }) {
  const t = useT()
  const [sort, setSort] = useState<DeckSortKey>("order")
  const [, setOpenKey] = useState<string | null>(null)

  const sorted = useMemo(() => sortDecks(decks, sort), [decks, sort])

  return (
    <section className="panel panel-pad span-12 enter" aria-label="Deck collection">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("deckCollection")}</h2>
          <p className="section-sub">
            {t("deckCollectionSub", { n: decks.length })}
          </p>
        </div>
        <div className="deck-toolbar">
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
      </div>

      <div className="deck-grid">
        {sorted.map((deck) => (
          <DeckCard
            key={deck.key}
            deck={deck}
            t={t}
            onOpen={() => setOpenKey(deck.key)}
          />
        ))}
      </div>
    </section>
  )
}
