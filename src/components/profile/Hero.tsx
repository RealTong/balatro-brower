import { formatPercent, formatScore, formatScoreExact, formatInt } from "@/lib/format"
import type { CareerSummary, HighScore, Identity } from "@/lib/profile"
import { useT } from "@/lib/uiText"

type HeroProps = {
  identity: Identity
  career: CareerSummary
  bestHand: HighScore
  bestHandDigits?: string
  mostMoney: HighScore
}

export function Hero({
  identity,
  career,
  bestHand,
  bestHandDigits,
  mostMoney,
}: HeroProps) {
  const t = useT()
  return (
    <section className="grid12 enter" aria-label="Career profile">
      <div className="panel span-5 hero-identity">
        <div>
          <span className="hero-tag">{t("balatroCareer")}</span>
          <h1 className="hero-name">{identity.name.toUpperCase()}</h1>
        </div>

        <div className="hero-record-row">
          <div className="hero-stat">
            <span className="hero-stat-value is-win">{formatInt(career.wins)}</span>
            <span className="hero-stat-label">{t("wins")}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value is-loss">{formatInt(career.losses)}</span>
            <span className="hero-stat-label">{t("losses")}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value is-rate">
              {formatPercent(career.winRate)}
            </span>
            <span className="hero-stat-label">{t("winRate")}</span>
          </div>
        </div>

        <div className="hero-meta">
          <span className="chip">
            {t("save")} <b>{identity.name}</b>
          </span>
          <span className="chip">
            {t("deck")} <b>{identity.deck}</b>
          </span>
          <span className="chip">
            {t("stake")} <b>{identity.stakeName}</b>
          </span>
        </div>
      </div>

      <div className="span-7 hero-records">
        <article className="record-card record-best">
          <span className="record-glow" aria-hidden="true" />
          <span className="record-suit" aria-hidden="true">
            ♠
          </span>
          <div
            className="record-value"
            title={formatScoreExact(bestHand.amount, bestHandDigits)}
          >
            {formatScore(bestHand.amount, bestHandDigits)}
          </div>
          <span className="record-label">{t("bestHand")}</span>
        </article>

        <article className="record-card record-money">
          <span className="record-glow" aria-hidden="true" />
          <span className="record-suit" aria-hidden="true">
            ♦
          </span>
          <div className="record-value" title={formatScoreExact(mostMoney.amount)}>
            ${formatScore(mostMoney.amount)}
          </div>
          <span className="record-label">{t("mostMoney")}</span>
        </article>
      </div>
    </section>
  )
}
