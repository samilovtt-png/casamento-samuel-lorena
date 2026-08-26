# Samuel & Lorena — Versão Elegante

Versão refinada do site com:
- paleta azul-marinho + champagne
- tipografia editorial e mais espaço visual
- capa e encerramento com recorte de imagem aprimorado
- locais da cerimônia e recepção em cartões elegantes
- projetos missionários com meta total destacada
- mapa, rotas e campos missionários sutis
- nova música
- RSVP via WhatsApp
- somente Pix Copia e Cola + QR Code


## V4
- seção Caminhos refeita com foto missionária, mapa em marca-d'água e layout mais romântico
- encerramento mais leve, com foto clara e frase menor
- restante do site preservado


## V9 — Paleta harmonizada
- unificação dos tons azul-marinho
- contraste suave entre azul noite, azul petróleo e azul profundo
- detalhes champagne mais discretos
- Pix integrado visualmente à seção de presentes
- transições de cor mais elegantes entre as páginas/seções


## V10 — Controle do Buffet
- seção de controle financeiro do buffet dentro do site
- valor total contratado
- total já pago
- saldo restante automático
- percentual pago com barra de progresso
- número de convidados
- valor médio por convidado
- próximo vencimento
- salvamento local no navegador


## V11 — Confirmação
- removido controle financeiro do buffet
- confirmação de presença com cálculo:
  - adulto R$ 200,00
  - criança até 10 anos R$ 100,00
- valor calculado automaticamente
- confirmação enviada via WhatsApp
- botão para pagamento pelo Pix já existente no site


## V12
- foto da seção Caminhos substituída pela foto do casal com girassol
- restante do site preservado


## V16 — Confirmação refinada
- formulário em cartão claro para melhor leitura
- preços de adulto e criança destacados
- total automático em maior evidência
- campos com melhor contraste
- botões em dois passos: WhatsApp e Pix
- layout responsivo aprimorado


## V22 — versão completa
- contagem regressiva até 14/02/2027 às 14h45
- botões rápidos de confirmar presença e como chegar
- RSVP com confirmação visual
- pagamento Pix em modal elegante
- galeria em tela cheia com legendas e navegação
- linha do tempo missionária Brasil, Argentina, Bolívia, Peru e Chile
- seção de versículo
- informações aos convidados: chegada, traje e localização
- final com frase mais marcante
- imagens otimizadas para carregamento mais rápido


## V23 — refinamento premium
- navegação fixa e discreta
- capa com hierarquia visual refinada
- nova seção Nossa História
- resumo elegante de data, horário e chegada
- galeria com filtros Nós dois / Nossa missão
- metas dos projetos com barras preparadas para progresso
- opção local “Já realizei o pagamento”
- rodapé premium
- melhorias de responsividade e espaçamento


## V24 — Ultra
- convite personalizado por família via URL: ?familia=Nome&max=4
- botão compartilhar convite
- arquivo .ics para adicionar ao calendário
- rota cerimônia → recepção
- projetos missionários interativos
- prazo RSVP configurável no JS (oculto enquanto não definido)
- envio de comprovante pelo WhatsApp
- galeria editorial com fotos favoritas
- imagens WebP e lazy-loading para melhor performance
- transparência sobre registro local do status de pagamento


## V25 — Música suave
- volume máximo reduzido para 18%
- fade-in de aproximadamente 5 segundos
- música começa somente após abrir o convite
- botão mais discreto para tocar/pausar
- pausa respeitada e salva neste navegador
- volume limitado para evitar entrada agressiva


## V26 FINAL
- transições discretas ao rolar
- loader S & L
- menu mobile compacto
- RSVP flutuante no celular
- resumo automático de convidados e valor
- swipe na galeria em tela cheia
- feedback visual ao copiar Pix
- meta tags para compartilhamento
- acessibilidade com reduced motion
- refinamentos de enquadramento e botões mobile


## V29 — Google Sheets conectado
A rota `/api/rsvp` já está configurada com o Web App do Google Apps Script fornecido para este casamento. A variável `GOOGLE_SHEETS_WEBHOOK_URL` continua suportada na Vercel e, se definida, substitui a URL embutida.

## V30 — Doações por projeto
- cada projeto missionário possui botão “Doar para este projeto”
- convidado informa nome e valor da doação
- projeto escolhido é gravado automaticamente
- nova aba `Doacoes` na Planilha Google
- campos: ID, data/hora, nome, projeto, valor, status, ID RSVP, origem, confirmação dos noivos e observações
- o Pix não é conciliado automaticamente; o registro é uma declaração do convidado e pode ser confirmado posteriormente pelos noivos
- após substituir o `Code.gs`, crie uma nova versão da implantação do Apps Script mantendo a mesma URL do Web App


## V31 — Fotos dos convidados
- Integração com Supabase Storage.
- Bucket: `fotos-casamento` (privado).
- Upload permitido para papel anônimo somente via INSERT, conforme política criada no Supabase.
- Tipos: JPEG, PNG, WEBP, HEIC/HEIF; limite de 25 MB por arquivo.
- A chave usada no navegador é a chave publicável (`sb_publishable_...`), nunca a chave secreta.
- As fotos são organizadas em pastas por data e nome do convidado.

V33: corrigido o botão "Pagar via Pix" para abrir o modal após o carregamento completo do HTML.


V45: área de fotos corrigida. O seletor funciona antes do Supabase carregar; o upload aguarda a conexão e o CSS da seção foi restaurado para layout em card responsivo.


V46: upload de fotos usa diretamente a API REST do Supabase Storage, sem CDN supabase-js, com mensagens de diagnóstico HTTP/rede.

## V48
- Corrigido o upload para as novas chaves publicáveis do Supabase.
- Removido `Authorization: Bearer sb_publishable_...` do envio de fotos.
- Mantido `apikey: sb_publishable_...` no navegador.
