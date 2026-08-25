
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

document.getElementById("rsvpForm").addEventListener("legacy-rsvp-submit",e=>{
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

  form.addEventListener("legacy-rsvp-submit", function(e){
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
    form.addEventListener("rsvp-saved", () => {
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

/* V25 — controle de música suave com fade-in */
(function(){
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  const openInvite = document.getElementById("openInvite");
  if(!music) return;

  const TARGET_VOLUME = 0.18;
  const FADE_MS = 5000;
  const FADE_STEP = 100;
  let fadeTimer = null;
  let userPaused = localStorage.getItem("samuelLorenaMusicPaused") === "1";

  function stopFade(){
    if(fadeTimer){ clearInterval(fadeTimer); fadeTimer = null; }
  }

  function setButtonState(){
    if(!toggle) return;
    toggle.classList.toggle("is-playing", !music.paused);
    const label = toggle.querySelector(".music-label");
    if(label) label.textContent = music.paused ? "Música" : "Música";
    toggle.setAttribute("aria-label", music.paused ? "Tocar música" : "Pausar música");
  }

  function fadeIn(){
    stopFade();
    music.volume = 0;
    const steps = Math.max(1, Math.floor(FADE_MS / FADE_STEP));
    const inc = TARGET_VOLUME / steps;
    fadeTimer = setInterval(()=>{
      if(music.paused){ stopFade(); return; }
      music.volume = Math.min(TARGET_VOLUME, music.volume + inc);
      if(music.volume >= TARGET_VOLUME - 0.001){
        music.volume = TARGET_VOLUME;
        stopFade();
      }
    }, FADE_STEP);
  }

  async function playSoft(){
    if(userPaused) return;
    try{
      music.volume = 0;
      await music.play();
      fadeIn();
      setButtonState();
    }catch(e){
      setButtonState();
    }
  }

  function pauseMusic(){
    stopFade();
    music.pause();
    userPaused = true;
    localStorage.setItem("samuelLorenaMusicPaused","1");
    setButtonState();
  }

  async function resumeMusic(){
    userPaused = false;
    localStorage.removeItem("samuelLorenaMusicPaused");
    try{
      music.volume = 0;
      await music.play();
      fadeIn();
      setButtonState();
    }catch(e){
      setButtonState();
    }
  }

  // Start only after the visitor opens the invitation.
  if(openInvite){
    openInvite.addEventListener("click", ()=>{
      if(!userPaused) setTimeout(playSoft, 120);
    }, true);
  }

  // Replace normal button behavior with our soft control.
  if(toggle){
    toggle.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      if(music.paused) resumeMusic();
      else pauseMusic();
    }, true);
  }

  // Keep volume capped even if older scripts try to change it.
  music.addEventListener("volumechange", ()=>{
    if(music.volume > TARGET_VOLUME) music.volume = TARGET_VOLUME;
  });

  music.volume = 0;
  setButtonState();
})();

/* V26 FINAL — UX refinada */
(function(){
  // Loader
  const loader=document.getElementById("siteLoader");
  const hideLoader=()=>{if(loader)loader.classList.add("hide")};
  window.addEventListener("load",()=>setTimeout(hideLoader,250));
  setTimeout(hideLoader,2200);

  // Reveal discreto
  const sections=[...document.querySelectorAll("main section, body>section")];
  sections.forEach(s=>s.classList.add("reveal-section"));
  if("IntersectionObserver" in window){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");obs.unobserve(e.target)}});
    },{threshold:.08});
    sections.forEach(s=>obs.observe(s));
  }else sections.forEach(s=>s.classList.add("revealed"));

  // Menu mobile
  const mt=document.getElementById("mobileMenuToggle");
  const links=document.querySelector(".premium-links");
  if(mt&&links){
    mt.addEventListener("click",()=>{mt.classList.toggle("open");links.classList.toggle("open")});
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mt.classList.remove("open");links.classList.remove("open")}));
  }

  // RSVP flutuante depois do hero; some perto do formulário
  const float=document.getElementById("floatingRsvp");
  const rsvp=document.getElementById("rsvp");
  function floating(){
    if(!float)return;
    const y=window.scrollY;
    let near=false;
    if(rsvp){const rr=rsvp.getBoundingClientRect();near=rr.top<innerHeight*.8&&rr.bottom>0}
    float.classList.toggle("show",y>innerHeight*.75&&!near);
  }
  addEventListener("scroll",floating,{passive:true});floating();

  // Resumo RSVP
  const adults=document.getElementById("adultGuests"), children=document.getElementById("childGuests"), summary=document.getElementById("guestSummary");
  function updateSummary(){
    if(!adults||!children||!summary)return;
    const a=Number(adults.value||0),c=Number(children.value||0),total=a*200+c*100;
    if(a+c===0){summary.textContent="Selecione os convidados para ver o resumo.";return}
    const parts=[];
    if(a)parts.push(`${a} ${a===1?"adulto":"adultos"}`);
    if(c)parts.push(`${c} ${c===1?"criança":"crianças"}`);
    summary.textContent=`${parts.join(" + ")} — Total ${total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}`;
  }
  if(adults)adults.addEventListener("change",updateSummary);
  if(children)children.addEventListener("change",updateSummary);
  updateSummary();

  // Swipe no lightbox
  const lb=document.getElementById("galleryLightbox");
  if(lb){
    let sx=0;
    lb.addEventListener("touchstart",e=>{sx=e.changedTouches[0].screenX},{passive:true});
    lb.addEventListener("touchend",e=>{
      const dx=e.changedTouches[0].screenX-sx;
      if(Math.abs(dx)<45)return;
      const btn=lb.querySelector(dx<0?".gl-next":".gl-prev");
      if(btn)btn.click();
    },{passive:true});
  }

  // Música: início em 12%, crescendo suavemente até 18%.
  const music=document.getElementById("bgMusic");
  if(music){
    document.addEventListener("visibilitychange",()=>{
      if(document.hidden&&!music.paused){
        let v=music.volume;
        const t=setInterval(()=>{v=Math.max(.04,v-.02);music.volume=v;if(v<=.04)clearInterval(t)},90);
      }
    });
  }

  // Feedback Pix
  const cp=document.getElementById("copyPixModal");
  if(cp){
    cp.addEventListener("click",()=>{
      cp.classList.add("copied");
      setTimeout(()=>cp.classList.remove("copied"),1800);
    });
  }
})();


/* V28 — RSVP salvo automaticamente na planilha online */
(function(){
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("rsvpSuccess");
  if(!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn ? submitBtn.innerHTML : "";

  function confirmationId(){
    return "SL-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  }

  form.addEventListener("submit", async function(e){
    e.preventDefault();
    const f = new FormData(form);
    const adultos = Number(f.get("adultos") || 0);
    const criancas = Number(f.get("criancas") || 0);
    if(adultos + criancas < 1){ alert("Selecione pelo menos um convidado."); return; }

    const total = adultos * 200 + criancas * 100;
    const id = confirmationId();
    const payload = {
      id,
      nome: String(f.get("nome") || "").trim(),
      adultos,
      criancas,
      mensagem: String(f.get("mensagem") || "").trim(),
      valor: total,
      status: "Confirmado",
      origem: "Site do casamento",
      familia: new URLSearchParams(location.search).get("familia") || ""
    };

    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = "Salvando confirmação..."; }
    try{
      const res = await fetch("/api/rsvp", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok || !data.ok) throw new Error(data.error || "Não foi possível salvar");

      localStorage.setItem("samuelLorenaLastRsvpId", id);
      form.dispatchEvent(new CustomEvent("rsvp-saved", {detail:payload}));
      if(success){
        const strong=success.querySelector("strong"), p=success.querySelector("p");
        if(strong) strong.textContent="Presença registrada com sucesso!";
        if(p) p.textContent=`Confirmação ${id} salva no controle dos noivos. Agora você pode enviar a mensagem e finalizar o Pix.`;
        success.classList.add("show");
      }

      const valor = total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
      const text = `Olá! Minha presença já foi registrada no site do casamento de Samuel & Lorena.\n\nConfirmação: ${id}\nNome: ${payload.nome}\nAdultos: ${adultos}\nCrianças até 10 anos: ${criancas}\nValor: ${valor}\nMensagem: ${payload.mensagem}`;
      window.open("https://wa.me/5519998350381?text="+encodeURIComponent(text),"_blank");
    }catch(err){
      alert("Não conseguimos registrar automaticamente. Tente novamente. Se continuar, confirme pelo WhatsApp.");
      console.error(err);
    }finally{
      if(submitBtn){ submitBtn.disabled=false; submitBtn.innerHTML=originalHtml; }
    }
  });
})();

/* V30 — doações por projeto salvas na planilha */
(function(){
  const modal=document.getElementById("projectModal");
  const form=document.getElementById("donationForm");
  if(!modal || !form) return;

  const projectKey=document.getElementById("donationProjectKey");
  const nameInput=document.getElementById("donationName");
  const amountInput=document.getElementById("donationAmount");
  const copyBtn=document.getElementById("donationCopyPix");
  const submitBtn=document.getElementById("donationRegister");
  const feedback=document.getElementById("donationFeedback");
  const projectTitle=document.getElementById("projectModalTitle");
  const PIX_PAYLOAD="00020126360014BR.GOV.BCB.PIX01145204000053039865802BR5923SAMUEL F LAUREANO LOPEZ6011HORTOLANDIA62070503***63041773";

  document.querySelectorAll(".project-detail-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(projectKey) projectKey.value=btn.dataset.project||"";
      if(feedback){feedback.textContent="";feedback.className="donation-feedback";}
    });
  });

  if(copyBtn){
    copyBtn.addEventListener("click",async()=>{
      try{ await navigator.clipboard.writeText(PIX_PAYLOAD); }
      catch(e){
        const ta=document.createElement("textarea");ta.value=PIX_PAYLOAD;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
      }
      copyBtn.textContent="Pix copiado ✓";
      setTimeout(()=>copyBtn.textContent="Copiar Pix para doar",1600);
    });
  }

  function donationId(){
    return "DOA-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
  }

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const valor=Number(amountInput.value||0);
    const nome=String(nameInput.value||"").trim();
    const projeto=String(projectTitle.textContent||"").trim();
    if(!nome || valor<=0 || !projeto){
      feedback.textContent="Informe seu nome e o valor da doação.";feedback.className="donation-feedback error";return;
    }
    const payload={
      tipo:"doacao", id:donationId(), nome, valor, projeto,
      projetoKey:projectKey.value||"", status:"Informada pelo convidado",
      origem:"Site do casamento", rsvpId:localStorage.getItem("samuelLorenaLastRsvpId")||""
    };
    submitBtn.disabled=true;submitBtn.textContent="Registrando...";
    feedback.textContent="";feedback.className="donation-feedback";
    try{
      const res=await fetch("/api/doacao",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||!data.ok) throw new Error(data.error||"Falha ao registrar");
      feedback.textContent=`Doação registrada para “${projeto}”. Muito obrigado!`;
      feedback.className="donation-feedback ok";
      localStorage.setItem("samuelLorenaLastDonationId",payload.id);
      form.reset();
      if(projectKey) projectKey.value=payload.projetoKey;
    }catch(err){
      feedback.textContent="Não foi possível registrar agora. Tente novamente.";
      feedback.className="donation-feedback error";
      console.error(err);
    }finally{
      submitBtn.disabled=false;submitBtn.textContent="Registrar minha doação";
    }
  });
})();


/* V31 — upload de fotos dos convidados para Supabase Storage */
(function(){
  const SUPABASE_URL = "https://imupvubqtzsfjcjqbrao.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cZrGhy5bGOotJBshqI_hSg_uigw20n-";
  const BUCKET = "fotos-casamento";

  const form=document.getElementById("guestPhotoForm");
  const nameInput=document.getElementById("guestPhotoName");
  const fileInput=document.getElementById("guestPhotoFiles");
  const fileLabel=document.getElementById("guestPhotoFileLabel");
  const preview=document.getElementById("guestPhotoPreview");
  const progress=document.getElementById("photoUploadProgress");
  const bar=document.getElementById("photoUploadBar");
  const progressText=document.getElementById("photoUploadText");
  const feedback=document.getElementById("guestPhotoFeedback");
  const submit=document.getElementById("guestPhotoSubmit");
  const chooseBtn=document.getElementById("guestPhotoChoose");
  const fileBox=document.getElementById("photoFileBox");
  if(!form || !window.supabase) return;

  if(chooseBtn){
    chooseBtn.addEventListener("click",()=>fileInput.click());
  }
  if(fileBox){
    fileBox.addEventListener("click",(e)=>{
      if(e.target!==chooseBtn) fileInput.click();
    });
    fileBox.addEventListener("keydown",(e)=>{
      if(e.key==="Enter" || e.key===" "){e.preventDefault();fileInput.click();}
    });
    fileBox.tabIndex=0;
    fileBox.setAttribute("role","button");
    fileBox.setAttribute("aria-label","Escolher fotos para enviar aos noivos");
  }

  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
  });

  const safe=(value)=>String(value||"")
    .normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")
    .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"convidado";

  const extOf=(file)=>{
    const byName=(file.name.split(".").pop()||"").toLowerCase().replace(/[^a-z0-9]/g,"");
    if(byName) return byName;
    const map={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/heic":"heic","image/heif":"heif"};
    return map[file.type]||"jpg";
  };

  fileInput.addEventListener("change",()=>{
    const files=[...fileInput.files];
    fileLabel.textContent=files.length?`${files.length} ${files.length===1?"foto selecionada":"fotos selecionadas"}`:"Selecione uma ou várias fotos";
    preview.innerHTML="";
    files.slice(0,8).forEach(file=>{
      const item=document.createElement("div");
      item.className="guest-photo-thumb";
      if(file.type.startsWith("image/") && !/heic|heif/i.test(file.type+file.name)){
        const img=document.createElement("img");
        img.alt=file.name;
        img.src=URL.createObjectURL(file);
        img.onload=()=>URL.revokeObjectURL(img.src);
        item.appendChild(img);
      }else{
        item.innerHTML="<span>📷</span>";
      }
      const cap=document.createElement("small");
      cap.textContent=file.name;
      item.appendChild(cap);
      preview.appendChild(item);
    });
    if(files.length>8){
      const more=document.createElement("div"); more.className="guest-photo-more"; more.textContent=`+${files.length-8}`; preview.appendChild(more);
    }
  });

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const nome=nameInput.value.trim();
    const files=[...fileInput.files];
    if(!nome || !files.length){feedback.textContent="Informe seu nome e escolha pelo menos uma foto.";feedback.className="guest-photo-feedback error";return;}
    const invalid=files.find(f=>f.size>25*1024*1024);
    if(invalid){feedback.textContent=`A foto “${invalid.name}” ultrapassa 25 MB.`;feedback.className="guest-photo-feedback error";return;}

    submit.disabled=true; progress.hidden=false; feedback.textContent=""; feedback.className="guest-photo-feedback";
    let sent=0;
    try{
      const date=new Date();
      const folder=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}/${safe(nome)}`;
      for(let i=0;i<files.length;i++){
        const file=files[i];
        progressText.textContent=`Enviando foto ${i+1} de ${files.length}...`;
        bar.style.width=`${Math.round((i/files.length)*100)}%`;
        const path=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${extOf(file)}`;
        const {error}=await client.storage.from(BUCKET).upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type||undefined});
        if(error) throw error;
        sent++;
      }
      bar.style.width="100%"; progressText.textContent="Envio concluído ✓";
      feedback.textContent=`${sent} ${sent===1?"foto enviada":"fotos enviadas"} com sucesso. Obrigado por compartilhar esse momento conosco!`;
      feedback.className="guest-photo-feedback ok";
      form.reset(); preview.innerHTML=""; fileLabel.textContent="Selecione uma ou várias fotos";
      setTimeout(()=>{progress.hidden=true;bar.style.width="0%"},2500);
    }catch(err){
      console.error("Upload fotos:",err);
      feedback.textContent="Não foi possível concluir o envio. Verifique sua conexão e tente novamente.";
      feedback.className="guest-photo-feedback error";
      progressText.textContent=sent?`${sent} foto(s) enviada(s) antes da interrupção.`:"Envio não concluído.";
    }finally{submit.disabled=false;}
  });
})();

/* V33 — correção: modal Pix inicializado após o HTML estar pronto */
(function(){
  function initPixModalV33(){
    const modal = document.getElementById('pixModal');
    const openBtn = document.getElementById('openPixModal');
    if(!modal || !openBtn || openBtn.dataset.pixV33Bound === '1') return;
    openBtn.dataset.pixV33Bound = '1';

    const closeBtn = modal.querySelector('.pix-modal-close');
    const copyBtn = document.getElementById('copyPixModal');
    const payload = document.getElementById('pixModalPayload');

    function openPix(){
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }
    function closePix(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    }

    openBtn.addEventListener('click', openPix);
    if(closeBtn) closeBtn.addEventListener('click', closePix);
    modal.addEventListener('click', function(e){ if(e.target === modal) closePix(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) closePix(); });

    if(copyBtn && payload && copyBtn.dataset.pixV33Bound !== '1'){
      copyBtn.dataset.pixV33Bound = '1';
      copyBtn.addEventListener('click', async function(){
        try {
          await navigator.clipboard.writeText(payload.value);
        } catch(e) {
          payload.focus(); payload.select(); document.execCommand('copy');
        }
        copyBtn.textContent = 'Pix copiado ✓';
        copyBtn.classList.add('copied');
        setTimeout(function(){
          copyBtn.textContent = 'Copiar Pix Copia e Cola';
          copyBtn.classList.remove('copied');
        }, 1600);
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPixModalV33);
  else initPixModalV33();
})();
