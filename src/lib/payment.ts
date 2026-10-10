import type { CampaignConfig } from "../config/campaign.ts";
import { validateAmount } from "./money.ts";
import { getFundraising } from "./fundraising.ts";
import { createStaticPixPayload } from "./pix-payload.ts";

export type PaymentResult =
  | { status: "unavailable"; message: string }
  | { status: "checkout"; amountCents: number; url: string; beneficiary: string }
  | { status: "pix"; amountCents: number; payload: string; beneficiary: string }
  | { status: "error"; message: string };

export function approvedCheckoutUrl(raw: string, key: string): string | null {
  try {
    const url = new URL(raw);
    const id = /^(\d+)@vakinha\.com\.br$/.exec(key)?.[1];
    // Fluxo oficial por ID: exige correspondência com a chave informada.
    if (!id || url.protocol !== "https:" || url.hostname !== "www.vakinha.com.br"
      || url.port || url.username || url.password || url.pathname !== `/${id}`
      || url.search || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function createContribution(config: CampaignConfig, amountCents: unknown): PaymentResult {
  const error = validateAmount(amountCents, config.contribution.minCents, config.contribution.maxCents);
  if (error) return { status: "error", message: error };
  const pix = config.pix;
  const approved = config.publicationReady && config.contentApproved && getFundraising(config).confirmed
    && pix.enabled && pix.ownershipConfirmed && pix.beneficiaryConfirmed
    && pix.campaignUseAuthorized && pix.platformFlowConfirmed
    && pix.confirmationReference.trim() && pix.beneficiaryName.trim();
  const url = approvedCheckoutUrl(pix.officialCampaignUrl, pix.key);
  if (approved && pix.mode === "authorized-static" && pix.staticQrAuthorized) {
    try {
      const payload = createStaticPixPayload(pix.key, pix.beneficiaryName, pix.beneficiaryCity, amountCents as number);
      return { status: "pix", amountCents: amountCents as number, payload, beneficiary: pix.beneficiaryName };
    } catch {
      return { status: "unavailable", message: "Os dados do recebedor PIX precisam ser confirmados antes de continuar." };
    }
  }
  if (!approved || !url || pix.mode !== "official-checkout") {
    return { status: "unavailable", message: "As contribuições estão temporariamente indisponíveis. A campanha aguarda a confirmação da responsável para liberar o recebimento." };
  }
  // Não informa pagamento, não gera cobrança, nem acrescenta parâmetros não documentados.
  return { status: "checkout", amountCents: amountCents as number, url, beneficiary: pix.beneficiaryName };
}
