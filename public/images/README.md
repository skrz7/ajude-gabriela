# Fotografias da Gabriela

Adicione as duas fotos autorizadas nesta pasta, preferencialmente como imagem-1.jpg e imagem-2.jpg (também aceita PNG, WebP e AVIF).

A página carrega as duas primeiras imagens em ordem alfabética/natural: imagem 1 no Hero, imagem 2 na história. Use apenas essas duas fotografias na pasta; mantenha logos em outra pasta. Quando não há arquivo correspondente na pasta, a configuração explícita em src/config/campaign.ts serve como alternativa.

No desktop, a primeira foto fica à direita do título e resumo no Hero; a segunda fica ao lado dos três primeiros parágrafos da história. O restante da história segue em uma coluna mais ampla.

No mobile, a ordem do Hero é título, primeira foto, resumo e botão. A segunda foto aparece depois dos três primeiros parágrafos. As fotos usam next/image, com carregamento prioritário no Hero e object-fit: contain para preservar o enquadramento completo. Nenhuma imagem fictícia foi criada.
