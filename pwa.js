/* V58 — instalação e navegação do PWA. Não altera RSVP, Pix, doações ou fotos. */
(function(){
  const installButton = document.getElementById('installAppButton');
  const toast = document.getElementById('pwaToast');
  let deferredPrompt = null;

  function showToast(message, ms=4500){
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(()=>toast.classList.remove('show'), ms);
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => console.warn('PWA SW:', err));
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if(installButton) installButton.classList.add('show');
  });

  if(installButton){
    installButton.addEventListener('click', async () => {
      if(deferredPrompt){
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installButton.classList.remove('show');
        return;
      }
      const ua = navigator.userAgent;
      const ios = /iphone|ipad|ipod/i.test(ua);
      if(ios){
        showToast('No Safari: toque em Compartilhar e depois em “Adicionar à Tela de Início”.', 6500);
      }else{
        showToast('Abra o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.', 5500);
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if(installButton) installButton.classList.remove('show');
    showToast('Aplicativo instalado com sucesso ✓');
  });

  // iOS does not expose beforeinstallprompt; offer the helper only on Safari mobile.
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if(isIOS && !standalone && installButton) installButton.classList.add('show');

  // Highlight the section currently visible in the bottom app navigation.
  const links = Array.from(document.querySelectorAll('.pwa-bottom-nav a[href^="#"]'));
  const targets = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window && targets.length){
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id));
    }, {rootMargin:'-25% 0px -60% 0px', threshold:[0,.15,.4]});
    targets.forEach(target => observer.observe(target));
  }
})();
