"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LockKeyhole, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { PaymentResult } from "@/lib/payment";

export function PixModal({ amountCents, onClose }: { amountCents: number; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  function closeModal() {
    // Remove a modalidade antes de devolver foco ao botão da campanha.
    dialogRef.current?.close();
    onClose();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controller = new AbortController();
    fetch("/api/contributions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents }), signal: controller.signal,
    }).then(async (response) => {
      const payload = await response.json() as PaymentResult;
      if (controller.signal.aborted) return;
      if (!["unavailable", "error", "checkout"].includes(payload.status)) throw new Error("Resposta inválida");
      setResult(payload);
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ status: "error", message: "Não foi possível carregar as informações. Feche esta janela e tente novamente." });
    });
    return () => {
      controller.abort();
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [amountCents]);

  return <dialog ref={dialogRef} className="janela-pagamento" aria-labelledby="pix-titulo"
    aria-describedby="pix-situacao" onCancel={(event) => { event.preventDefault(); closeModal(); }}
    onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal();
    }}>
    <button className="fechar-janela" type="button" aria-label="Fechar modal PIX" onClick={closeModal} autoFocus><X size={18} aria-hidden="true" /></button>
    <div className="pix-head">
      <h2 id="pix-titulo" className="pix-badge">Pix</h2>
      <div className="pix-amount-label">Valor selecionado para contribuir</div>
      <span className="mostrador-contribuicao">{formatMoney(amountCents)}</span>
    </div>
    <div className="pix-body" aria-busy={!result}>
      {!result ? <p id="pix-situacao" role="status">Consultando disponibilidade…</p> : result.status === "checkout" ? <>
        <p id="pix-situacao" className="pix-instr">Finalize sua contribuição no site oficial da Vakinha.</p>
        <p className="pix-beneficiario">Beneficiário confirmado: <strong>{result.beneficiary}</strong></p>
        <p className="pix-explicacao">Confirme o valor no checkout da plataforma. O QR Code e o código PIX serão apresentados pela Vakinha.</p>
        <a className="botao-pix" href={result.url} target="_blank" rel="noopener noreferrer">Continuar na Vakinha <ExternalLink size={16} aria-hidden="true" /></a>
      </> : <>
        <div className="pix-bloqueado" aria-hidden="true"><LockKeyhole size={30} strokeWidth={1.5} /></div>
        <h3 className="pix-indisponivel">{result.status === "unavailable" ? "Contribuições em pausa" : "Não foi possível continuar"}</h3>
        <p id="pix-situacao" role="status" className="pix-explicacao">{result.message}</p>
        <button className="botao-pix" type="button" onClick={closeModal}>Voltar à campanha</button>
      </>}
      <p className="pix-secure"><LockKeyhole size={12} aria-hidden="true" />Nenhum pagamento foi realizado nesta página.</p>
    </div>
  </dialog>;
}
