# portfolio — ANDREA

Sito personale in due pagine:

- **Home** (`index.html`): un estratto di Antonio Tabucchi che cicla al
  click/tastiera, una frase alla volta, e una foto che rimbalza per lo schermo;
  il click sulla foto porta alla pagina projects con una transizione in
  dissolvenza.
- **Projects** (`projects.html`): lista centrata dei progetti — riga
  titolo/linea/anno con fade progressivo, disegno animato delle linee e
  scramble dei testi al load — in versione chiara.

## Stack

- [Vite](https://vitejs.dev) + JavaScript vanilla (build multipage)
- [GSAP](https://gsap.com) per le transizioni di pagina
- [Inter](https://rsms.me/inter/) e [Monoton](https://fonts.google.com/specimen/Monoton)
  self-hosted via `@fontsource`

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
