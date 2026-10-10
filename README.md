# Ajude Gabriela

Reconstrução local independente em **Next.js App Router, React, TypeScript e Tailwind CSS**.
Diretório: `C:\Users\skrz\dev\ajude-gabriela`.

**Estado da entrega:** código implementado; instalação e validação da aplicação Next.js bloqueadas pela rede do sandbox. Não houve deploy, cobrança ou alteração do site original.

## Instalar e executar

Requer Node.js **22.18 ou superior** (recomendado: Node.js 24 LTS), npm e acesso ao registro oficial de pacotes.

```powershell
Set-Location 'C:\Users\skrz\dev\ajude-gabriela'
npm install
npm run dev
```

Abra **http://127.0.0.1:3000**. O servidor de desenvolvimento fica restrito ao computador local.

O ambiente usado para esta entrega não pode baixar dependências. `npm install --offline` foi tentado e falhou com `ENOTCACHED`. A escrita no diretório funciona. Para instalar e executar os testes completos, é necessário **permitir a saída de rede HTTPS para `registry.npmjs.org`** no ambiente, ou fornecer as dependências por um mecanismo autorizado. Para instalar os navegadores do Playwright, também é necessário acesso aos servidores de download oficiais do Playwright. Nenhum bloqueio foi contornado.

Não existe `package-lock.json` porque a instalação não foi concluída. Após instalar, revise as versões resolvidas e mantenha o lockfile no controle de versão; nas instalações seguintes, use `npm ci`. Não execute `npm audit fix --force` sem revisar mudanças.

## Estrutura

```text
src/
  app/
    api/contributions/route.ts   validação no servidor e bloqueio do recebimento
    globals.css                 medidas, cores e breakpoints do HTML fornecido
    layout.tsx                  metadados, idioma, indexação bloqueada na prévia
    page.tsx                    composição da campanha
  components/
    brand.tsx                   logo local autorizado ou nome textual
    campaign-image.tsx          imagens locais ou espaço reservado
    comments.tsx                somente comentários verificados e autorizados
    contribution-form.tsx       sugestões, campo livre, erros e modal
    fundraising.tsx             referência histórica e progresso confirmado
    pix-modal.tsx               dialog acessível e fluxo oficial bloqueado
    pix-code.tsx                QR e copiar: preparado para cobrança oficial futura
  config/campaign.ts            configuração central da campanha
  lib/
    clipboard.ts                copiar com confirmação e tratamento de falhas
    fundraising.ts              cálculo da arrecadação
    money.ts                    centavos inteiros e validação
    payment.ts                  confirmações obrigatórias e link oficial
    pix-payload.ts              validação estrutural BR Code e CRC16
public/images/README.md         orientação para imagens aprovadas
tests/
  core.test.mjs                 valores, progresso, bloqueio, URL e clipboard
  pix.test.mjs                  fixtures PIX sintéticas, sem transferência
  e2e/campaign.spec.ts          responsividade, modal, API e acessibilidade
docs/
  reconnaissance.md            referência, recursos e decisões
  verification.md              resultados reais e verificações pendentes
```

## Configuração central

Edite `src/config/campaign.ts`. Valores financeiros são **centavos inteiros**.

- Nome, título e narrativa: `name`, `title`, `story`.
- Meta estimada: `fundraising.estimatedGoalCents` (R$ 129.000). Arrecadação e progresso aguardam confirmação.
- Dados reais: `fundraising.confirmed` com `goalCents`, `raisedCents` e `verifiedAt` ISO 8601. Inicialmente `null`.
- Imagens e logo: `images`, com caminho `/images/...` e `reuseAuthorized: true` após aprovação e cópia dos arquivos para `public/images`.
- Valores sugeridos e limites: `contribution`; R$ 30 a R$ 1.000, inclusive, com até duas casas decimais.
- Comentários: `comments`, com autor, texto, data real e ambos `authorized` e `verified` verdadeiros. Não reutilize os horários relativos do HTML original como datas novas.
- Chave e beneficiário: `pix`. Chave informada: `6384186@vakinha.com.br`, **recebimento desativado**.

A barra histórica mostra aproximadamente 65% com aviso explícito de que não é arrecadação atual confirmada. O progresso atual só é calculado quando existem dados confirmados válidos. Não há aumentos automáticos ou registros simulados.

## PIX e ativação posterior

O site atual não gera, transmite nem permite copiar um código de pagamento. O modal mostra o valor selecionado e informa a indisponibilidade. O servidor também bloqueia qualquer tentativa direta de contribuição.

As orientações oficiais da Vakinha distinguem a doação direta pela chave da campanha do QR Code/Copia e Cola obtido no checkout:

- [Como doar via Pix no Vakinha](https://www.vakinha.com.br/blog/como-doar-via-pix-no-vakinha/)
- [Chave personalizada da campanha](https://www.vakinhapix.com.br/blog/dicas-sobre-pix/como-ter-pix-personalizado-da-minha-vaquinha-online/)

A documentação consultada **não prova que uma cobrança oficial seja obrigatória para transferir pela chave**. Também não confirma a titularidade, a vinculação à Gabriela ou a autorização de criar QR Code independente para esta chave. Por isso foi escolhido o **checkout oficial** para futura ativação. Não foi identificada uma API oficial documentada de geração de cobranças para integrar agora.

Somente depois de a responsável confirmar os dados:

1. Registre as confirmações em `ownershipConfirmed`, `beneficiaryConfirmed`, `campaignUseAuthorized` e `platformFlowConfirmed`.
2. Preencha `beneficiaryName` com a identificação confirmada e `confirmationReference` com a referência da aprovação.
3. Confirme no site da Vakinha a campanha associada ao ID da chave. Configure `officialCampaignUrl` com o URL HTTPS oficial por ID, sem query ou hash. O código aceita exclusivamente `https://www.vakinha.com.br/6384186` para a chave atual; o destino **ainda não foi validado**.
4. Confirme conteúdo e arrecadação e marque `contentApproved`, `publicationReady` e `pix.enabled` somente quando apropriado.

O fluxo então oferece um link para a Vakinha em nova aba. O valor fica indicado no modal, mas **não é transmitido automaticamente ao checkout**, pois não foi encontrado um parâmetro oficial documentado. O doador deve confirmar o valor na plataforma. O QR Code e o Copia e Cola vêm do fluxo oficial.

`PixCode` é um componente preparado, **não conectado à aplicação atual**. Caso a Vakinha forneça uma integração oficial autorizada, conecte somente os payloads retornados por essa integração, com validação de valor, beneficiário, validade e identificador da cobrança. O validador local trata um subconjunto de BR Code com valor explícito, campos obrigatórios e CRC16; **não verifica DICT, titularidade, liquidação ou URLs de cobranças dinâmicas**. Payloads dinâmicos sem valor explícito exigem validação pelo provedor. Não use dados do HTML antigo ou um payload fabricado.

Nenhuma tela informa pagamento aprovado. Confirmação de transação e atualização automática do total dependem de API/webhook oficial autenticado e reconciliado, ainda não implementado.

## Testes

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm test` usa o runner nativo do Node, sem processos filhos, e funciona sem dependências. Foram aprovados **13 testes**. Os testes de clipboard usam um objeto de teste; não comprovam o funcionamento da área de transferência de um navegador.

Lint, build, typecheck e E2E foram tentados, mas não executaram suas verificações porque os respectivos executáveis não estão instalados. Responsividade visual, acessibilidade automática e abertura/fechamento real do modal ainda precisam ser testados. A suíte E2E prepara cenários de 320 px, iPhone 13 e desktop, sem realizar cobranças.

Consulte `docs/verification.md` para os resultados completos.

## Fidelidade e pendências

O HTML enviado pelo usuário definiu cores (`#fbfaf7`, `#2b9964`, `#217a50`), largura de 763/905 px, fontes com fallback, enquadramentos, espaçamentos, contribuição e modal. A narrativa fornecida foi preservada. Os scripts antigos, rastreamento UTMify, carregador ofuscado e beacon Cloudflare não foram reutilizados.

As fontes Inter e Source Serif Pro não foram baixadas; são usadas as mesmas alternativas locais indicadas no HTML. As três imagens continuam pendentes de arquivo e autorização. Pequenos ajustes de acessibilidade incluem fechamento com alvo de 44 px, foco visível, modal nativo e fundos mais escuros em botões de texto branco.

Antes de publicar, confirmar: autorização da narrativa e imagens da menor, identidade visual, dados atuais de arrecadação, responsável, titularidade e beneficiário PIX, vínculo da chave à campanha, fluxo oficial Vakinha, comentários reais com datas e autorização, e revisão visual em dispositivos reais.

## Deploy posterior na Vercel

**Não foi feito deploy.** Quando houver autorização, instale dependências, conclua as confirmações e faça lint, typecheck, build e testes de navegador. Em seguida, o projeto pode ser importado como Next.js na Vercel, com comando `npm run build` e configuração padrão de saída. Não há credenciais ou variáveis secretas no projeto atual. Eventuais credenciais futuras de provedor devem existir somente no servidor e nas variáveis de ambiente da hospedagem.


## Revisão Gabriela

Título e história atualizados conforme o conteúdo fornecido. Meta estimada de R$ 129.000 (cirurgia: R$ 114.000; cadeira: R$ 15.000). Sem valor arrecadado confirmado e sem progresso inventado.

Coloque duas fotos autorizadas em public/images, usando imagem-1.jpg e imagem-2.jpg. A página seleciona as duas primeiras fotos em ordem alfabética/natural. A primeira foto aparece no Hero; a segunda acompanha os três primeiros parágrafos da história. O restante da narrativa usa uma coluna mais ampla. No mobile: título, foto principal, resumo e CTA. As fotos usam object-fit: contain, sem recorte.

PIX e publicação continuam bloqueados. Antes da ativação, confirmar conteúdo, dados reais de arrecadação e beneficiário/titularidade, vínculo e autorização da chave, URL e fluxo oficial da campanha.


## Ajuste da distribuição das fotografias

Hero em duas colunas no desktop: título/resumo/CTA/meta à esquerda e primeira fotografia à direita. No mobile: título, fotografia, resumo e CTA. Apenas a segunda fotografia acompanha o início da história; a narrativa restante segue em coluna central de até 800px. Fotos com next/image, sizes responsivos, prioridade no Hero e enquadramento completo sem filtros.

A pasta public/images continua sem fotografias; a inspeção dos enquadramentos reais depende dos arquivos. TypeScript, ESLint de src/tests e 13 testes unitários passaram. Build compilou, mas terminou com spawn EPERM; Playwright também não executou devido a spawn EPERM. História, valores e PIX preservados.
