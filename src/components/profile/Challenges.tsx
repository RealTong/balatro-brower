import { formatInt } from "@/lib/format"
import type { ChallengeSummary } from "@/lib/profile"
import { useT } from "@/lib/uiText"

export function Challenges({ challenges }: { challenges: ChallengeSummary }) {
  const t = useT()
  return (
    <section className="panel panel-pad span-5 enter" aria-label="Challenge progress">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("challenges")}</h2>
        </div>
        <span className="chal-count">
          {formatInt(challenges.completed)} / {formatInt(challenges.total)}
        </span>
      </div>

      <div className="chal-grid">
        {challenges.items.map((item) => (
          <div
            className={`chal-chip${item.completed ? " done" : ""}`}
            key={item.id}
            title={item.id}
          >
            <span className="chal-dot" />
            {item.name}
          </div>
        ))}
      </div>
    </section>
  )
}
