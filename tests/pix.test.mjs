import test from "node:test";
import assert from "node:assert/strict";
import { crc16, validatePixPayload } from "../src/lib/pix-payload.ts";

// Somente fixture sintética. Domínio .invalid não é uma chave real; nenhum pagamento é feito.
const field = (id, value) => `${id}${String(value.length).padStart(2, "0")}${value}`;
function fixture(amount = "50.00") {
  const account = field("00", "br.gov.bcb.pix") + field("01", "test@example.invalid");
  const body = field("00", "01") + field("26", account) + field("52", "0000")
    + field("53", "986") + field("54", amount) + field("58", "BR")
    + field("59", "TESTE SEM PAGAMENTO") + field("60", "BRASILIA")
    + field("62", field("05", "***")) + "6304";
  return body + crc16(body);
}

test("CRC16 corresponde ao vetor de referência CCITT-FALSE", () => {
  assert.equal(crc16("123456789"), "29B1");
});

test("fixture PIX estruturalmente válida e com valor exato", () => {
  for (const cents of [3000, 3055, 5000, 100000]) assert.equal(validatePixPayload(fixture((cents / 100).toFixed(2)), cents), true);
});

test("payload adulterado, truncado, sem valor ou diferente é rejeitado", () => {
  assert.equal(validatePixPayload(fixture(), 7500), false);
  assert.equal(validatePixPayload(fixture().replace("50.00", "70.00"), 7000), false);
  assert.equal(validatePixPayload(fixture().slice(0, -1), 5000), false);
  assert.equal(validatePixPayload(fixture("50"), 5000), false);
  assert.equal(validatePixPayload("", 5000), false);
  assert.equal(validatePixPayload(fixture(), NaN), false);
  assert.equal(validatePixPayload(fixture(), 0), false);
});
