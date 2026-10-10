/** Validação estrutural de BR Code, sem consultar DICT ou confirmar transações. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function parseFields(payload: string): Map<string, string> {
  const fields = new Map<string, string>();
  let offset = 0;
  while (offset < payload.length) {
    const header = payload.slice(offset, offset + 4);
    if (!/^\d{4}$/.test(header)) throw new Error("Campo PIX inválido.");
    const id = header.slice(0, 2);
    const size = Number(header.slice(2));
    const value = payload.slice(offset + 4, offset + 4 + size);
    if (value.length !== size || fields.has(id) || size === 0) throw new Error("Comprimento ou campo PIX inválido.");
    fields.set(id, value);
    offset += 4 + size;
  }
  return fields;
}

export function validatePixPayload(payload: string, expectedCents: number): boolean {
  try {
    if (!Number.isSafeInteger(expectedCents) || expectedCents <= 0 || payload.length > 2048
      || !/^[\x20-\x7E]+$/.test(payload) || !/6304[0-9A-F]{4}$/.test(payload)
      || crc16(payload.slice(0, -4)) !== payload.slice(-4)) return false;
    const fields = parseFields(payload);
    const account = parseFields(fields.get("26") ?? "");
    const amount = fields.get("54");
    const name = fields.get("59") ?? "";
    const city = fields.get("60") ?? "";
    const txid = parseFields(fields.get("62") ?? "").get("05") ?? "";
    return fields.get("00") === "01" && fields.get("52") === "0000"
      && fields.get("53") === "986" && fields.get("58") === "BR"
      && account.get("00") === "br.gov.bcb.pix" && Boolean(account.get("01") || account.get("25"))
      && name.length >= 1 && name.length <= 25 && city.length >= 1 && city.length <= 15
      && /^(\*\*\*|[a-zA-Z0-9]{1,25})$/.test(txid)
      && amount === (expectedCents / 100).toFixed(2);
  } catch {
    return false;
  }
}
