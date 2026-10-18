(() => {
  const url = 'https://casamento-samuel-lorena.vercel.app/';
  const message = 'Samuel & Lorena\n\nEsperamos você para celebrar conosco!\n14 de fevereiro de 2027 · 11h45\n\nAcesse o nosso convite:\n' + url;
  let invitationPhoto;
  const photoButton = document.getElementById('shareInvitationPhoto');
  fetch('/assets/capa-outubro-2026.jpg').then(response => {
    if (!response.ok) throw new Error('Foto indisponível');
    return response.blob();
  }).then(blob => {
    invitationPhoto = new File([blob], 'convite-samuel-lorena.jpg', {type: 'image/jpeg'});
    photoButton.disabled = false;
    photoButton.textContent = 'Enviar foto do convite';
  }).catch(() => { photoButton.textContent = 'Foto indisponível'; });
  photoButton.addEventListener('click', async () => {
    if (!invitationPhoto) return;
    if (navigator.canShare && navigator.canShare({files: [invitationPhoto]})) {
      try {
        await navigator.share({files: [invitationPhoto], title: 'Samuel & Lorena', text: message});
        return;
      } catch (error) { if (error.name === 'AbortError') return; }
    }
    const objectUrl = URL.createObjectURL(invitationPhoto);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = invitationPhoto.name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    feedback.textContent = 'Foto preparada para baixar. Anexe no WhatsApp e use Copiar mensagem para colocar o texto na legenda.';
  });
  document.getElementById('copyInvitationMessage').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(message); feedback.textContent = 'Mensagem copiada. Cole na legenda da foto no WhatsApp.'; }
    catch { feedback.textContent = message; }
  });
  const feedback = document.getElementById('invitationFeedback');
  document.getElementById('shareInvitation').addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({title: 'Samuel & Lorena', text: message}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
  document.getElementById('copyInvitation').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); feedback.textContent = 'Link do convite copiado.'; }
    catch { feedback.textContent = 'Não foi possível copiar automaticamente. Link: ' + url; }
  });
})();
