import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { CampaignImage as ImageConfig } from "@/config/campaign";

export function CampaignImage({ image, variant }: { image: ImageConfig; variant: "hero" | "story" | "autonomy" }) {
  const available = image.reuseAuthorized && image.src?.startsWith("/images/");
  return <figure className={variant === "hero" ? "foto-principal" : variant === "story" ? "figura-historia" : "figura-autonomia"}>
    {available && image.src ? <Image
      src={image.src} alt={image.alt}
      width={variant === "autonomy" ? 941 : 2880}
      height={variant === "autonomy" ? 1672 : 2880}
      sizes={variant === "autonomy" ? "(min-width: 701px) 280px, 220px" : variant === "hero" ? "(min-width: 1160px) 500px, (min-width: 701px) 45vw, (min-width: 464px) 420px, calc(100vw - 44px)" : "(min-width: 1160px) 420px, (min-width: 701px) 38vw, (min-width: 464px) 420px, calc(100vw - 44px)"}
      quality={90}
      priority={variant === "hero"}
    /> : <div className="imagem-pendente" role="img" aria-label={image.caption}>
      <ImageIcon size={30} strokeWidth={1.25} aria-hidden="true" />
      <span>{image.caption}</span>
    </div>}
  </figure>;
}
