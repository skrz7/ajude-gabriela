# Preparação e ativação do PIX

O recebimento permanece bloqueado. Não foi realizado deploy nem transferência.

## Validação local

16 testes unitários e 27 testes de navegador aprovados, incluindo valor com centavos, autorização incompleta, QR sintético com chave `.invalid`, recebedor, divergência de valor, API bloqueada, origem externa, acessibilidade e teclado. Lint, TypeScript e build aprovados. Os testes não verificam cadastro da chave no DICT, autorização da Vakinha nem liquidação bancária. Foram corrigidos a rejeição indevida de origem local pela API e o escape de foco do modal; design e imagens preservados.

## Verificação

- `src/config/campaign.ts`: `pix.enabled`, confirmações de titularidade, recebedor, autorização de campanha e fluxo estão desativadas; nome, cidade e referência documental estão vazios. `publicationReady` e `contentApproved` também estão desativados.
- `src/lib/payment.ts`: verifica valor e todas as confirmações antes de devolver checkout ou BR Code. O backend `/api/contributions` responde 503 enquanto indisponível; o navegador não pode liberar o recebimento enviando flags.
- `src/components/pix-modal.tsx`: exibe o bloqueio ou, depois da autorização, o recebedor e o valor. No modo estático, usa o componente existente `PixCode` sem alterar CSS, imagens ou narrativa.
- `src/lib/pix-payload.ts`: BR Code estático inclui chave, valor em reais com duas casas, moeda BRL, nome, cidade e CRC16. O validador confere estrutura, checksum e valor; não consulta o DICT nem prova titularidade.
- `PixCode`: QR e Copia e Cola usam exatamente o mesmo payload. Copiar ou gerar não registra pagamento, não aumenta arrecadação e não emite recibo.

## O que as fontes permitem concluir

A [Vakinha](https://www.vakinha.com.br/blog/como-doar-via-pix-no-vakinha/) documenta a doação direta para a chave `ID@vakinha.com.br`, separadamente do QR gerado no checkout. Seu [anúncio da chave própria](https://www.vakinha.com.br/blog/por-mais-seguranca-e-transparencia-vakinha-lanca-chave-pix-propria) descreve o uso como uma chave comum. Não há nessas fontes exigência de cobrança oficial para toda transferência direta.

O [Manual do Banco Central](https://aprendervalor.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf) especifica QR estático contendo chave e valor. É tecnicamente possível codificar uma chave de e-mail nesse formato. Isso não confirma o cadastro ou o vínculo da chave `6384186@vakinha.com.br` com Gabriela, nem a autorização da plataforma para apresentar um BR Code independente. A página pública por ID não pôde ser consultada nesta verificação.

## Pendências para liberar

1. Confirmar com a responsável e a Vakinha que a campanha ID 6384186 e a chave estão ativas e pertencem à campanha da Gabriela. Registrar evidência em `confirmationReference` sem segredos.
2. Confirmar o nome do recebedor mostrado pelo banco, que pode ser a plataforma e não Gabriela. Preencher `beneficiaryName` e a cidade oficial em `beneficiaryCity`; para BR Code, usar o nome confirmado em ASCII maiúsculo, até 25 caracteres, e cidade até 15. Não inventar esses dados.
3. Obter autorização de uso da chave, do conteúdo e do recebimento; revisar `ownershipConfirmed`, `beneficiaryConfirmed`, `campaignUseAuthorized`, `platformFlowConfirmed`, `contentApproved` e `publicationReady` com base em evidências.
4. Escolher o fluxo:
   - `official-checkout`: preencher e conferir a URL oficial. O link não transmite o valor selecionado; o doador precisa definir/conferir o valor na Vakinha. Não acrescentar parâmetros não documentados. Para garantir o valor nesse fluxo será necessária uma integração oficial documentada, ainda indisponível.
   - `authorized-static`: confirmar especificamente a autorização e o encaminhamento/contabilização pela Vakinha do QR externo, registrar essa evidência e habilitar `staticQrAuthorized`. O valor selecionado é incluído no BR Code. O banco determina os dados reais do recebedor; o nome no BR Code não substitui essa conferência.
5. Somente depois dessas confirmações definir `pix.enabled: true` e verificar o QR no aplicativo bancário autorizado, conferindo chave, recebedor e valor antes de qualquer transferência. Uma eventual transferência de validação exige autorização separada.

## Confirmação real

Não existe estado `paid`, botão de confirmação pelo doador ou atualização automática de arrecadação. O QR estático usa `txid` não individualizado (`***`); não oferece conciliação individual por si só. Para registrar doações pagas automaticamente, falta acesso autorizado a dados transacionais da Vakinha/PSP, persistência de doações e integração autenticada de consulta/webhook com verificação de recebedor, valor, identificador único, duplicatas e devoluções. Nenhum endpoint fictício ou comprovante enviado pelo navegador pode substituir essa confirmação.
