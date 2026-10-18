(() => {
  const dialog = document.getElementById('dressDialog');
  const names = {madrinhas: 'Madrinhas', padrinhos: 'Padrinhos', convidadas: 'Convidadas', convidados: 'Convidados'};
  const descriptions = {
    madrinhas: 'Vestido longo azul-marinho; sandália nude ou dourado discreto.',
    padrinhos: 'Terno azul-marinho, camisa branca, gravata azul-marinho e sapato marrom.',
    convidadas: 'Verde-sálvia, verde-oliva ou terracota.',
    convidados: 'Terno bege ou cinza-claro, com gravata verde ou terracota para acompanhar a paleta.'
  };
  document.querySelectorAll('[data-dress]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('dressTitle').textContent = names[button.dataset.dress];
      document.getElementById('dressDescription').textContent = descriptions[button.dataset.dress];
      document.querySelector('.dress-example-image').dataset.category = button.dataset.dress;
      document.getElementById('dressExample').alt = 'Sugestão de traje para ' + names[button.dataset.dress].toLowerCase();
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  document.getElementById('dressClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
})();
