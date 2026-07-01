import { useEffect, useState } from "react"

import { localeLabels, locales, type Locale } from "@/lib/balatroLocale"
import { useT } from "@/lib/uiText"

type NavProps = {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onImport: () => void
  onExport: () => void
  exporting: boolean
}

export function Nav({
  locale,
  onLocaleChange,
  onImport,
  onExport,
  exporting,
}: NavProps) {
  const t = useT()
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`nav${stuck ? " is-stuck" : ""}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-eyebrow">Balatro Browser</span>
        </div>
        <div className="nav-actions">
          <select
            className="select"
            aria-label={t("language")}
            value={locale}
            onChange={(event) => onLocaleChange(event.target.value as Locale)}
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeLabels[item]}
              </option>
            ))}
          </select>
          <button className="btn" type="button" onClick={onImport}>
            {t("importProfile")}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onExport}
            disabled={exporting}
          >
            {exporting ? t("exporting") : t("exportImage")}
          </button>
        </div>
      </div>
    </nav>
  )
}
