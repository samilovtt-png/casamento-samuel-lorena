
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
