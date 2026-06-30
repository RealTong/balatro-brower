import { formatInt } from "@/lib/format"
import type { EconomySummary } from "@/lib/profile"
import { useT, type UIText } from "@/lib/uiText"

export function Economy({ economy }: { economy: EconomySummary }) {
  const t = useT()
  return (
    <section className="panel panel-pad span-7 enter" aria-label="Economy and playstyle">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("economyTitle")}</h2>
          <p className="section-sub">{t("economySub")}</p>
        </div>
      </div>

      <div className="econ-grid">
        {economy.blocks.map((block) => {
          const tone =
            block.key === "netRetained"
              ? block.value >= 0
                ? " is-pos"
                : " is-neg"
              : ""
          return (
            <div className="econ-block" key={block.key}>
              <div className={`econ-value${tone}`}>
                {block.money ? "$" : ""}
                {formatInt(block.value)}
              </div>
              <div className="econ-label">{t(block.key as keyof UIText)}</div>
            </div>
          )
        })}
      </div>

      <div className="signals">
        {economy.signals.map((signal) => (
          <div className="signal" key={signal.key}>
            <div className="signal-value">{signal.value}</div>
            <div className="signal-label">{t(signal.key as keyof UIText)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
