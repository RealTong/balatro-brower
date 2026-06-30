import { useEffect, useMemo, useState } from "react"

import { formatInt, formatPercent } from "@/lib/format"
import { STAKE_COLORS, STAKES, type StakeName } from "@/lib/gameData"
import {
  getFleetAverages,
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

function DeckDrawer({
  deck,
  decks,
  onClose,
  t,
}: {
  deck: DeckStat
  decks: DeckStat[]
  onClose: () => void
  t: TFn
}) {
  const fleet = useMemo(() => getFleetAverages(decks), [decks])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const rateDelta = deck.winRate - fleet.winRate
  const attemptsDelta = deck.attempts - fleet.attempts

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${deck.name} details`}
      >
        <div className="drawer-head">
          <div>
            <div className="kicker">{deck.key}</div>
            <h3 className="drawer-title" style={{ color: deck.accentHex }}>
              {deck.name}
            </h3>
          </div>
          <button className="drawer-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <div className="kv-grid">
            <div className="kv">
              <div className="kv-label">{t("attempts")}</div>
              <div className="kv-value">{formatInt(deck.attempts)}</div>
            </div>
            <div className="kv">
              <div className="kv-label">{t("winRate")}</div>
              <div className="kv-value" style={{ color: deck.accentHex }}>
                {formatPercent(deck.winRate)}
              </div>
            </div>
            <div className="kv">
              <div className="kv-label">{t("wins")}</div>
              <div className="kv-value" style={{ color: "var(--green)" }}>
                {formatInt(deck.wins)}
              </div>
            </div>
            <div className="kv">
              <div className="kv-label">{t("losses")}</div>
              <div className="kv-value" style={{ color: "var(--red)" }}>
                {formatInt(deck.losses)}
              </div>
            </div>
          </div>

          <div>
            <div className="kicker" style={{ marginBottom: "0.6rem" }}>
              {t("stakeBreakdown")}
            </div>
            <div className="stake-table">
              {deck.stakes.map((cell) => (
                <div className="stake-row" key={cell.stake}>
                  <span
                    className="swatch"
                    style={{ background: STAKE_COLORS[cell.stake as StakeName] }}
                  />
                  <span>{cell.stake}</span>
                  <span className="stake-wl">
                    <b>{cell.wins}W</b> · <i>{cell.losses}L</i>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="kicker" style={{ marginBottom: "0.6rem" }}>
              {t("vsFleet")}
            </div>
            <div className="stake-table">
              <div className="stake-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>{t("cmpStake")}</span>
                <span className="stake-wl">
                  {stakeLabel(deck.highestClearedStake, t)}
                </span>
              </div>
              <div className="stake-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>{t("cmpWinRateVs")}</span>
                <span className="stake-wl">
                  <b className={rateDelta >= 0 ? "up" : "down"}>
                    {rateDelta >= 0 ? "+" : ""}
                    {formatPercent(rateDelta)}
                  </b>{" "}
                  · {t("cmpAvg", { v: formatPercent(fleet.winRate) })}
                </span>
              </div>
              <div className="stake-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <span>{t("cmpAttemptsVs")}</span>
                <span className="stake-wl">
                  <b className={attemptsDelta >= 0 ? "up" : "down"}>
                    {attemptsDelta >= 0 ? "+" : ""}
                    {formatInt(attemptsDelta)}
                  </b>{" "}
                  · {t("cmpAvg", { v: formatInt(Math.round(fleet.attempts)) })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export function DeckCollection({ decks }: { decks: DeckStat[] }) {
  const t = useT()
  const [sort, setSort] = useState<DeckSortKey>("order")
  const [openKey, setOpenKey] = useState<string | null>(null)

  const sorted = useMemo(() => sortDecks(decks, sort), [decks, sort])
  const openDeck = decks.find((d) => d.key === openKey) ?? null

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

      {openDeck ? (
        <DeckDrawer
          deck={openDeck}
          decks={decks}
          t={t}
          onClose={() => setOpenKey(null)}
        />
      ) : null}
    </section>
  )
}
