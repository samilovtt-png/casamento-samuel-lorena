
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


/* V22 — recursos adicionais */
(function(){
  // Contagem regressiva
  const target = new Date("2027-02-14T14:45:00-03:00").getTime();
  function updateCountdownPro(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const map = {cdDays:d, cdHours:h, cdMinutes:m, cdSeconds:s};
    Object.entries(map).forEach(([id,v]) => { const el=document.getElementById(id); if(el) el.textContent=v; });
  }
  updateCountdownPro();
  setInterval(updateCountdownPro,1000);

  // Sucesso visual do RSVP
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("rsvpSuccess");
  if(form && success){
    form.addEventListener("submit", () => {
      setTimeout(()=>success.classList.add("show"), 250);
    });
  }

  // Modal Pix
  const modal = document.getElementById("pixModal");
  const openBtn = document.getElementById("openPixModal");
  const closeBtn = modal ? modal.querySelector(".pix-modal-close") : null;
  if(openBtn && modal){
    openBtn.addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";});
  }
  function closePix(){
    if(!modal) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow="";
  }
  if(closeBtn) closeBtn.addEventListener("click",closePix);
  if(modal) modal.addEventListener("click",e=>{if(e.target===modal) closePix();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape") closePix();});

  const copyPix = document.getElementById("copyPixModal");
  const pixText = document.getElementById("pixModalPayload");
  if(copyPix && pixText){
    copyPix.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(pixText.value)}catch(e){pixText.select();document.execCommand("copy")}
      copyPix.textContent="Pix copiado ✓";
      setTimeout(()=>copyPix.textContent="Copiar Pix Copia e Cola",1600);
    });
  }

  // Legendas no lightbox existente
  const lb = document.getElementById("galleryLightbox");
  if(lb){
    const imgs = Array.from(document.querySelectorAll('.mission-gallery img,[class*="gallery"] img')).filter(i=>!i.closest('#galleryLightbox'));
    imgs.forEach(img=>{
      img.addEventListener("click",()=>{
        setTimeout(()=>lb.setAttribute("data-caption", img.getAttribute("data-caption") || img.alt || ""),20);
      });
    });
  }
})();

/* V23 — filtros da galeria e confirmação de pagamento */
(function(){
  const filterBtns = Array.from(document.querySelectorAll("[data-gallery-filter]"));
  const galleryImgs = Array.from(document.querySelectorAll('.mission-gallery img,[class*="mission-gallery"] img'));
  filterBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      filterBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const f=btn.dataset.galleryFilter;
      galleryImgs.forEach(img=>{
        img.classList.toggle("gallery-hidden", f!=="all" && img.dataset.category!==f);
      });
    });
  });

  const paidBtn=document.getElementById("paymentDoneBtn");
  const paidMsg=document.getElementById("paymentDoneMsg");
  if(paidBtn){
    const restore=()=>{
      const done=localStorage.getItem("samuelLorenaPaymentDone")==="1";
      paidBtn.classList.toggle("done",done);
      paidBtn.textContent=done?"✓ Pagamento marcado como realizado":"✓ Já realizei o pagamento";
      if(paidMsg) paidMsg.classList.toggle("show",done);
    };
    paidBtn.addEventListener("click",()=>{
      const done=localStorage.getItem("samuelLorenaPaymentDone")==="1";
      localStorage.setItem("samuelLorenaPaymentDone",done?"0":"1");
      restore();
    });
    restore();
  }
})();


/* V24 — personalização, compartilhamento, projetos e RSVP */
(function(){
  const params = new URLSearchParams(location.search);

  // Personalização por família:
  // ?familia=Silva&max=4
  const family = params.get("familia");
  const maxGuests = Number(params.get("max") || 0);
  const greet = document.getElementById("familyGreeting");
  const greetName = document.getElementById("familyGreetingName");
  if(family && greet && greetName){
    greetName.textContent = decodeURIComponent(family);
    greet.hidden = false;
  }

  // Limitar convidados se ?max=N estiver presente
  if(maxGuests > 0){
    const adult = document.getElementById("adultGuests");
    const child = document.getElementById("childGuests");
    function trimSelect(sel){
      if(!sel) return;
      [...sel.options].forEach(opt=>{
        if(Number(opt.value)>maxGuests) opt.remove();
      });
    }
    trimSelect(adult); trimSelect(child);
    if(adult && child){
      const enforce=()=>{
        let a=Number(adult.value||0), c=Number(child.value||0);
        if(a+c>maxGuests){
          child.value=String(Math.max(0,maxGuests-a));
          child.dispatchEvent(new Event("change"));
        }
      };
      adult.addEventListener("change",enforce);
      child.addEventListener("change",enforce);
    }
  }

  // Compartilhar
  const share = document.getElementById("shareWedding");
  if(share){
    share.addEventListener("click",async()=>{
      const data={title:"Casamento Samuel & Lorena",text:"Você está convidado para celebrar conosco em 14/02/2027 às 14h45.",url:location.href};
      if(navigator.share){ try{await navigator.share(data)}catch(e){} }
      else{
        try{await navigator.clipboard.writeText(location.href);share.textContent="Link copiado ✓";setTimeout(()=>share.textContent="Compartilhar convite",1600)}catch(e){}
      }
    });
  }

  // Prazo RSVP configurável: deixe vazio para ocultar
  const RSVP_DEADLINE = ""; // Ex.: "2027-01-31"
  const deadlineBox=document.getElementById("rsvpDeadlineBox");
  if(RSVP_DEADLINE && deadlineBox){
    const dt=new Date(RSVP_DEADLINE+"T23:59:59-03:00");
    deadlineBox.hidden=false;
    document.getElementById("rsvpDeadlineText").textContent=dt.toLocaleDateString("pt-BR");
    function upd(){
      const days=Math.max(0,Math.ceil((dt-Date.now())/86400000));
      document.getElementById("rsvpDeadlineCountdown").textContent=days?`${days} dias restantes`:"Prazo encerrado";
    } upd(); setInterval(upd,3600000);
  }

  // Enviar comprovante WhatsApp
  const receipt=document.getElementById("sendReceiptWhatsapp");
  if(receipt){
    const msg="Olá! Já realizei o pagamento da confirmação do casamento de Samuel & Lorena e gostaria de enviar o comprovante.";
    receipt.href="https://wa.me/5519998350381?text="+encodeURIComponent(msg);
  }

  // Projetos
  const projectData={
    passagens:{title:"Duas passagens missionárias",text:"Este projeto ajudará a custear duas passagens para que a missão continue atravessando fronteiras, alcançando comunidades e levando serviço, cuidado e esperança.",goal:"Meta: R$ 20.000"},
    container:{title:"Contêiner para as missões",text:"O contêiner será usado como estrutura de apoio para materiais, organização e recursos destinados a novos campos e ações missionárias.",goal:"Meta: R$ 40.000"},
    guine:{title:"Salas e igreja em Guiné-Bissau",text:"O objetivo é construir salas e um espaço de igreja para acolher, ensinar, servir a comunidade e criar um ponto permanente de esperança.",goal:"Meta: R$ 60.000"}
  };
  const modal=document.getElementById("projectModal");
  document.querySelectorAll(".project-detail-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const d=projectData[btn.dataset.project];
      if(!d||!modal)return;
      document.getElementById("projectModalTitle").textContent=d.title;
      document.getElementById("projectModalText").textContent=d.text;
      document.getElementById("projectModalGoal").textContent=d.goal;
      modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
    });
  });
  function closeProject(){if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
  const pmc=modal?modal.querySelector(".project-modal-close"):null;
  if(pmc)pmc.addEventListener("click",closeProject);
  if(modal)modal.addEventListener("click",e=>{if(e.target===modal)closeProject()});
  const pmp=document.getElementById("projectModalPix");
  if(pmp)pmp.addEventListener("click",closeProject);
})();
