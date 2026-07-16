/* ============================================================================
 * Pagina /projects — lista in stile rauno.me/projects (decisione 2026-07-16).
 * Provenienza dei valori: reference/rauno-projects/projects.pretty.js
 * (componente della pagina, r.220–321). Implementazione vanilla JS delle
 * stesse meccaniche; contenuti in src/projects-data.js.
 * Le animazioni (fade per riga, disegno delle linee) sono in projects.css;
 * qui restano il rendering, lo scramble dei testi e le transizioni di pagina
 * (queste ultime mantenute dalla versione precedente, valori malik).
 * ========================================================================== */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/monoton";
import gsap from "gsap";
import { projects } from "./projects-data.js";
import { showPreloader } from "./preloader.js";

// Preloader col contatore (stesso di 2Dgallery): solo al primo caricamento
// della sessione, come sulla home — vedi src/main.js.
if (!sessionStorage.getItem("preloaderShown")) {
  sessionStorage.setItem("preloaderShown", "1");
  showPreloader();
}

// prefers-reduced-motion: niente scramble; fade/linee sono azzerati in CSS.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Charset dello scramble — dichiarato prima delle chiamate top-level: scramble()
// viene eseguita da renderList() e le const non sono issate come le funzioni.
const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

renderList();
initPageTransitions();

// ---------------------------------------------------------------------------
// RENDERING — una riga per progetto: titolo | linea flex:1 | anno
// (projects.pretty.js r.251–296). href → <a target _blank rel noreferrer>
// come il riferimento; href null → <span> non cliccabile con testo spento
// (deviazione richiesta: nel riferimento tutte le righe sono link).
// L'indice della riga guida i delay delle animazioni CSS via --i
// (fade: 0.1s·i — r.250/254; linea: 0.05s·i — r.280).
// ---------------------------------------------------------------------------
function renderList() {
  const wrap = document.getElementById("projects-list");
  projects.forEach((p, i) => {
    const row = document.createElement(p.href ? "a" : "span");
    row.className = "project-row" + (p.href ? "" : " project-row--disabled");
    row.style.setProperty("--i", i);
    if (p.href) {
      row.href = p.href;
      row.target = "_blank"; // projects.pretty.js r.256–257
      row.rel = "noopener noreferrer";
    }
    const title = document.createElement("span"); // weight 500 — r.264
    title.className = "project-row__title";
    title.textContent = p.title;
    const line = document.createElement("div"); // flex:1, :before/:after — r.268–293
    line.className = "project-row__line";
    const year = document.createElement("div"); // color gray9 — r.294
    year.className = "project-row__year";
    year.textContent = p.year;
    row.append(title, line, year);
    wrap.appendChild(row);
    // Scramble al mount, 10 iterazioni su titolo e anno — r.247–249
    if (!reducedMotion) {
      scramble(title);
      scramble(year);
    }
  });
}

// ---------------------------------------------------------------------------
// SCRAMBLE — equivalente di c(el, { iterations: 10 }) del riferimento
// (r.248): i caratteri partono casuali e si assestano progressivamente
// sull'originale in 10 frame.
// ---------------------------------------------------------------------------
function scramble(el, iterations = 10) {
  const original = el.textContent;
  let frame = 0;
  function tick() {
    frame++;
    const settled = Math.ceil((frame / iterations) * original.length);
    el.textContent = [...original]
      .map((ch, i) =>
        i < settled || ch === " "
          ? ch
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      )
      .join("");
    if (frame < iterations) requestAnimationFrame(tick);
    else el.textContent = original;
  }
  tick();
}

// ---------------------------------------------------------------------------
// TRANSIZIONE DI PAGINA — mantenuta dalla versione precedente (valori del
// riferimento malik, lenis-transition.pretty.js):
//   ingresso: opacity 0→1, 1s, power4.out
//   uscita:   opacity →0, 0.5s, power4.out, poi navigazione (logo → home)
// ---------------------------------------------------------------------------
function initPageTransitions() {
  const content = document.querySelector("[data-transition-content]");
  gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power4.out" });

  document.querySelector(".header-btn--logo").addEventListener("click", (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    gsap.to(content, {
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
      onComplete: () => {
        window.location.href = href;
      },
    });
  });
}
