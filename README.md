# Tongue — Tech News

> Tech news, straight to the point.

Applicazione JavaScript interattiva che mostra le ultime notizie dal mondo tech, integrata con le API di Hacker News.

Sviluppata come progetto finale del corso JavaScript Advanced di [Start2Impact University](https://www.start2impact.it/).

## 🔗 Link

**[→ Prova l'applicazione qui](https://tongue-news.netlify.app)**

**[→ Repository GitHub](https://github.com/Rossana-Palermo/tongue-news)**

---

## Funzionalità

- Caricamento automatico delle ultime 10 notizie all'avvio
- Titolo, data e dominio sorgente per ogni notizia
- Skeleton loading durante il caricamento
- Pulsante "Load more" per caricare le successive 10 notizie
- Gestione degli errori con messaggi all'utente
- Layout responsive

---

## Architettura — Service Layer Pattern

Il progetto applica il **Service Layer Pattern** per separare le responsabilità:

| Layer | File | Responsabilità |
|---|---|---|
| Service | `src/js/services/newsService.js` | Tutte le chiamate HTTP alle API |
| UI | `src/js/ui/renderer.js` | Manipolazione del DOM |
| Utils | `src/js/utils/formatDate.js` | Funzioni pure di utilità |
| Entry point | `src/js/main.js` | Orchestrazione |

---

## Tecnologie

- JavaScript ES6+
- Vite
- Axios
- Vitest

---

## Avvio del progetto

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

22 test su 2 file: `newsService.test.js` e `formatDate.test.js`

---

## Struttura
tongue-news/

├── index.html

├── src/

│   ├── css/style.css

│   ├── js/

│   │   ├── services/newsService.js

│   │   ├── ui/renderer.js

│   │   ├── utils/formatDate.js

│   │   └── main.js

│   └── tests/

│       ├── newsService.test.js

│       └── formatDate.test.js

├── vite.config.js

└── package.json
---

## Autore

**Rossana Palermo** · [Portfolio](https://rossana-palermo.github.io/portfolio)