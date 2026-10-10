"use client";

import { useRef, useState } from "react";
import type { CampaignConfig } from "@/config/campaign";
import { formatMoney, parseAmount, validateAmount } from "@/lib/money";
import { PixModal } from "./pix-modal";

export function ContributionForm({ config }: { config: CampaignConfig["contribution"] }) {
  const [value, setValue] = useState(String(config.defaultCents / 100).replace(".", ","));
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const cents = parseAmount(value);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateAmount(cents, config.minCents, config.maxCents);
    setError(validation);
    if (validation || cents === null) { inputRef.current?.focus(); return; }
    triggerRef.current = document.activeElement as HTMLElement;
    setAmount(cents);
  }

  return <section id="contribuir-agora" className="secao-contribuir" aria-labelledby="contribuicao-titulo">
    <div className="titulo-contribuicao"><p className="sobretitulo">Faça parte desta história</p><h2 id="contribuicao-titulo">Seu apoio pode abrir novos caminhos.</h2><p>Escolha um valor ou personalize sua contribuição.</p></div>
    <form noValidate onSubmit={submit}>
      <div className="grade-opcoes-valor" role="group" aria-label="Valores sugeridos">
        {config.suggestedCents.map((suggestion) => <button
          key={suggestion} type="button" className={`botao-apoio${cents === suggestion ? " sel" : ""}`}
          aria-label={`Selecionar ${formatMoney(suggestion)}`} aria-pressed={cents === suggestion}
          onClick={() => { setValue(String(suggestion / 100)); setError(null); }}>
          <small aria-hidden="true">R$</small><strong aria-hidden="true">{suggestion / 100}</strong>
        </button>)}
      </div>
      <div className="painel-valor-livre">
        <label className="rotulo-customizado" htmlFor="campo-quantia">Outro valor — você decide</label>
        <div className={`campo-livre${error ? " campo-invalido" : ""}`}>
          <span className="prefixo-moeda" aria-hidden="true">R$</span>
          <input ref={inputRef} inputMode="decimal" type="text" id="campo-quantia"
            autoComplete="off" maxLength={12} value={value}
            aria-describedby={error ? "limites-valor erro-valor" : "limites-valor"}
            aria-invalid={Boolean(error)}
            onChange={(event) => { setValue(event.target.value); setError(null); }} />
        </div>
        <p className="hint-minimo" id="limites-valor">Mínimo {formatMoney(config.minCents).replace(",00", "")} · máximo {formatMoney(config.maxCents).replace(",00", "")}</p>
        {error && <p id="erro-valor" className="erro-formulario" role="alert">{error}</p>}
        <button className="botao-livre-cta" type="submit">Apoiar com este valor<span aria-hidden="true">→</span></button>
      </div>
    <p className="apoio-status">Contribuições em preparação. O PIX será liberado após a confirmação da responsável.</p></form>
    {amount !== null && <PixModal amountCents={amount} onClose={() => {
      setAmount(null);
      triggerRef.current?.focus();
    }} />}
  </section>;
}
