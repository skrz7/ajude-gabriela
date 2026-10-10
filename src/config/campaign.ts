export interface CampaignImage {
  src: string | null;
  alt: string;
  caption: string;
  reuseAuthorized: boolean;
  referenceUrl: string;
}

export interface AuthorizedComment {
  id: string;
  author: string;
  text: string;
  publishedAt: string; // ISO 8601: use uma data real; nunca um tempo relativo fixo.
  authorized: boolean;
  verified: boolean;
}

export interface CampaignConfig {
  name: string;
  title: string;
  publicationReady: boolean;
  contentApproved: boolean;
  fundraising: {
    confirmed: { goalCents: number; raisedCents: number; verifiedAt: string; source?: string } | null;
    estimatedGoalCents: number;
  };
  story: { heading: string; paragraphs: string[] }[];
  images: { logo: CampaignImage; hero: CampaignImage; story: CampaignImage };
  contribution: { suggestedCents: number[]; minCents: number; maxCents: number; defaultCents: number };
  pix: {
    key: string;
    enabled: boolean;
    ownershipConfirmed: boolean;
    beneficiaryConfirmed: boolean;
    campaignUseAuthorized: boolean;
    platformFlowConfirmed: boolean;
    confirmationReference: string;
    beneficiaryName: string;
    officialCampaignUrl: string;
    // A chave Vakinha usa o fluxo oficial. Não gera cobranças independentes.
    mode: "official-checkout";
  };
  comments: AuthorizedComment[];
}

export const campaign: CampaignConfig = {
  name: "Avance com Gabi",
  title: "Uma chance de devolver o mundo à Gabriela",
  publicationReady: false,
  contentApproved: false,
  fundraising: {
    confirmed: {
      goalCents: 12_900_000,
      raisedCents: 4_768_329,
      verifiedAt: "2026-10-10T22:55:08Z",
      source: "Valor informado pelo responsável pela campanha",
    },
    estimatedGoalCents: 12_900_000,
  },
  story: [
  {
    "heading": "Conheça a história da Gabriela",
    "paragraphs": [
      "A Gabriela tem quinze anos e faz meses que não passa da porta da casa da avó, onde a família mora nos fundos.",
      "Ela nasceu com uma má-formação, não sente nada da cintura para baixo e depende de alguém para ir a qualquer lugar. Os braços não têm força para girar as rodas da cadeira, então sair sozinha nunca foi possível.",
      "Mas o mundo dela nem sempre foi tão pequeno. Os pais serviam a igreja num lugar longe, no interior. Quando o trabalho acabou de um dia para o outro, devolveram a casa, o carro e a vida que conheciam. Depois vieram o aluguel atrasado e o despejo.",
      "Hoje, os quatro vivem no quartinho dos fundos. O pai pega diária descarregando caminhão, a mãe dedica boa parte do tempo aos cuidados da Gabriela. A Sofia, irmã de dezessete anos, vende na escola as pulseiras de miçanga que a Gabriela monta durante o dia.",
      "Este ano, Gabriela parou de estudar. Cansou dos apelidos, cansou de depender dos outros, cansou de ser carregada no colo na frente de todo mundo.",
      "A cadeira em que passa o dia foi doada. É pequena demais para ela, deixa seu corpo torto e dificulta ainda mais sua rotina."
    ]
  },
  {
    "heading": "Um caminho para mais autonomia",
    "paragraphs": [
      "Além de uma cadeira adequada, Gabriela precisa de uma avaliação médica especializada para investigar sua má-formação e verificar se existe uma cirurgia que possa melhorar sua condição de vida. A família pesquisou uma possibilidade de cirurgia complexa para corrigir uma complicação da coluna, com custo estimado de R$ 114 mil. Ainda é necessário confirmar com especialistas se esse procedimento é realmente indicado para o caso dela e quais benefícios poderia trazer.",
      "A cadeira de rodas motorizada, que custa aproximadamente R$ 15 mil, também pode transformar sua rotina. Com um comando adaptado à força que ela tem nas mãos, Gabriela poderia conquistar mais autonomia para se deslocar e ter a oportunidade de sair de casa sem depender sempre de alguém empurrando sua cadeira.",
      "Somando os dois valores, a família estima precisar de R$ 129 mil para essas duas necessidades.",
      "Uma família que já devolveu casa, carro e quase tudo o que tinha não consegue alcançar esse objetivo sozinha.",
      "Por isso, queremos buscar ajuda. Para que Gabriela tenha a oportunidade de receber uma avaliação médica adequada, descobrir quais tratamentos são possíveis e conquistar uma cadeira que lhe permita explorar o mundo para além da porta de casa.",
      "Não queremos prometer uma cura. Queremos dar à Gabriela uma oportunidade real de viver com mais autonomia, dignidade e qualidade de vida.",
      "Qualquer ajuda, compartilhamento ou gesto de solidariedade pode aproximar essa família de uma nova possibilidade de futuro."
    ]
  }
],
  images: {
    logo: {
      src: null,
      alt: "Avance com Gabi",
      caption: "Identidade da campanha aguardando arquivo autorizado.",
      reuseAuthorized: false,
      referenceUrl: "",
    },
    hero: {
      src: null,
      alt: "Fotografia da campanha de Gabriela",
      caption: "Imagem 1 · fotografia da campanha a adicionar.",
      reuseAuthorized: false,
      referenceUrl: "",
    },
    story: {
      src: null,
      alt: "Fotografia da história de Gabriela e sua família",
      caption: "Imagem 2 · fotografia da campanha a adicionar.",
      reuseAuthorized: false,
      referenceUrl: "",
    },
  },
  contribution: {
    suggestedCents: [3000, 5000, 7500, 10000, 15000, 25000, 50000, 70000],
    minCents: 3000,
    maxCents: 100000,
    defaultCents: 4500,
  },
  pix: {
    key: "6384186@vakinha.com.br",
    enabled: false,
    ownershipConfirmed: false,
    beneficiaryConfirmed: false,
    campaignUseAuthorized: false,
    platformFlowConfirmed: false,
    confirmationReference: "",
    beneficiaryName: "",
    officialCampaignUrl: "",
    mode: "official-checkout",
  },
  comments: [],
};
