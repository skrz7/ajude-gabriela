import type { CampaignConfig } from "@/config/campaign";
import { getFundraising } from "@/lib/fundraising";
import { formatMoney } from "@/lib/money";
export function Fundraising({ config }: { config: CampaignConfig }) {
  const data = getFundraising(config);
  const progressLabel = data.progress === null ? "Em preparação" : new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.progress) + "%";
  return <section aria-label="Progresso da arrecadação" className="meta-bloco">
    <div className="meta-topo"><div><p className="meta-label">{data.confirmed ? "Total arrecadado" : "Objetivo estimado"}</p><div className="meta-valor">{formatMoney(data.confirmed ? data.raisedCents! : data.goalCents)}</div></div><div className="meta-pct">{progressLabel}</div></div>
    <div className="meta-barra" role="progressbar" aria-label="Meta alcançada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.progress ?? undefined} aria-valuetext={data.progress === null ? "Progresso aguardando confirmação" : progressLabel}><span style={{ width: (data.progress ?? 0) + "%" }} /></div>
    <p className="meta-sub">{data.confirmed ? <>Meta total: <b>{formatMoney(data.goalCents)}</b><br />Faltam <b>{formatMoney(data.remainingCents!)}</b> para alcançar a meta.</> : "Arrecadação e progresso aguardando confirmação."}</p>
    {data.confirmed && <p className="aviso-historico">{config.fundraising.confirmed!.source ?? "Dados confirmados"} em {new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(config.fundraising.confirmed!.verifiedAt))}.</p>}
  </section>;
}
