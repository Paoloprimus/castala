# 🏠 Castala!
**Payoff:** “Poi la casa si vende da sola.”

---

## 🧭 Visione
**Castala!** è la piattaforma per **aste immobiliari volontarie tra privati**,  
senza vincoli né provvigioni.  
Permette di *castare* case e offerte — con un tocco d’intelligenza grazie all’AI.

---

## 💡 Concept
- Chiunque può **pubblicare (“castare”)** il proprio immobile.  
- Le offerte sono **non vincolanti**, trasparenti e gestibili senza intermediari.  
- Mediatori e creditizi possono **entrare in gioco solo se invitati**, per gestire la fase finale.  
- L’AI di Castala! **aiuta**, non sostituisce: genera testi, suggerisce prezzi, migliora messaggi.

---

## ⚙️ Stack tecnico
- **Next.js 15 + React 19 + TailwindCSS**  
- **Supabase (Postgres + Auth + Storage limitato)**  
- **Stripe (piani Freemium + Pro)**  
- **Resend (notifiche email)**  
- **OpenAI GPT-4-mini (micro-AI per copy, prezzo, messaggi)**  
- **Vercel (deploy + CI/CD)**  

---

## 📂 Documentazione principale
| Documento | Descrizione | File |
|------------|-------------|------|
| 🧱 **Handoff Tecnico & Strategico (AI-Enabled)** | Visione, modello operativo, stack, roadmap | [handoff_castala_ai.md](./handoff_castala_ai.md) |
| 🎨 **Mockup UX (AI-Enabled)** | 7 schermate principali in wireframe testuale | [mockup_ux_castala_ai.md](./mockup_ux_castala_ai.md) |
| 🧭 **Wireflow (AI-Enabled)** | Flussi completi utente e AI interattivi | [wireflow_castala_ai.md](./wireflow_castala_ai.md) |
| 🌳 **Repo Tree (MVP Dev con AI)** | Struttura cartelle, file chiave, schema DB | [repo_tree_castala_ai_mvp_dev.md](./repo_tree_castala_ai_mvp_dev.md) |

---

## 🤖 Funzioni AI nel MVP
| Funzione | Azione | Output |
|-----------|--------|---------|
| ✨ **Copy Assistant** | Genera descrizione automatica annuncio | 3 paragrafi realistici |
| 💡 **Price Estimator** | Suggerisce fascia prezzo base | Range di valore |
| 💬 **Message Helper** | Aiuta buyer a scrivere messaggio al venditore | 1–2 frasi cortesi |
| 🪄 **AI Feedback** | L’utente valuta utilità suggerimento | Log su `ai_logs` |

---

## 🧱 Database esteso
Tabelle principali:
- `users` (ruoli: seller, buyer, mediator, credit)  
- `listings`, `offers`, `mediators`, `referrals`, `ratings`  
- `ai_logs`, `ai_settings` *(monitoraggio e limiti AI)*  

---

## 📈 Roadmap sintetica
| Mese | Obiettivo principale |
|------|-----------------------|
| 1 | Setup tecnico + AI Copy + Price |
| 2 | Offerte + AI Message |
| 3 | Dashboard + Rating |
| 4 | Freemium + Stripe |
| 5 | AI tuning + feedback |
| 6 | Beta pubblica “Castare conviene” |

---

## 🔐 Sicurezza
- Nessun file hostato internamente.  
- Nessun dato personale nei prompt AI.  
- HTTPS + RLS Supabase + CSP rigida.  
- GDPR-by-design, audit AI attivo.  

---

## 🪄 Brand
> “In Castala! si castano case e offerte, con un tocco d’intelligenza.”  
>
> **Castala! — Poi la casa si vende da sola.**
