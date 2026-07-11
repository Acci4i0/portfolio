/* ============================================================================
 * Pagina /projects — logica replicata dal riferimento malikkotb.com/work.
 * Provenienza dei valori: reference/malik-work/work-page.pretty.js (componente
 * della pagina work) e lenis-transition.pretty.js (transizioni di pagina).
 * Implementazione originale in vanilla JS delle stesse meccaniche; contenuti
 * in src/projects-data.js.
 * ========================================================================== */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/monoton";
import "lenis/dist/lenis.css";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./projects-data.js";

gsap.registerPlugin(ScrollTrigger);

// prefers-reduced-motion: il riferimento azzera stagger/entrance e la tile
// (work-page.pretty.js r.19–46 usa il flag per moltiplicare durate e offset).
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Elementi e soglie condivisi tra rendering, entrance e hover della lista.
const listWrap = document.getElementById("list-items");
const gridWrap = document.getElementById("view-grid");
const isMobile = () => window.innerWidth < 768; // soglia del riferimento (work-page.pretty.js r.366)

main();

function main() {
  initSmoothScroll();
  initPageTransitions();
  initHeaderHideOnScroll();
  renderListView();
  renderGridView();
  if (isMobile()) applySplitChars();
  initViewToggle();
  initListHoverInteractions();
}

// ---------------------------------------------------------------------------
// SMOOTH SCROLL — il riferimento usa Lenis (window.lenis). La sua config non è
// presente nei chunk della pagina: opzioni DEFAULT della libreria (deviazione
// dichiarata in checklist).
// ---------------------------------------------------------------------------
function initSmoothScroll() {
  const lenis = new Lenis({ autoRaf: true });
  window.lenis = lenis;
}

// ---------------------------------------------------------------------------
// TRANSIZIONE DI PAGINA — lenis-transition.pretty.js:
//   ingresso: opacity 0→1, 1s, power4.out
//   uscita:   opacity →0, 0.5s, power4.out, poi navigazione
// (nel riferimento gira su [data-transition-content] a ogni cambio route)
// ---------------------------------------------------------------------------
function initPageTransitions() {
  const content = document.querySelector("[data-transition-content]");
  gsap.fromTo(
    content,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power4.out" }, // enter — r.“l” del chunk
  );

  function leaveTo(href) {
    gsap.to(content, {
      opacity: 0,
      duration: 0.5, // leave — r.“a” del chunk
      ease: "power4.out",
      onComplete: () => {
        window.location.href = href;
      },
    });
  }
  // Il nome in alto a sinistra torna alla home con la transizione di uscita.
  document.querySelector(".header-btn--logo").addEventListener("click", (e) => {
    e.preventDefault();
    leaveTo(e.currentTarget.getAttribute("href"));
  });
}

// ---------------------------------------------------------------------------
// HEADER hide-on-scroll (mobile, dove l'header è fixed) — il riferimento ha
// `transition-transform duration-500 ease-in-out translate-y-0` sull'header;
// la logica esatta di soglia non è nei chunk estratti: uso il pattern
// direzionale semplice (giù = nascondi, su = mostra) — dichiarato in checklist.
// ---------------------------------------------------------------------------
function initHeaderHideOnScroll() {
  const header = document.getElementById("site-header");
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header.classList.toggle("site-header--hidden", y > lastScrollY && y > 0);
      lastScrollY = y;
    },
    { passive: true },
  );
}

// ---------------------------------------------------------------------------
// RENDERING delle due viste dai dati (nel riferimento è SSR React; qui i nodi
// sono creati al load — il fade d'ingresso di 1s copre la costruzione).
// href null → per ora nessuna navigazione (decisione utente); con href
// valorizzato: target _blank + rel, come il riferimento.
// ---------------------------------------------------------------------------

// Vista lista — struttura: tile + bordo superiore + titolo | anno
// (work.pretty.html r.198–225)
function renderListView() {
  for (const p of projects) {
    const item = makeLink(p, "directional-list__item");
    item.innerHTML =
      '<div class="directional-list__hover-tile"></div>' +
      '<div class="directional-list__border is--item"></div>' +
      '<div class="directional-list__col-title"><p class="dl-text dl-text--title"></p></div>' +
      '<div class="directional-list__col-year"><p class="dl-text dl-text--year"></p></div>';
    item.querySelector(".dl-text--title").textContent = p.title;
    item.querySelector(".dl-text--year").textContent = p.year;
    // Stato iniziale pre-entrance del riferimento: opacity 0, translateY(20px)
    // (work.pretty.html r.204, inline style) — saltato con reduced motion
    if (!reducedMotion) {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
    }
    listWrap.appendChild(item);
  }
}

// Vista grid — card: thumb 5/3 + titolo (work.pretty.html r.443–462)
function renderGridView() {
  for (const p of projects) {
    const card = makeLink(p, "work-card");
    const thumb = document.createElement("div");
    thumb.className = "work-card__thumb";
    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.title;
    thumb.appendChild(img);
    const title = document.createElement("h3");
    title.className = "work-card__title";
    title.textContent = p.title;
    card.append(thumb, title);
    gridWrap.appendChild(card);
  }
}

function makeLink(project, className) {
  const a = document.createElement("a");
  a.className = className;
  if (project.href) {
    a.href = project.href;
    a.target = "_blank"; // work.pretty.html: target="_blank" rel="noreferrer"
    a.rel = "noopener noreferrer";
  }
  return a;
}

// ---------------------------------------------------------------------------
// TITOLI GRID SPLIT-CHAR (solo <768px, come il riferimento: work-page.pretty.js
// r.308–356 e r.487): ogni carattere in uno span; fade GSAP opacity 0→1,
// durata 0.2s, stagger 0.2/numCaratteri, ease power2.out, delay 300ms;
// ScrollTrigger "top 90%" se il titolo è fuori viewport. Saltato con reduced
// motion (il riferimento controlla prefers-reduced-motion — r.316).
// ---------------------------------------------------------------------------
function applySplitChars() {
  document.querySelectorAll(".work-card__title").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    for (const ch of text) {
      const s = document.createElement("span");
      s.className = "split-char";
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    }
  });
  if (reducedMotion) return;
  const chars = (el) => el.querySelectorAll(".split-char");
  document.querySelectorAll(".work-card__title").forEach((el) => {
    gsap.set(chars(el), { opacity: 0 });
  });
  setTimeout(() => {
    // delay 300ms — work-page.pretty.js r.321
    ScrollTrigger.refresh();
    document.querySelectorAll(".work-card__title").forEach((el) => {
      const t = chars(el);
      const inView = el.getBoundingClientRect().top < 0.9 * window.innerHeight; // r.323
      gsap.fromTo(
        t,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2, // r.329
          stagger: 0.2 / t.length, // r.330
          ease: "power2.out", // r.331
          ...(!inView && { scrollTrigger: { trigger: el, start: "top 90%" } }), // r.332
        },
      );
    });
  }, 300);
}

// ---------------------------------------------------------------------------
// TOGGLE GRID/LIST — meccanica esatta del riferimento (work-page.pretty.js
// r.493–556): swap ISTANTANEO della classe `hidden`, aria-pressed, opacità
// bottoni via classe. Default: grid. Nessuna animazione di passaggio.
// ---------------------------------------------------------------------------
function initViewToggle() {
  const btnGrid = document.getElementById("btn-grid");
  const btnList = document.getElementById("btn-list");
  const viewGrid = document.getElementById("view-grid");
  const viewList = document.getElementById("view-list");

  function setView(view) {
    const grid = view === "grid";
    viewGrid.classList.toggle("hidden", !grid);
    viewList.classList.toggle("hidden", grid);
    btnGrid.classList.toggle("is-active", grid);
    btnList.classList.toggle("is-active", !grid);
    btnGrid.setAttribute("aria-pressed", String(grid));
    btnList.setAttribute("aria-pressed", String(!grid));
    if (!grid) armListEntrance();
  }
  btnGrid.addEventListener("click", () => setView("grid"));
  btnList.addEventListener("click", () => setView("list"));
}

// ---------------------------------------------------------------------------
// ENTRANCE DELLA LISTA — una sola volta, alla prima visibilità (equivalente di
// whileInView once con viewport margin -50px — work-page.pretty.js r.130–133):
// stagger 0.07s, delay iniziale 0.1s, item opacity 0→1 / y 20px→0, 0.4s
// ease-out (r.29–42; framer "easeOut" ≙ CSS ease-out, v. bundle 3y0a0plp8khiw.js).
// ---------------------------------------------------------------------------
let entranceArmed = false;
function armListEntrance() {
  if (entranceArmed || reducedMotion) return;
  entranceArmed = true;
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      listWrap.querySelectorAll(".directional-list__item").forEach((el, i) => {
        const anim = el.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 400, // 0.4s — r.42
            easing: "ease-out",
            delay: 100 + i * 70, // delayChildren 0.1s + stagger 0.07s — r.29–30
            fill: "both",
          },
        );
        anim.finished.then(() => {
          // Pulizia totale a fine entrance: senza cancel(), l'effetto fill:both
          // terrebbe un transform attivo sull'item → stacking context che
          // isolerebbe il mix-blend-mode: difference dei testi dallo sfondo
          // (testi bianchi invece che neri). Il riferimento non ha il problema
          // perché framer rimuove il transform quando i valori tornano a 0.
          el.style.opacity = "";
          el.style.transform = "";
          anim.cancel();
        });
      });
    },
    { rootMargin: "-50px" }, // viewport margin del riferimento — r.133
  );
  io.observe(listWrap);
}

// ---------------------------------------------------------------------------
// INTERAZIONI DELLA LISTA — hover direzionale, preview al cursore, suono tap.
//
// DIRECTIONAL HOVER — pattern del riferimento (work-page.pretty.js r.47–114),
// tipo "y": direzione dalla metà verticale dell'item. All'enter la tile viene
// teletrasportata fuori dal lato d'ingresso senza transition (reflow forzato)
// e poi fatta scivolare a 0; al leave esce dal lato d'uscita. La transition
// della tile è in CSS: 0.5s cubic-bezier(.16,1,.3,1).
//
// PREVIEW AL CURSORE — box fixed 250px che segue il mouse: left = x + 20px,
// top = y − 125px (work-page.pretty.js r.115–119); visibile durante l'hover.
// Nel riferimento contiene il video del progetto: qui la thumbnail statica
// (deviazione dichiarata).
// ---------------------------------------------------------------------------
function initListHoverInteractions() {
  const preview = document.getElementById("cursor-preview");
  const previewImg = document.getElementById("cursor-preview-img");

  function movePreview(x, y) {
    preview.style.left = `${x + 20}px`; // r.118
    preview.style.top = `${y - 125}px`; // r.117
  }

  const OFFSCREEN = { top: "translateY(-100%)", bottom: "translateY(100%)" };
  function directionY(e, el) {
    const r = el.getBoundingClientRect();
    return e.clientY - r.top < r.height / 2 ? "top" : "bottom";
  }

  // Cablaggio hover per ogni riga della lista
  listWrap.querySelectorAll(".directional-list__item").forEach((item) => {
    const tile = item.querySelector(".directional-list__hover-tile");
    const project = projects[[...listWrap.children].indexOf(item)];

    item.addEventListener("mouseenter", (e) => {
      const dir = directionY(e, item);
      tile.style.transition = "none"; // teleport senza transition — r.93
      tile.style.transform = OFFSCREEN[dir];
      void tile.offsetHeight; // reflow forzato — r.95
      tile.style.transition = "";
      tile.style.transform = "translate(0%, 0%)"; // slide in — r.97
      previewImg.src = project.img;
      preview.style.visibility = "visible"; // r.205
      movePreview(e.clientX, e.clientY); // r.147
      playTap();
    });
    item.addEventListener("mousemove", (e) => movePreview(e.clientX, e.clientY)); // r.153
    item.addEventListener("mouseleave", (e) => {
      tile.style.transform = OFFSCREEN[directionY(e, item)]; // esce dal lato del mouse — r.103
      preview.style.visibility = "hidden";
    });
  });
}

// ---------------------------------------------------------------------------
// SUONO TAP — il riferimento riproduce un wav (volume 0.5) al mouseenter, solo
// su dispositivi hover (work-page.pretty.js r.71–72, r.148–151). Il file è suo:
// qui un tap sintetico WebAudio equivalente (stessi trigger e volume). Come nel
// riferimento, i browser possono bloccare l'audio prima della prima
// interazione: l'errore viene ignorato allo stesso modo.
// ---------------------------------------------------------------------------
let audioCtx = null;
function playTap() {
  if (!window.matchMedia("(hover: hover)").matches) return; // r.149
  try {
    audioCtx ||= new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
    gain.gain.setValueAtTime(0.5, t); // volume 0.5 — r.72
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  } catch {
    /* come il riferimento: errori audio ignorati (r.151) */
  }
}
