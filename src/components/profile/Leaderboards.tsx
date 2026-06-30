import { BarList, type BarItem } from "@/components/profile/BarList"
import type { UsageStat } from "@/lib/profile"
import { useT } from "@/lib/uiText"

function toItems(stats: UsageStat[], color: string, limit: number): BarItem[] {
  return stats.slice(0, limit).map((stat) => ({
    key: stat.key,
    name: stat.name,
    value: stat.count,
    color,
    image: stat.image,
  }))
}

export function ConsumablesBoard({ consumables }: { consumables: UsageStat[] }) {
  const t = useT()
  return (
    <section className="panel panel-pad span-6 enter" aria-label="Most used consumables">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("consumablesTitle")}</h2>
          <p className="section-sub">{t("consumablesSub")}</p>
        </div>
      </div>
      <BarList items={toItems(consumables, "var(--purple)", 10)} />
    </section>
  )
}

export function VouchersBoard({ vouchers }: { vouchers: UsageStat[] }) {
  const t = useT()
  return (
    <section className="panel panel-pad span-6 enter" aria-label="Most purchased vouchers">
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("vouchersTitle")}</h2>
          <p className="section-sub">{t("vouchersSub")}</p>
        </div>
      </div>
      <BarList items={toItems(vouchers, "var(--green)", 10)} />
    </section>
  )
}
