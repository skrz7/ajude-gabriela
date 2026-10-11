import test from "node:test";
import assert from "node:assert/strict";
import { campaign } from "../src/config/campaign.ts";
import { parseAmount, validateAmount, formatMoney } from "../src/lib/money.ts";
import { getFundraising } from "../src/lib/fundraising.ts";
import { createContribution, approvedCheckoutUrl } from "../src/lib/payment.ts";
import { copyPixCode } from "../src/lib/clipboard.ts";
import { validatePixPayload } from "../src/lib/pix-payload.ts";

test("valores sugeridos e limites são válidos", () => {
  for (const amount of [...campaign.contribution.suggestedCents, 2500, 5_000_000, 3015]) {
    assert.equal(validateAmount(amount, campaign.contribution.minCents, campaign.contribution.maxCents), null);
  }
});

test("valores inválidos não são arredondados nem aceitos", () => {
  for (const amount of [null, undefined, "3000", NaN, Infinity, -1, 0, 2499, 5_000_001, 3010.5]) {
    assert.ok(validateAmount(amount, campaign.contribution.minCents, campaign.contribution.maxCents));
  }
});

test("campo personalizado aceita reais e centavos com vírgula ou ponto", () => {
  for (const [input, expected] of [["25", 2500], ["50000", 5_000_000], ["50000,01", 5_000_001], ["30", 3000], ["30,50", 3050], ["30.5", 3050], ["1000,00", 100000], [" 75 ", 7500]]) {
    assert.equal(parseAmount(input), expected);
  }
  for (const input of ["", "abc", "-30", "+30", "1e3", "30,999", "1.000,00", "30 50", "100000", "30.", "<script>"]) {
    assert.equal(parseAmount(input), null);
  }
  assert.match(formatMoney(3050), /30,50/);
});

test("campanha sem arrecadação confirmada não inventa progresso", () => {
  const config = structuredClone(campaign);
  config.fundraising.confirmed = null;
  const result = getFundraising(config);
  assert.equal(result.confirmed, false);
  assert.equal(result.progress, null);
  assert.equal(result.raisedCents, null);
  assert.equal(result.goalCents, 12900000);
});

test("arrecadação informada calcula porcentagem e saldo em centavos", () => {
  const result = getFundraising(campaign);
  assert.equal(result.goalCents, 12900000);
  assert.equal(result.raisedCents, 4768329);
  assert.equal(result.progress, 36.96);
  assert.equal(result.remainingCents, 8131671);
  assert.match(formatMoney(result.raisedCents), /47\.683,29/);
  assert.match(formatMoney(result.remainingCents), /81\.316,71/);
  assert.equal(campaign.pix.key, "6384186@vakinha.com.br");
});

test("campanha autorizada gera código para a chave informada sem alterar arrecadação", () => {
  const raised = campaign.fundraising.confirmed.raisedCents;
  for (const cents of [...campaign.contribution.suggestedCents, 2500, 3055, 5_000_000]) {
    const result = createContribution(campaign, cents);
    assert.equal(result.status, "pix");
    assert.equal(result.beneficiary, "VAKINHA");
    assert.equal(validatePixPayload(result.payload, cents, "6384186@vakinha.com.br"), true);
    assert.equal("paid" in result, false);
  }
  assert.equal(campaign.fundraising.confirmed.raisedCents, raised);
});

test("progresso confirmado calcula dados reais e limita a barra a 100%", () => {
  const config = structuredClone(campaign);
  config.fundraising.confirmed = { goalCents: 4800000, raisedCents: 3142000, verifiedAt: "2026-10-10T12:00:00Z" };
  assert.equal(getFundraising(config).progress, 65.46);
  config.fundraising.confirmed.raisedCents = 5000000;
  assert.equal(getFundraising(config).progress, 100);
  assert.equal(getFundraising(config).remainingCents, 0);
  config.fundraising.confirmed.goalCents = 0;
  assert.equal(getFundraising(config).progress, null);
  config.fundraising.confirmed.goalCents = 4800000;
  config.fundraising.confirmed.verifiedAt = "invalid";
  assert.equal(getFundraising(config).confirmed, false);
});

test("desabilitar PIX bloqueia todos os valores sem expor o código", () => {
  const disabled = structuredClone(campaign);
  disabled.pix.enabled = false;
  for (const amount of campaign.contribution.suggestedCents) {
    const result = createContribution(disabled, amount);
    assert.equal(result.status, "unavailable");
    assert.equal("key" in result, false);
    assert.equal("payload" in result, false);
  }
  assert.equal(createContribution(campaign, 2499).status, "error");
  assert.equal(createContribution(campaign, 5_000_001).status, "error");
});

function approvedConfig() {
  const config = structuredClone(campaign);
  config.publicationReady = config.contentApproved = true;
  config.fundraising.confirmed = { goalCents: 4800000, raisedCents: 3142000, verifiedAt: "2026-10-10T12:00:00Z" };
  Object.assign(config.pix, {
    enabled: true, ownershipConfirmed: true, beneficiaryConfirmed: true,
    campaignUseAuthorized: true, platformFlowConfirmed: true,
    confirmationReference: "EXCLUSIVAMENTE TESTE LOCAL", beneficiaryName: "BENEFICIARIO DE TESTE",
    officialCampaignUrl: "https://www.vakinha.com.br/6384186",
    mode: "official-checkout",
  });
  return config;
}

test("cada confirmação é necessária; habilitar um flag não basta", () => {
  for (const field of ["enabled", "ownershipConfirmed", "beneficiaryConfirmed", "campaignUseAuthorized", "platformFlowConfirmed"]) {
    const config = approvedConfig();
    config.pix[field] = false;
    assert.equal(createContribution(config, 5000).status, "unavailable");
  }
  for (const field of ["confirmationReference", "beneficiaryName"]) {
    const config = approvedConfig();
    config.pix[field] = " ";
    assert.equal(createContribution(config, 5000).status, "unavailable");
  }
  const config = approvedConfig();
  config.fundraising.confirmed = null;
  assert.equal(createContribution(config, 5000).status, "unavailable");
});

test("fluxo aprovado só oferece o site oficial, sem criar pagamento", () => {
  const result = createContribution(approvedConfig(), 5050);
  assert.equal(result.status, "checkout");
  assert.equal(result.amountCents, 5050);
  assert.equal(result.url, "https://www.vakinha.com.br/6384186");
  assert.equal("paid" in result, false);
  assert.equal("payload" in result, false);
});

test("PIX estático exige autorização específica e todas as confirmações comuns", () => {
  const config = approvedConfig();
  Object.assign(config.pix, { mode: "authorized-static", key: "test@example.invalid",
    beneficiaryCity: "BRASILIA", staticQrAuthorized: true });
  for (const field of ["enabled", "ownershipConfirmed", "beneficiaryConfirmed", "campaignUseAuthorized", "platformFlowConfirmed", "staticQrAuthorized"]) {
    const blocked = structuredClone(config);
    blocked.pix[field] = false;
    assert.equal(createContribution(blocked, 5050).status, "unavailable");
  }
  for (const field of ["publicationReady", "contentApproved"]) {
    const blocked = structuredClone(config);
    blocked[field] = false;
    assert.equal(createContribution(blocked, 5050).status, "unavailable");
  }
  const result = createContribution(config, 5050);
  assert.equal(result.status, "pix");
  assert.equal(result.amountCents, 5050);
  assert.equal(result.beneficiary, config.pix.beneficiaryName);
  assert.equal("paid" in result, false);
  config.pix.beneficiaryCity = "";
  assert.equal(createContribution(config, 5050).status, "unavailable");
});

test("URL oficial rejeita outro beneficiário, credenciais, query e domínios falsos", () => {
  for (const url of ["https://www.vakinha.com.br.evil.test/6384186", "http://www.vakinha.com.br/6384186", "https://evil.test/6384186", "https://user@www.vakinha.com.br/6384186", "https://www.vakinha.com.br/123", "https://www.vakinha.com.br/6384186?amount=50", "https://www.vakinha.com.br/6384186#other", "https://www.vakinha.com.br:8443/6384186", "invalid"]) {
    assert.equal(approvedCheckoutUrl(url, campaign.pix.key), null);
  }
});

test("copiar PIX só confirma após escrita na área de transferência", async () => {
  let written;
  await copyPixCode("PAYLOAD DE TESTE", { writeText: async (text) => { written = text; } });
  assert.equal(written, "PAYLOAD DE TESTE");
  await assert.rejects(copyPixCode(""), /indisponível/);
  await assert.rejects(copyPixCode("TESTE"), /manualmente/);
  await assert.rejects(copyPixCode("TESTE", { writeText: async () => { throw new Error("denied"); } }), /copiar/);
});
