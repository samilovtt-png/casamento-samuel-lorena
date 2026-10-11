(() => {
  const dialog = document.getElementById('dressDialog');
  const names = {madrinhas: 'Madrinhas', padrinhos: 'Padrinhos', convidados: 'Convidados'};
  document.querySelectorAll('[data-dress]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('dressTitle').textContent = names[button.dataset.dress];
      dialog.showModal();
    });
  });
  document.getElementById('dressClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
})();
