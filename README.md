# portfolio — ANDREA

Sito personale in due pagine:

- **Home** (`index.html`): testo centrale che cicla al click/tastiera e una foto
  che rimbalza per lo schermo; il click sulla foto porta alla pagina projects
  con una transizione in dissolvenza.
- **Projects** (`projects.html`): elenco dei lavori con doppia vista — **Grid**
  (griglia di thumbnail) e **List** (lista con hover direzionale e preview che
  segue il cursore) — più smooth scroll e transizioni di pagina.

## Stack

- [Vite](https://vitejs.dev) + JavaScript vanilla (build multipage)
- [GSAP](https://gsap.com) per le transizioni di pagina e le micro-animazioni
- [Lenis](https://lenis.darkroom.engineering) per lo smooth scroll
- [Inter](https://rsms.me/inter/) self-hosted via `@fontsource/inter`

## Comandi

```bash
npm install     # dipendenze
npm run dev     # sviluppo (http://localhost:5173)
npm run build   # build di produzione in dist/
npm run preview # anteprima della build
```

## Deploy

Pubblicato su GitHub Pages: **https://acci4i0.github.io/portfolio/**

A ogni push su `main` il workflow [`deploy.yml`](.github/workflows/deploy.yml)
esegue la build Vite e pubblica `dist/` (Settings → Pages → Source deve essere
"GitHub Actions"). La `base` di Vite è relativa (`./`), quindi il sito funziona
in qualunque sottopercorso.

## Contenuti

- Testi della home: array `texts` in [`src/main.js`](src/main.js)
- Progetti (titoli, anni, link, thumbnail): [`src/projects-data.js`](src/projects-data.js)
- Foto della home: `assets/andre.jpg` — thumbnail dei progetti in `assets/projects/`

## Licenza

[MIT](LICENSE) © ANDREA ([Acci4i0](https://github.com/Acci4i0))
