# 🏗️ Castala! — Handoff Tecnico & Strategico (AI-Enabled MVP)

**Payoff:** “Poi la casa si vende da sola.”

---

## 🎯 Visione
Piattaforma digitale per **aste immobiliari volontarie tra privati**, senza vincoli né provvigioni.  
Permette di **“castare”** case e offerte in totale autonomia, con assistenza opzionale di mediatori immobiliari e creditizi — e con **AI integrata** per rendere il processo più semplice, rapido e chiaro.

---

## 💡 Razionale
- Il mercato immobiliare è costoso e lento; Castala! nasce per renderlo **trasparente e accessibile**.  
- L’utente è guidato da micro-AI che **aiuta ma non decide**: scrive, suggerisce, migliora.  
- Business model leggero, scalabile e sicuro: nessun file hostato, dati minimi, AI economica (<1€/mese per 100 usi).

---

## 🧩 Modello operativo
| Attore | Ruolo | Azione chiave |
|--------|-------|----------------|
| **Caster** (venditore) | pubblica un immobile (“casta una casa”) | crea annuncio con AI per descrizione e prezzo |
| **Buyer** (acquirente) | fa offerte non vincolanti | può usare AI per scrivere messaggio al venditore |
| **Mediatore immobiliare** | offre supporto trattativa | riceve lead qualificati |
| **Mediatore creditizio** | propone mutui | riceve lead in CPA/CPC |
| **App Castala!** | piattaforma neutrale | facilita, non media |

---

## ⚙️ Stack tecnico
| Livello | Scelta | Motivazione |
|----------|---------|--------------|
| **Frontend** | Next.js 15 (React 19, App Router) + TailwindCSS | veloce, SEO, Vercel ready |
| **Backend** | Supabase (Postgres + Auth) | serverless e sicuro |
| **AI Layer** | GPT-4-mini (OpenAI API) | micro-assistant per testi e stime |
| **Deployment** | Vercel + GitHub Actions | CI/CD automatizzato |
| **Payments** | Stripe | piani freemium |
| **Email** | Resend API | conferme e notifiche |
| **Storage** | Solo link esterni (Drive/Dropbox/iCloud) | zero rischio |
| **AI Caching** | Supabase table `ai_logs` | audit e controllo costi |

---

## 💎 Funzioni principali
1. **Creazione Annuncio (casta)**  
   - AI “Crea descrizione automatica”  
   - AI “Suggerisci fascia di prezzo base”  
   - Link galleria esterna  
2. **Offerta Buyer**  
   - AI “Aiutami a scrivere un messaggio cortese”  
3. **Dashboard Venditore**  
   - Offerte, valutazioni, upgrade piani  
4. **Sistema Valutazioni**  
   - Rating venditore, mediatore, creditizio, app  
5. **Freemium + AI Pro**  
   - AI attiva nei piani Free e Pro (Plus = manuale)  

---

## 🤖 AI nel MVP
| Funzione | Trigger | Output | Costo stimato |
|-----------|----------|---------|----------------|
| **AI Copy Assistant** | click “Genera descrizione” | 200–300 parole descrizione | ~0.01 € |
| **AI Price Estimator** | click “Suggerisci prezzo base” | range di prezzo realistico | ~0.005 € |
| **AI Message Helper** | click “Suggerisci messaggio” | testo breve, cortese | ~0.002 € |

**Etichette UX:** “🪄 Generato con AI (modificabile)”  
**Sicurezza:** nessun dato personale inviato ai modelli.  
**Storage:** output salvato solo dopo conferma utente.

---

## 🧱 Schema dati (esteso)
Aggiunte tabelle AI:
- **ai_logs** → tipo, input breve, output hash, user_id, timestamp  
- **ai_settings** → user_id, opt_in, limiti mensili  

---

## 🪄 UX / UI
- Pulsanti AI accanto ai campi testo (“✨ Genera con AI”)  
- Label *beta* e disclaimer “Nessun dato personale inviato”  
- Pulsante “Rigenera / Annulla / Modifica”  
- Modal feedback: 👍 utile / 👎 non utile  

---

## 💰 Modello economico
- Freemium (Free/Plus/Pro)  
- AI inclusa gratuita nei piani Free/Pro per test  
- Monetizzazione futura su **AI credits** in piani Pro (quando >1000 utenti)  

---

## 🗓️ Roadmap sintetica (6 mesi)
| Mese | Obiettivo | Output |
|------|------------|--------|
| **1** | Setup tecnico + AI copy + prezzo | MVP AI operativo |
| **2** | Offerte + message helper | AI test utenti reali |
| **3** | Dashboard + rating | primi analytics |
| **4** | Freemium + Stripe | monetizzazione |
| **5** | AI tuning + feedback | raccolta UX data |
| **6** | Beta pubblica Veneto | PR “Castare conviene” |

---

## 🚀 Milestones chiave
1. **AI MVP live (Mese 1)** — descrizione e prezzo funzionanti.  
2. **Prime offerte con AI Message (Mese 2)**  
3. **Feedback utenti + rating (Mese 3)**  
4. **Piani freemium attivi (Mese 4)**  
5. **Lancio pubblico (Mese 6)**  

---

## 🔐 Sicurezza & Compliance
- Nessuna elaborazione di dati personali nei prompt.  
- Log audit AI per trasparenza.  
- GDPR-by-design, storage solo su Supabase.  
- HTTPS obbligatorio, CSP rigido.  

---

## 📦 CI/CD & Backup
- GitHub → Vercel deploy auto (dev/prod)  
- Supabase daily backup  
- .env switch dev/prod  
- AI key separata (`OPENAI_API_KEY_DEV`)

---

## 🧭 Messaggio di brand
> “In Castala! si castano case e offerte, con un tocco d’intelligenza.”  
>  
> **Castala! — Poi la casa si vende da sola.**
