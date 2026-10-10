import { NextResponse } from "next/server";
import { campaign } from "@/config/campaign";
import { createContribution } from "@/lib/payment";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next pode reconstruir request.url com localhost apesar de Host ser 127.0.0.1.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host");
  const publicOrigin = host ? `${requestUrl.protocol}//${host}` : requestUrl.origin;
  if (origin && origin !== publicOrigin) {
    return NextResponse.json({ status: "error", message: "Origem inválida." }, { status: 403 });
  }
  try {
    const body: unknown = await request.json();
    const amount = body && typeof body === "object" && "amountCents" in body ? body.amountCents : undefined;
    const result = createContribution(campaign, amount);
    return NextResponse.json(result, {
      status: result.status === "error" ? 400 : result.status === "unavailable" ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ status: "error", message: "Não foi possível validar a solicitação." }, { status: 400 });
  }
}
