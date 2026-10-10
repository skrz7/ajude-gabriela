"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { copyPixCode } from "@/lib/clipboard";
import { validatePixPayload } from "@/lib/pix-payload";

/** Exibe somente payload validado pelo servidor; copiar não comprova pagamento. */
export function PixCode({ officialPayload, amountCents }: { officialPayload: string; amountCents: number }) {
  const [qr, setQr] = useState<{ payload: string; url: string } | null>(null);
  const [notice, setNotice] = useState<{ payload: string; message: string } | null>(null);
  const valid = validatePixPayload(officialPayload, amountCents);

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    QRCode.toDataURL(officialPayload, { width: 300, margin: 4, errorCorrectionLevel: "M" })
      .then((url) => { if (!cancelled) setQr({ payload: officialPayload, url }); })
      .catch(() => { if (!cancelled) setNotice({ payload: officialPayload, message: "Não foi possível gerar o QR Code. Use o código abaixo." }); });
    return () => { cancelled = true; };
  }, [officialPayload, valid]);

  if (!valid) return <p role="alert">Código PIX inválido ou com valor diferente do selecionado. A contribuição foi bloqueada.</p>;
  return <div className="pix-code">
    <p className="pix-instr">Escaneie o QR Code no app do seu banco</p>
    <div className="area-qrcode">{qr?.payload === officialPayload ? <Image src={qr.url} alt="QR Code PIX da contribuição" width={300} height={300} unoptimized /> : <span role="status">Gerando QR Code…</span>}</div>
    <div className="pix-or">ou copie o código</div>
    <label className="sr-only" htmlFor="codigo-copia-pix">Código PIX Copia e Cola</label>
    <textarea readOnly rows={3} id="codigo-copia-pix" value={officialPayload} />
    <button className="botao-pix" type="button" onClick={async () => {
      try { await copyPixCode(officialPayload, navigator.clipboard); setNotice({ payload: officialPayload, message: "Código PIX copiado." }); }
      catch (error) { setNotice({ payload: officialPayload, message: error instanceof Error ? error.message : "Não foi possível copiar." }); }
    }}>Copiar código Pix</button>
    <p role="status" className="pix-explicacao">{notice?.payload === officialPayload ? notice.message : ""}</p>
  </div>;
}
