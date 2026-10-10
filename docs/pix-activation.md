# PIX da campanha Ajude Gabriela

## Ativação autorizada — 2026-10-10

A responsável solicitou ativar e publicar o PIX, forneceu imagem da página da Vakinha com título Ajude Gabriela, ID 6384186 e chave exclusiva `6384186@vakinha.com.br`, e informou que a recebedora é a Vakinha. Essa evidência foi registrada em `confirmationReference`. Os indicadores de autorização representam essa confirmação da responsável, não uma consulta bancária/DICT nem aprovação específica emitida pelo suporte Vakinha.

O modo ativo é `authorized-static`. A API gera BR Code com a chave indicada e o valor selecionado em centavos, sem alterar a arrecadação. QR e Copia e Cola usam o mesmo payload validado com CRC16. O modal mostra VAKINHA como recebedora informada e orienta conferir os dados no aplicativo do banco. O nome VAKINHA é identificação comercial no BR Code, não o resultado de uma consulta cadastral bancária. PORTO ALEGRE é a cidade da plataforma publicada no rodapé de seu site, não a cidade da família de Gabriela.

## Fontes e limites

A [Vakinha documenta](https://www.vakinha.com.br/blog/como-doar-via-pix-no-vakinha/) doações diretamente pela chave ID@vakinha.com.br e também QR/checkout da própria plataforma. O [manual do Banco Central](https://aprendervalor.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf) especifica QR estático com chave e valor. O código local é uma instrução de transferência por chave, não uma cobrança oficial da Vakinha.

Nenhuma transferência foi feita durante os testes. O aplicativo bancário é que resolve a chave e mostra o recebedor real antes de confirmar. Testes locais comprovam estrutura e valor, não cadastro da chave, aceitação pelo banco nem liquidação/contabilização pela plataforma.

Não existe estado `paid`, botão que declare pagamento ou aumento automático da arrecadação. O QR usa txid `***`; conciliação individual e confirmação automática dependem de dados transacionais autorizados, integração autenticada Vakinha/PSP e persistência com identificação, valor, recebedor e deduplicação. Essa integração não foi inventada.

## Desativação

Definir `pix.enabled: false` bloqueia a API, sem devolver payload. Ausência de confirmações, autorização específica para QR, nome/cidade válidos ou referência também bloqueia. As flags não podem ser alteradas por uma requisição do navegador.

Design, narrativa e três imagens preservados. Nenhum deploy manual foi executado. O push pode acionar a integração automática GitHub/Vercel configurada pelo usuário.