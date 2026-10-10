import Image from "next/image";
import type { CampaignConfig } from "@/config/campaign";

export function Brand({ config, footer = false }: { config: CampaignConfig; footer?: boolean }) {
  const logo = config.images.logo;
  return logo.reuseAuthorized && logo.src?.startsWith("/images/") ? <Image
    className={footer ? "marca-rodape" : "marca-campanha"}
    src={logo.src} alt={logo.alt} width={1536} height={1024}
    priority={!footer} sizes="150px"
  /> : <span className={footer ? "marca-texto marca-texto-rodape" : "marca-texto"}>{config.name}</span>;
}
