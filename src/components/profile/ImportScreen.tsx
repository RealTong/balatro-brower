import { useRef, useState } from "react"

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

export function ImportScreen({ error, onFile }: ImportScreenProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />
      <div className="import-screen">
        <div className="panel import-card enter">
          <div className="import-fan" aria-hidden="true">
            {DECOR.map((name, index) => (
              <span
                className="import-fan-card"
                key={name}
                style={{ ["--i" as string]: String(index - 2) }}
              >
                <img
                  src={wikiImageUrl(name)}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.parentElement!.style.display = "none"
                  }}
                />
              </span>
            ))}
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
