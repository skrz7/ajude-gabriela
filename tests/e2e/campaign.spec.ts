import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createStaticPixPayload } from "../../src/lib/pix-payload";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("PIX autorizado exibe recebedor e QR do valor exato sem alegar pagamento", async ({ page }) => {
  // Resposta sintética com domínio inválido: não libera a API nem usa chave real.
  const payload = createStaticPixPayload("test@example.invalid", "TESTE SEM PAGAMENTO", "BRASILIA", 3055);
  await page.route("**/api/contributions", async (route) => {
    expect(route.request().postDataJSON().amountCents).toBe(3055);
    await route.fulfill({ json: { status: "pix", amountCents: 3055, payload, beneficiary: "TESTE SEM PAGAMENTO" } });
  });
  await page.getByLabel("Outro valor — você decide").fill("30,55");
  await page.getByRole("button", { name: "Apoiar com este valor" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("TESTE SEM PAGAMENTO");
  await expect(dialog.getByRole("textbox", { name: "Código PIX Copia e Cola" })).toHaveValue(payload);
  await expect(dialog.getByRole("img", { name: "QR Code PIX da contribuição" })).toBeVisible();
  await expect(dialog).toContainText("não confirma o pagamento");
});

test("resposta com valor diferente da seleção não libera QR", async ({ page }) => {
  await page.route("**/api/contributions", (route) => route.fulfill({ json: {
    status: "pix", amountCents: 5000, payload: "INVALIDO", beneficiary: "TESTE SEM PAGAMENTO",
  } }));
  await page.getByRole("button", { name: "Apoiar com este valor" }).click();
  await expect(page.getByRole("heading", { name: "Não foi possível continuar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar código Pix" })).toHaveCount(0);
});

test("layout cabe no viewport e exibe arrecadação informada e saldo calculado", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uma chance de devolver o mundo à Gabriela");
  const fundraising = page.getByRole("region", { name: "Progresso da arrecadação" });
  await expect(fundraising).toContainText("47.683,29");
  await expect(fundraising).toContainText("129.000,00");
  await expect(fundraising).toContainText("81.316,71");
  await expect(fundraising).toContainText("36,96%");
  await expect(fundraising.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "36.96");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const buttons = page.getByRole("group", { name: "Valores sugeridos" }).getByRole("button");
  await expect(buttons).toHaveCount(8);
  await page.screenshot({ path: `test-results/campanha-${test.info().project.name}.png`, fullPage: true });
});

test("todos os valores abrem o modal bloqueado com valor selecionado", async ({ page }) => {
  for (const value of [30, 50, 75, 100, 150, 250, 500, 700]) {
    await page.getByRole("button", { name: `Selecionar R$ ${value},00`, exact: true }).click();
    await page.getByRole("button", { name: "Apoiar com este valor" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(`R$ ${value},00`);
    await expect(dialog.getByRole("heading", { name: "Contribuições em pausa" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Copiar código Pix" })).toHaveCount(0);
    await page.getByRole("button", { name: "Fechar modal PIX" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Apoiar com este valor" })).toBeFocused();
  }
});

test("campo personalizado aceita centavos e rejeita valores fora dos limites", async ({ page }) => {
  const input = page.getByLabel("Outro valor — você decide");
  for (const value of ["", "29,99", "1000,01", "-30", "1e3", "30,999", "texto"]) {
    await input.fill(value);
    await page.getByRole("button", { name: "Apoiar com este valor" }).click();
    await expect(page.locator("#erro-valor")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  for (const value of ["30", "30,50", "1000"]) {
    await input.fill(value);
    await page.getByRole("button", { name: "Apoiar com este valor" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});

test("modal fecha pelo fundo, retém foco e restaura rolagem", async ({ page }) => {
  await page.getByRole("button", { name: "Apoiar com este valor" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contribuições em pausa" })).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  }
  await page.mouse.click(2, 2);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("erros de rede têm mensagem e permitem fechar", async ({ page }) => {
  await page.route("**/api/contributions", (route) => route.abort());
  await page.getByRole("button", { name: "Apoiar com este valor" }).click();
  await expect(page.getByRole("heading", { name: "Não foi possível continuar" })).toBeVisible();
  await page.getByRole("button", { name: "Voltar à campanha" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("API bloqueia cobrança e valida valores sem expor a chave", async ({ request }) => {
  const foreign = await request.post("/api/contributions", { headers: { origin: "https://example.invalid" }, data: { amountCents: 5000 } });
  expect(foreign.status()).toBe(403);
  const invalid = await request.post("/api/contributions", { data: { amountCents: 2999 } });
  expect(invalid.status()).toBe(400);
  const blocked = await request.post("/api/contributions", { data: { amountCents: 5000 } });
  expect(blocked.status()).toBe(503);
  expect(await blocked.text()).not.toContain("6384186@");
});

test("página e modal atendem verificações automáticas de acessibilidade", async ({ page }) => {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Apoiar com este valor" }).click();
  await expect(page.getByRole("heading", { name: "Contribuições em pausa" })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
