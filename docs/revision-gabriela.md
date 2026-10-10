# Revisão da campanha Gabriela

Implementação existente atualizada, sem deploy.

- História integral e metadados atualizados.
- Visual editorial em creme e verde, hero com meta, história com duas fotos, três cards de necessidades e formulário de apoio.
- Meta estimada R$ 129.000; arrecadação desconhecida representada como null e progresso indisponível.
- PIX centralizado preservado e bloqueado.
- Pasta de imagens vazia na revisão: composição preparada, recorte real pendente das fotos.

## Verificação

TypeScript passou e 13 testes unitários passaram. Página local retornou HTTP 200, título novo presente e nomes antigos ausentes. ESLint sem erros (aviso preexistente em postcss.config.mjs).

Build compilou, mas a fase seguinte falhou com spawn EPERM. Playwright também foi impedido por spawn EPERM. Não há navegador conectado para revisão visual alternativa. Portanto, a inspeção visual e os testes de integração/acessibilidade devem ser executados localmente após adicionar as fotos.

Os documentos reconnaissance.md e verification.md registram a etapa anterior; não descrevem o conteúdo financeiro atual.


## Ajuste da distribuição das fotografias

Hero em duas colunas no desktop: título/resumo/CTA/meta à esquerda e primeira fotografia à direita. No mobile: título, fotografia, resumo e CTA. Apenas a segunda fotografia acompanha o início da história; a narrativa restante segue em coluna central de até 800px. Fotos com next/image, sizes responsivos, prioridade no Hero e enquadramento completo sem filtros.

A pasta public/images continua sem fotografias; a inspeção dos enquadramentos reais depende dos arquivos. TypeScript, ESLint de src/tests e 13 testes unitários passaram. Build compilou, mas terminou com spawn EPERM; Playwright também não executou devido a spawn EPERM. História, valores e PIX preservados.
