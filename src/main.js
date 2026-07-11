import "@fontsource/monoton";
import gsap from "gsap";

/* ============================================================================
 * Replica del comportamento della homepage di riferimento (vedi ANALYSIS.md).
 * Logica ricavata dal componente `app` in reference/HQbm4L3i.pretty.js
 * (righe ~7668–7867). Ogni valore numerico riporta la provenienza.
 * Unica deviazione (2026-07-10): il click sulla foto naviga a /projects.html
 * con fade di uscita (valori malik) invece di aprire un URL e nascondere la foto.
 *
 * I CONTENUTI (testi, didascalia) sono placeholder originali: modificali qui
 * sotto. La foto è assets/andre.jpg (ora un placeholder nero 1887×2831, le
 * stesse proporzioni della foto del riferimento).
 * ========================================================================== */

// ---------------------------------------------------------------------------
// CONTENUTI — MODIFICA QUI (testi inventati come placeholder, come concordato)
// L'elemento 0 è quello visibile al load (nell'originale: il nome dell'artista).
// I testi vengono iniettati con innerHTML: puoi usare markup <span>/<sup>.
// ---------------------------------------------------------------------------
const texts = [
  '<span class="andrea">ANDREA</span>',
  "lando.andrea04@gmail.com",
  "@andrelndo",
  "Ok",
  "Ora parliamo d’altro",
  "Per esempio del tempo che fa",
  "O di quanto è difficile trovare parcheggio",
  "O del perché il caffè del bar sotto casa è sempre il migliore",
  "Comunque, questo sito non ha un menu",
  "Non ha nemmeno le pagine",
  "C’è solo questo testo",
  "E una foto che gira per lo schermo",
  "Se riesci a prenderla, complimenti",
  "Se non ci riesci, va bene lo stesso",
  "Le cose importanti sono altre",
  "Tipo dormire bene",
  "O una cena con gli amici",
  "A proposito, puoi scrivermi quando vuoi",
  "Oppure restare qui a cliccare",
  "Va bene tutto",
];

// Didascalia mostrata nell'h1 al passaggio del mouse sulla foto
// (nell'originale: titolo del libro dell'artista — placeholder da modificare).
const hoverCaption = '<span class="andrea">ANDREA</span> — Ritratto';

// Destinazione del click sulla foto: la pagina Projects (deviazione voluta dal
// riferimento kris, che apriva un URL esterno in nuova scheda e nascondeva la
// foto — decisione del 2026-07-10). L'uscita usa il fade della transizione di
// pagina del riferimento malik: opacity→0, 0.5s, power4.out
// (reference/malik-work/lenis-transition.pretty.js).
// BASE_URL: "/" in dev, "/portfolio/" nella build per GitHub Pages di progetto.
const projectsUrl = import.meta.env.BASE_URL + "projects.html";

// ---------------------------------------------------------------------------
// STATO — speculare al componente originale (bundle r.7708–7715)
// ---------------------------------------------------------------------------
let index = 0; //           r (indice testo corrente, parte da 0) — r.7708
let hovering = false; //    o (mouse sopra la foto)               — r.7709
let leaving = false; //     guardia del fade di uscita verso /projects
const pos = { x: 0, y: 0 }; // l (posizione, parte da 0,0)        — r.7712
// Velocità di default {1.2, 0.8} px/frame — r.7713. Come nell'originale viene
// sovrascritta subito all'init (r.7834–7837), quindi non guida mai il moto.
const vel = { x: 1.2, y: 0.8 };
let animating = true; //    c (loop attivo)                       — r.7714
let rafId = null; //        f (id del requestAnimationFrame)      — r.7715

const app = document.querySelector("#app");
const h1 = document.querySelector("h1");
const img = document.querySelector(".floating-image");

// ---------------------------------------------------------------------------
// RENDERING TESTO — computed `b` dell'originale (r.7827–7829):
// se hovering mostra la didascalia, altrimenti il testo corrente. innerHTML
// come nell'originale (template r.7846: h1 con innerHTML).
// ---------------------------------------------------------------------------
function render() {
  h1.innerHTML = hovering ? hoverCaption : texts[index];
}

// ---------------------------------------------------------------------------
// CICLO TESTI — h()/y() dell'originale (r.7779–7784): wrap circolare nei due sensi
// ---------------------------------------------------------------------------
function next() {
  index = index === texts.length - 1 ? 0 : index + 1;
  render();
}
function prev() {
  index = index === 0 ? texts.length - 1 : index - 1;
  render();
}

// Tastiera — m() dell'originale (r.7785–7789): Space/ArrowRight/Enter → avanti,
// ArrowLeft → indietro, sempre con preventDefault.
function onKeydown(e) {
  if (e.code === "Space" || e.code === "ArrowRight" || e.code === "Enter") {
    e.preventDefault();
    next();
  } else if (e.code === "ArrowLeft") {
    e.preventDefault();
    prev();
  }
}

// ---------------------------------------------------------------------------
// RIMBALZO — O() dell'originale (r.7790–7807), replicato 1:1:
// - px per FRAME, senza normalizzazione al delta-time (su 120Hz va al doppio
//   di 60Hz, come nel riferimento);
// - bounds riletti a ogni frame (innerWidth/Height, offsetWidth/Height):
//   è questa la gestione implicita del resize, non esiste listener resize;
// - ai bordi: inversione del segno della velocità + clamp dentro [0, max];
// - posizione applicata via style.left/top in px (niente transform).
// ---------------------------------------------------------------------------
function animate() {
  if (!animating) return; // guardia su c.value — r.7791
  if (!img) return; //        guardia sul querySelector — r.7792–7793
  const maxX = window.innerWidth - img.offsetWidth; //  r.7794–7796
  const maxY = window.innerHeight - img.offsetHeight; // r.7795–7797
  pos.x += vel.x; // r.7798
  pos.y += vel.y; // r.7799
  if (pos.x <= 0 || pos.x >= maxX) {
    vel.x = -vel.x; // r.7800–7802
    pos.x = Math.max(0, Math.min(maxX, pos.x));
  }
  if (pos.y <= 0 || pos.y >= maxY) {
    vel.y = -vel.y; // r.7803–7805
    pos.y = Math.max(0, Math.min(maxY, pos.y));
  }
  img.style.left = pos.x + "px"; // template r.7854: style {left, top} in px
  img.style.top = pos.y + "px";
  rafId = requestAnimationFrame(animate); // r.7806
}

// ---------------------------------------------------------------------------
// INTERAZIONI CON LA FOTO — S() / M() / _() dell'originale
// ---------------------------------------------------------------------------
// mouseenter — S() (r.7808–7814): solo se non già in hover; mostra la
// didascalia, ferma il loop.
function onImgEnter() {
  if (hovering) return;
  hovering = true;
  animating = false;
  if (rafId) cancelAnimationFrame(rafId);
  render();
}

// mouseleave — M() (r.7815–7817): ripristina il testo e riavvia il loop.
// Con la guardia `leaving`: durante il fade di uscita verso /projects il
// rimbalzo resta fermo (nel riferimento kris non esisteva questa navigazione).
function onImgLeave() {
  hovering = false;
  if (!leaving) {
    animating = true;
    animate();
  }
  render();
}

// click — deviazione voluta rispetto a _() del riferimento kris (r.7818–7826):
// invece di aprire un URL esterno e nascondere la foto, si naviga a /projects
// nello stesso tab con il fade di uscita del riferimento malik (opacity→0,
// 0.5s, power4.out). Restano identici: stopPropagation (il click non avanza il
// testo — template r.7857) e lo stop del loop.
function onImgClick(e) {
  e.stopPropagation();
  if (leaving) return;
  leaving = true;
  animating = false;
  if (rafId) cancelAnimationFrame(rafId);
  gsap.to("[data-transition-content]", {
    opacity: 0,
    duration: 0.5, // valori della transizione malik — lenis-transition.pretty.js
    ease: "power4.out",
    onComplete: () => {
      window.location.href = projectsUrl;
    },
  });
}

// ---------------------------------------------------------------------------
// INIT — onMounted dell'originale (r.7831–7838): keydown, avvio del loop e
// SUBITO DOPO la randomizzazione della velocità (stesso ordine: il primo frame
// eseguito usa già i valori random, il default 1.2/0.8 non entra mai in gioco).
// ---------------------------------------------------------------------------
window.addEventListener("keydown", onKeydown); // r.7832
animate(); // r.7833
// Randomizzazione — r.7834–7837:
//   vx = ±(0.8 + random()·1.2)  →  |vx| ∈ [0.8, 2.0) px/frame
//   vy = ±(0.6 + random()·1.0)  →  |vy| ∈ [0.6, 1.6) px/frame
//   segno 50/50 indipendente per asse (random() > 0.5)
vel.x = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 1.2);
vel.y = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 1);

// Click ovunque su #app → testo successivo (template r.7845: onClick su #app;
// il click sulla foto non arriva qui grazie allo stopPropagation).
app.addEventListener("click", next);
img.addEventListener("mouseenter", onImgEnter); // template r.7855
img.addEventListener("mouseleave", onImgLeave); // template r.7856
img.addEventListener("click", onImgClick); //      template r.7857
