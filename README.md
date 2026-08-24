# Site de Casamento — Samuel & Lorena

Site estático pronto para publicar na Vercel.

## Dados já configurados
- Samuel Fernando Laureano Lopez
- Lorena Vittoria Serdeiro Imidio
- Data: 14/02/2027
- Horário: 15h
- Cerimônia: Estr. José Moura, 1370 - Batistini, São Bernardo do Campo - SP, 09844-190
- Recepção: R. Carlos Olávo Vicentini, 83 - Planalto, São Bernardo do Campo - SP, 09890-160

## O que você precisa trocar

### Fotos
Coloque suas fotos na pasta `assets` usando estes nomes:
- `capa.jpg`
- `foto1.jpg`
- `foto-final.jpg`

Você também pode editar o HTML para colocar imagens reais na galeria.

### Música
Coloque a música desejada como:
- `assets/musica.mp3`

### WhatsApp do RSVP
Abra `script.js` e troque:
`const whatsapp = "5519999999999";`

Use o formato:
`55 + DDD + número`

### Chave Pix
Abra `index.html` e procure:
`COLOQUE-SUA-CHAVE-PIX-AQUI`

Substitua pela chave Pix desejada.

## Como publicar na Vercel
1. Crie uma conta no GitHub.
2. Crie um novo repositório.
3. Envie todos os arquivos deste projeto.
4. Entre em vercel.com.
5. Clique em **Add New > Project**.
6. Importe o repositório.
7. Clique em **Deploy**.

Como é um site estático, não precisa configurar framework ou build command.
