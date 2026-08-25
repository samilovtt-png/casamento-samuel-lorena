
const weddingDate = new Date("2027-02-14T15:00:00-03:00");
function tick(){
  let d = weddingDate - new Date();
  if(d <= 0) return;
  const days = Math.floor(d/86400000); d%=86400000;
  const hours = Math.floor(d/3600000); d%=3600000;
  const minutes = Math.floor(d/60000);
  const seconds = Math.floor((d%60000)/1000);
  document.getElementById("days").textContent=days;
  document.getElementById("hours").textContent=hours;
  document.getElementById("minutes").textContent=minutes;
  document.getElementById("seconds").textContent=seconds;
}
tick(); setInterval(tick,1000);

const intro=document.getElementById("intro");
const music=document.getElementById("bgMusic");
const musicToggle=document.getElementById("musicToggle");
document.getElementById("openInvite").onclick=async()=>{
  intro.classList.add("hidden");
  try{await music.play(); musicToggle.textContent="❚❚"}catch(e){}
};
musicToggle.onclick=async()=>{
  if(music.paused){try{await music.play();musicToggle.textContent="❚❚"}catch(e){}}
  else{music.pause();musicToggle.textContent="♫"}
};

document.getElementById("rsvpForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const text=`Olá! Quero confirmar minha presença no casamento de Samuel & Lorena.\n\nNome: ${f.get("nome")}\nQuantidade: ${f.get("pessoas")}\nMensagem: ${f.get("mensagem")||""}`;
  window.open("https://wa.me/5519998350381?text="+encodeURIComponent(text),"_blank");
});

async function copyPixPayload(){
  const payload=`00020126360014BR.GOV.BCB.PIX0114+55199983503815204000053039865802BR5923SAMUEL F LAUREANO LOPEZ6011HORTOLANDIA62070503***63041773`;
  try{await navigator.clipboard.writeText(payload)}catch(e){
    const t=document.getElementById("pixPayload"); t.select(); document.execCommand("copy");
  }
  const toast=document.getElementById("toast");
  toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),1800);
}



/* V11 — confirmação e cálculo por convidado */
(function(){
  const adults = document.getElementById("adultGuests");
  const children = document.getElementById("childGuests");
  const totalEl = document.getElementById("confirmationTotal");
  const form = document.getElementById("rsvpForm");
  if(!adults || !children || !totalEl || !form) return;

  function updateConfirmationTotal(){
    const a = Number(adults.value || 0);
    const c = Number(children.value || 0);
    const total = (a * 200) + (c * 100);
    totalEl.textContent = total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
    return total;
  }

  adults.addEventListener("change", updateConfirmationTotal);
  children.addEventListener("change", updateConfirmationTotal);
  updateConfirmationTotal();

  form.addEventListener("submit", function(e){
    e.preventDefault();
    const f = new FormData(form);
    const a = Number(f.get("adultos") || 0);
    const c = Number(f.get("criancas") || 0);
    const total = (a * 200) + (c * 100);
    if(a + c < 1){
      alert("Selecione pelo menos um convidado.");
      return;
    }
    const valor = total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
    const text =
      `Olá! Quero confirmar minha presença no casamento de Samuel & Lorena.\n\n` +
      `Nome: ${f.get("nome")}\n` +
      `Adultos: ${a}\n` +
      `Crianças até 10 anos: ${c}\n` +
      `Valor da confirmação: ${valor}\n` +
      `Mensagem: ${f.get("mensagem") || ""}`;
    window.open("https://wa.me/5519998350381?text="+encodeURIComponent(text),"_blank");
  });
})();

/* V18 — Galeria em tela cheia */
(function(){
  const items = Array.from(document.querySelectorAll(".couple-gallery-item img"));
  const box = document.getElementById("galleryLightbox");
  const image = document.getElementById("galleryLightboxImage");
  const close = document.getElementById("galleryClose");
  const prev = document.getElementById("galleryPrev");
  const next = document.getElementById("galleryNext");
  const counter = document.getElementById("galleryCounter");
  if(!items.length || !box || !image) return;

  let index = 0;

  function show(i){
    index = (i + items.length) % items.length;
    image.src = items[index].src;
    image.alt = items[index].alt || "Foto de Samuel e Lorena";
    counter.textContent = `${index + 1} / ${items.length}`;
  }
  function open(i){
    show(i);
    box.classList.add("open");
    box.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function hide(){
    box.classList.remove("open");
    box.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  items.forEach((img,i)=>{
    const figure = img.closest(".couple-gallery-item");
    figure.addEventListener("click",()=>open(i));
    figure.addEventListener("keydown",e=>{
      if(e.key==="Enter" || e.key===" "){e.preventDefault();open(i);}
    });
  });
  close.addEventListener("click",hide);
  prev.addEventListener("click",()=>show(index-1));
  next.addEventListener("click",()=>show(index+1));
  box.addEventListener("click",e=>{if(e.target===box) hide();});
  document.addEventListener("keydown",e=>{
    if(!box.classList.contains("open")) return;
    if(e.key==="Escape") hide();
    if(e.key==="ArrowLeft") show(index-1);
    if(e.key==="ArrowRight") show(index+1);
  });
})();
