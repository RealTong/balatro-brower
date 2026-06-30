import { formatInt } from "@/lib/format"

export type BarItem = {
  key: string
  name: string
  value: number
  color?: string
  title?: string
  image?: string
}

export function BarList({ items }: { items: BarItem[] }) {
  const max = items.reduce((m, item) => Math.max(m, item.value), 0) || 1
  const withImages = items.some((item) => item.image)
  return (
    <div className="bar-list">
      {items.map((item) => {
        const pct = Math.max(2, (item.value / max) * 100)
        return (
          <div
            className={`bar-row${withImages ? " has-thumb" : ""}`}
            key={item.key}
            title={item.title}
          >
            {withImages ? (
              <span className="bar-thumb" aria-hidden="true">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />
                ) : null}
              </span>
            ) : null}
            <span className="bar-row-name">{item.name}</span>
            <div className="bar-row-track">
              <div
                className="bar-row-fill"
                style={{
                  width: `${pct}%`,
                  ...(item.color ? { ["--bar" as string]: item.color } : {}),
                }}
              />
              <span className="bar-row-count">{formatInt(item.value)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
