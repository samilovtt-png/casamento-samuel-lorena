# Painel dos noivos

Acesso: `/noivos`, com a mesma conta Supabase autorizada pelo servidor em `api/_galeria.js`. Nenhum dado de convidados/pagamentos é embutido na página pública. O token da sessão fica apenas na memória; ao sair os dados são removidos da página. A sessão expirada exige novo login.

## Dados e cálculos
- Confirmações novas: `confirmacoes_casamento`; pessoas individuais têm nome, categoria declarada e chegada. Crianças até 10 anos seguem a regra do formulário anterior. Adultos sem categoria não são atribuídos a homens ou mulheres por inferência.
- Confirmados e comparecimento são números separados. Grupos antigos sem nomes individuais mantêm sua quantidade e aparecem com identificação de grupo.
- Presentes: `pedidos`, `itens_pedido`, `pagamentos`. Valores em centavos; pagamentos `pago` são deduplicados por transação. Pedidos pendentes ou com erro não são arrecadação. Estornados/cancelados/reembolsados não entram no recebido. Pedido pago sem registro de pagamento usa seu total como compatibilidade; não há botão de confirmar pagamento manualmente.
- O relatório identifica os próximos doadores pelo nome solicitado no checkout. Pedidos antigos podem aparecer como Nome não informado.
- As confirmações antigas permanecem na planilha Google. Esta entrega passa as novas confirmações para o banco, sem importar automaticamente a planilha. Para incorporá-la será necessário o arquivo exportado ou acesso de leitura autorizado à planilha. Não inferir dados ausentes.
- Pix e pagamentos realizados fora do checkout não são conciliados automaticamente.

## Segurança e validação
- Tabelas novas com RLS e sem leitura/escrita para anon/authenticated. Apenas endpoints do servidor usam privilégios de serviço. O RPC de limite é SECURITY INVOKER e executável apenas por service_role.
- POST RSVP normaliza campos, ignora flags de chegada públicas, limita envios por hash HMAC do IP e usa idempotência por ID/hash de conteúdo.
- Marcar chegada exige login dos noivos e versão atual do registro; conflitos retornam 409.
- API do painel usa Cache-Control private,no-store; não é cacheada pelo service worker.
- Exportações CSV neutralizam fórmulas em nomes informados por usuários.
- Limite de leitura de 20 mil registros por tabela: falha explícita em vez de mostrar totais incompletos.
- Testes: `node --test tests/painel-noivos.test.cjs`.
