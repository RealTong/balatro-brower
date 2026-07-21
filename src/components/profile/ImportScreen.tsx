import { useRef, useState } from "react"
import { motion } from "framer-motion"

import { wikiImageUrl } from "@/lib/gameData"
import { useT } from "@/lib/uiText"

type ImportScreenProps = {
  error: string
  onFile: (file: File) => void
}

const DECOR = [
  "Joker",
  "Mime",
  "Gros Michel",
  "Baron",
  "Blueprint",
]

const FAN_ANGLE = 30
const FAN_GAP = 60
const FAN_LIFT = 10
const FAN_CENTER = 2

const fanSpring = {
  type: "spring",
  stiffness: 180,
  damping: 20,
  mass: 0.8,
} as const

function fanPose(index: number, spread: boolean) {
  const dist = index - FAN_CENTER
  if (!spread) {
    return { rotate: dist * 5, x: dist * 10, y: 0, scale: 1 }
  }
  let lift = -FAN_LIFT
  if (Math.abs(dist) === 2) lift = FAN_LIFT
  else if (Math.abs(dist) === 1) lift = -0.2 * FAN_LIFT
  return {
    rotate: dist * (FAN_ANGLE / FAN_CENTER),
    x: dist * (FAN_GAP / FAN_CENTER),
    y: lift,
    scale: dist === 0 ? 1.05 : 1,
  }
}

export function ImportScreen({ error, onFile }: ImportScreenProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fanHovered, setFanHovered] = useState(false)
  const spread = fanHovered || dragging

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />
      <div className="import-screen">
        <div className="panel import-card enter">
          <div
            className="import-fan"
            aria-hidden="true"
            onMouseEnter={() => setFanHovered(true)}
            onMouseLeave={() => setFanHovered(false)}
          >
            <div className="import-fan-stack">
              {DECOR.map((name, index) => (
                <motion.span
                  className="import-fan-card"
                  key={name}
                  animate={fanPose(index, spread)}
                  transition={fanSpring}
                  style={{
                    zIndex: FAN_CENTER - Math.abs(index - FAN_CENTER),
                    originX: 0.5,
                    originY: 1,
                  }}
                >
                  <img
                    src={wikiImageUrl(name)}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.parentElement!.style.display = "none"
                    }}
                  />
                </motion.span>
              ))}
            </div>
          </div>

          <span className="import-logo">Balatro Browser</span>
          <h1 className="import-title">
            {t("importTitlePre")} profile.json
          </h1>
          <p className="import-note">{t("importNote")}</p>

          <button
            type="button"
            className={`import-drop${dragging ? " is-dragging" : ""} w-full`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const file = event.dataTransfer.files.item(0)
              if (file) onFile(file)
            }}
          >
            <span className="import-drop-icon" aria-hidden="true">
              ⤓
            </span>
            <strong>{t("dropCta")}</strong>
            <span>{t("dropHint")}</span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".json,.jkr,application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.item(0)
              if (file) onFile(file)
              event.currentTarget.value = ""
            }}
          />

          {error ? (
            <div className="import-error" role="alert">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
