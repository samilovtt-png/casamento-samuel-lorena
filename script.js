const weddingDate = new Date("2027-02-14T15:00:00-03:00");

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("countdownBox").innerHTML =
      "<p style='grid-column:1/-1;padding:30px;font-family:Cormorant Garamond,serif;font-size:2rem'>Hoje é o grande dia! ♡</p>";
    return;
  }

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
updateCountdown();
setInterval(updateCountdown, 1000);

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let playing = false;

musicBtn.addEventListener("click", async () => {
  try {
    if (!playing) {
      await music.play();
      musicBtn.textContent = "❚❚";
      playing = true;
    } else {
      music.pause();
      musicBtn.textContent = "♪";
      playing = false;
    }
  } catch (e) {
    alert("Adicione o arquivo assets/musica.mp3 para ativar a música.");
  }
});

document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const nome = form.get("nome");
  const pessoas = form.get("pessoas");
  const mensagem = form.get("mensagem") || "";

  // TROQUE pelo WhatsApp dos noivos no formato 55DDDNUMERO.
  const whatsapp = "5519999999999";

  const text = `Olá! Quero confirmar minha presença no casamento de Samuel & Lorena.%0A%0A` +
    `Nome: ${encodeURIComponent(nome)}%0A` +
    `Quantidade: ${encodeURIComponent(pessoas)}%0A` +
    `Mensagem: ${encodeURIComponent(mensagem)}`;

  window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
});

function copyPix() {
  const key = document.getElementById("pixKey").textContent.trim();
  navigator.clipboard.writeText(key);
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
