# Verificação local

Data: 10/10/2026. Ambiente: PowerShell, Node.js 24.20.0, npm 11.19.0.

| Verificação | Resultado real |
| --- | --- |
| Diretório obrigatório | `C:\Users\skrz\dev\avance-com-lari` confirmado |
| Criação, leitura e remoção de arquivo temporário | Passou |
| `npm install --offline --cache .npm-cache --logs-dir .npm-cache/logs --no-audit --no-fund` | Bloqueado: `ENOTCACHED`, sem acesso de rede |
| `npm test` | **13 testes passaram; 0 falhas** |
| `npm run lint` | Não executado: `eslint` não instalado |
| `npm run build` | Não executado: `next` não instalado |
| `npm run typecheck` | Não executado: `tsc` não instalado |
| `npm run test:e2e` | Não executado: `playwright` não instalado |
| Testes visuais mobile/desktop | Pendentes; sem navegador disponível |
| Abertura, fechamento e foco real do modal | Pendentes; suíte E2E criada |
| Acessibilidade automática axe | Pendente; suíte E2E criada |
| Copiar código | Lógica aprovada com clipboard de teste; interação real no navegador pendente |
| BR Code e CRC16 | Fixture sintética aprovada; nenhuma chave real usada |
| Pagamentos reais | Nenhum executado |
| Deploy | Nenhum executado |

O primeiro teste pelo runner padrão do Node falhou porque o ambiente não permite criar seus processos filhos (`spawn EPERM`). O script foi ajustado para `--test-isolation=none`, opção nativa que executa a lógica no processo atual. Não foram alteradas permissões.

## Cobertura de lógica aprovada

Sugestões de contribuição, mínimo/máximo, centavos, entradas vazias/negativas/científicas, valores fracionários inválidos, histórico separado de dados confirmados, barra limitada a 100%, confirmação de data, recebimento bloqueado por padrão, todas as confirmações obrigatórias, domínio/ID oficial, erro de cópia e CRC16 com vetor independente `123456789 → 29B1`.

As fixtures e objetos aprovados de teste não modificam a configuração de produção, não abrem páginas bancárias e não emitem cobranças. A validação estrutural não comprova beneficiário, chave ativa ou liquidação.

## Como finalizar as verificações

Com acesso autorizado à rede, executar a sequência do README. Rodar E2E nos três viewports definidos e revisar capturas em `test-results`. Depois de receber as imagens autorizadas, repetir a revisão visual. Uma futura integração oficial deve ter testes de QR/cópia em navegador, expiração, respostas do provedor e webhook autenticado antes de permitir recebimento.

Para instalar as dependências falta acesso de rede HTTPS ao registro npm; a permissão de escrita no projeto já está concedida. Para recuperar as imagens falta download HTTPS do domínio público, além da autorização de reutilização. Não foi solicitada execução fora do sandbox.

## Verificação para publicação no GitHub — 2026-10-10

Projeto renomeado para `ajude-gabriela`. Dependências e artefatos locais excluídos pelo `.gitignore`.

- `npm test`: 14 testes aprovados.
- `npm run lint`: aprovado, com um aviso preexistente em `postcss.config.mjs` (`import/no-anonymous-default-export`).
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado.
- `npm run test:e2e`: 9 aprovados e 12 falhas; as falhas envolvem campo personalizado, abertura/fechamento e acessibilidade do modal, incluindo expectativas pelo título `Contribuições em pausa`. Avisos preexistentes de qualidade das imagens também foram emitidos. A publicação do código não altera o comportamento da aplicação nem resolve essas pendências.

Nenhum deploy foi realizado.