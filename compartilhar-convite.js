(() => {
  const url = 'https://casamento-samuel-lorena.vercel.app/';
  const message = 'Samuel & Lorena\n\nEsperamos você para celebrar conosco!\n14 de fevereiro de 2027 · 11h45\n\nAcesse o nosso convite:\n' + url;
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
