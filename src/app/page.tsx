import { ArrowUpRight, Heart, Accessibility, Stethoscope } from "lucide-react";
import { campaign } from "@/config/campaign";
import { Brand } from "@/components/brand";
import { CampaignImage } from "@/components/campaign-image";
import { Comments } from "@/components/comments";
import { ContributionForm } from "@/components/contribution-form";
import { Fundraising } from "@/components/fundraising";

export const dynamic = "force-dynamic";
export default function Home() {
  const images = [
    { ...campaign.images.hero, src: "/images/imagem 1.webp", alt: "Gabriela em sua cadeira de rodas em frente à casa", reuseAuthorized: true },
    { ...campaign.images.story, src: "/images/imagem 2.webp", alt: "Gabriela acompanhada de uma familiar em frente à casa", reuseAuthorized: true },
    { ...campaign.images.hero, src: "/images/imagem 3.png", alt: "Gabriela em casa, sentada em sua cadeira de rodas rosa", reuseAuthorized: true },
  ];
  function storyParagraph(paragraph: string) {
    return <p key={paragraph} className={paragraph.startsWith("Não queremos") ? "destaque-historia" : undefined}>{paragraph.startsWith("Não queremos") ? <strong>{paragraph}</strong> : paragraph.split(/(R\$ (?:114|15|129) mil)/g).map((part,index) => part.startsWith("R$") ? <strong key={index}>{part}</strong> : part)}</p>;
  }
  return <div className="recipiente-campanha">
    <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
    <header className="topo-campanha"><Brand config={campaign} /><nav className="navegacao-campanha" aria-label="Navegação principal"><a href="#historia">Sua história</a><a href="#necessidades">O que ela precisa</a><a href="#contribuir-agora" className="header-cta">Quero apoiar <Heart size={15} aria-hidden="true" /></a></nav></header>
    <main id="conteudo">
      {!campaign.publicationReady && <p className="aviso-previa" role="status">Prévia da campanha · contribuições ainda não liberadas</p>}
      <section className="cabecalho-caso" aria-labelledby="titulo-campanha">
        <div className="hero-titulo"><p className="sobretitulo">Juntos pela Gabriela</p><h1 id="titulo-campanha">{campaign.title}</h1></div>
        <div className="hero-fotografia"><CampaignImage image={images[0]} variant="hero" /></div>
        <div className="hero-detalhes"><p className="hero-resumo">Gabriela tem 15 anos. Hoje, sair de casa depende da ajuda de alguém. Uma cadeira motorizada adequada pode ajudá-la a conquistar mais autonomia.</p><p className="hero-conexao">Conheça sua história. Faça parte de uma nova possibilidade de futuro.</p><a className="cta-principal" href="#contribuir-agora">Quero apoiar Gabriela <ArrowUpRight size={20} aria-hidden="true" /></a><a className="link-historia" href="#historia">Conheça sua história ↓</a><Fundraising config={campaign} /></div>
      </section>
      <section id="historia" className="secao-historia" aria-labelledby="historia-titulo">
        <div className="historia-intro"><p className="sobretitulo">Para além da porta de casa</p><h2 id="historia-titulo">Uma história que merece<br />novas possibilidades.</h2></div>
        <article className="narrativa-campanha" aria-label="História da Gabriela">
          <div className="historia-layout"><div>{campaign.story[0].paragraphs.slice(0, 3).map(storyParagraph)}</div><CampaignImage image={images[1]} variant="story" /></div>
          <div className="historia-continuacao">{campaign.story[0].paragraphs.slice(3).map(storyParagraph)}</div>
        </article>
      </section>
      <section id="autonomia" className="secao-autonomia" aria-labelledby="autonomia-titulo">
        <div className="autonomia-layout"><CampaignImage image={images[2]} variant="autonomy" /><div className="autonomia-texto"><p className="sobretitulo">Autonomia e futuro</p><h2 id="autonomia-titulo">Mais liberdade para<br />ir além da porta de casa.</h2>{storyParagraph(campaign.story[1].paragraphs[1])}<p className="autonomia-conexao">Uma cadeira adequada é uma possibilidade de escolher caminhos e participar mais da vida ao seu redor.</p><a className="link-autonomia" href="#necessidades">Entenda como sua ajuda pode fazer parte <ArrowUpRight size={18} aria-hidden="true" /></a></div></div>
      </section>
      <section className="historia-cuidado" aria-labelledby="cuidado-titulo"><div className="historia-continuacao"><p className="sobretitulo">Uma oportunidade de cuidado</p><h2 id="cuidado-titulo">Um caminho para mais autonomia</h2>{campaign.story[1].paragraphs.filter((_, index) => index !== 1).map(storyParagraph)}</div></section>
      <section id="necessidades" className="secao-objetivo" aria-labelledby="objetivo-titulo"><p className="sobretitulo">O que queremos tornar possível</p><h2 id="objetivo-titulo">Cuidado e autonomia,<br />um passo de cada vez.</h2><div className="grade-necessidades"><div className="necessidade"><Stethoscope size={26} aria-hidden="true" /><h3>Possibilidade de cirurgia</h3><p className="necessidade-valor">R$ 114 mil</p><p>Estimativa pesquisada pela família. A indicação e os possíveis benefícios dependem de avaliação médica especializada.</p><span>Procedimento a confirmar</span></div><div className="necessidade"><Accessibility size={26} aria-hidden="true" /><h3>Cadeira motorizada</h3><p className="necessidade-valor">R$ 15 mil</p><p>Uma cadeira adequada, com comando adaptado à força das mãos, para buscar mais independência nos deslocamentos.</p><span>Custo aproximado</span></div><div className="necessidade necessidade-total"><Heart size={26} aria-hidden="true" /><h3>Objetivo da campanha</h3><p className="necessidade-valor">R$ 129 mil</p><p>Soma estimada das duas necessidades. Uma oportunidade de mais dignidade e qualidade de vida para Gabriela.</p><span>Meta total estimada</span></div></div><p className="objetivo-nota">A campanha busca possibilidades de cuidado. Não há promessa de cura ou de resultado cirúrgico.</p></section>
      <ContributionForm config={campaign.contribution} />
      {campaign.comments.some(comment => comment.authorized) && <Comments comments={campaign.comments} />}
    </main>
    <footer className="rodape-campanha"><Brand config={campaign} footer /><p>Solidariedade que abre caminhos.</p><a href="#historia">Conheça a história</a><span> · </span><a href="#contribuir-agora">Apoie a campanha</a></footer>
  </div>;
}
