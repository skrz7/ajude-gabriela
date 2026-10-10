export async function copyPixCode(code: string, clipboard?: Pick<Clipboard, "writeText">): Promise<void> {
  if (!code.trim()) throw new Error("Código PIX indisponível.");
  if (!clipboard) throw new Error("Não foi possível copiar automaticamente. Selecione o código e copie manualmente.");
  try {
    await clipboard.writeText(code);
  } catch {
    throw new Error("Não foi possível copiar. Selecione o código e copie manualmente.");
  }
}
