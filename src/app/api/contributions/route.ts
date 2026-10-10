import { NextResponse } from "next/server";
import { campaign } from "@/config/campaign";
import { createContribution } from "@/lib/payment";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
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
