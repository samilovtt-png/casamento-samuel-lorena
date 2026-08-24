const weddingDate = new Date("2027-02-14T15:00:00-03:00");

function tick(){
  let diff = weddingDate - new Date();
  if(diff <= 0) return;
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}
tick();
setInterval(tick, 1000);

const intro = document.getElementById("intro");
const openInvite = document.getElementById("openInvite");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

openInvite.addEventListener("click", async () => {
  intro.classList.add("hidden");
  try {
    await music.play();
    musicToggle.textContent = "❚❚";
  } catch (e) {}
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.textContent = "❚❚";
    } catch (e) {}
  } else {
    music.pause();
    musicToggle.textContent = "♫";
  }
});

document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const text =
    `Olá! Quero confirmar minha presença no casamento de Samuel & Lorena.\n\n` +
    `Nome: ${form.get("nome")}\n` +
    `Quantidade: ${form.get("pessoas")}\n` +
    `Mensagem: ${form.get("mensagem") || ""}`;

  window.open(
    "https://wa.me/5519998350381?text=" + encodeURIComponent(text),
    "_blank"
  );
});

async function copyPix(){
  const key = document.getElementById("pixKey").textContent.trim();
  try {
    await navigator.clipboard.writeText(key);
  } catch(e) {}
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));



async function copyPixPayload(){
  const payload = `00020126360014BR.GOV.BCB.PIX0114+55199983503815204000053039865802BR5923SAMUEL F LAUREANO LOPEZ6011HORTOLANDIA62070503***63041773`;
  try {
    await navigator.clipboard.writeText(payload);
  } catch(e) {
    const area = document.getElementById("pixPayload");
    if (area) {
      area.focus();
      area.select();
      document.execCommand("copy");
    }
  }
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = "Pix copia e cola copiado";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }
}
