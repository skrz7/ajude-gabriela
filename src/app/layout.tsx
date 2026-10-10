import type { Metadata } from "next";
import { campaign } from "@/config/campaign";
import "./globals.css";

export const metadata: Metadata = {
  title: campaign.title,
  description: "Conheça a história de Gabriela. Uma oportunidade de avaliação médica especializada, autonomia e qualidade de vida.",
  openGraph: { title: campaign.title, description: "Uma oportunidade de mais autonomia, dignidade e qualidade de vida para Gabriela.", locale: "pt_BR", type: "website" },
  twitter: { card: "summary", title: campaign.title, description: "Conheça a história da Gabriela e compartilhe esta campanha." },
  robots: { index: campaign.publicationReady, follow: campaign.publicationReady },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
