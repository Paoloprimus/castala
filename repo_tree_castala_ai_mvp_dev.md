# 🌳 Castala! — Repository Tree (MVP di sviluppo con AI)
**Payoff:** “Poi la casa si vende da sola.”

---

## 📁 Struttura generale

```
castala/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # homepage (casta + esplora)
│   │
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── mediatori/page.tsx
│   │   ├── creditizi/page.tsx
│   │   └── admin/page.tsx
│   │
│   ├── listings/
│   │   ├── new/page.tsx              # form “Casta la tua casa” + AI
│   │   ├── [id]/page.tsx
│   │   └── [id]/offers/page.tsx
│   │
│   ├── offers/
│   │   └── new/page.tsx              # offerta + AI Message helper
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── listings/
│   │   ├── offers/
│   │   ├── mediators/
│   │   ├── ratings/
│   │   ├── stripe/
│   │   └── ai/                       # endpoint AI locali
│   │       └── generate/route.ts     # proxy → OpenAI GPT-4-mini
│   │
│   └── (marketing)/
│       └── about/page.tsx
│
├── components/
│   ├── ui/
│   ├── listings/
│   ├── mediators/
│   ├── layout/
│   ├── icons/
│   └── ai/                           # componenti UI AI
│       ├── AIButton.tsx              # bottone ✨
│       ├── AISuggestionModal.tsx     # modale risultato AI
│       └── AIFeedback.tsx            # feedback utente post-AI
│
├── lib/
│   ├── supabaseClient.ts
│   ├── stripe.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── constants.ts
│   ├── ai/
│   │   ├── openaiClient.ts           # gestione chiamate API
│   │   ├── prompts/
│   │   │   ├── copyPrompt.ts         # descrizione annuncio
│   │   │   ├── pricePrompt.ts        # stima prezzo
│   │   │   └── messagePrompt.ts      # messaggio cortese
│   │   ├── aiLogger.ts               # log → ai_logs Supabase
│   │   └── aiPolicy.ts               # limiti, whitelist, fallback
│   └── hooks/
│       └── useAI.ts                  # hook React per modali e chiamate
│
├── devtools/
│   ├── mockData.json
│   ├── populate.mjs
│   ├── reset.mjs
│   └── aiTest.mjs                    # test AI locale con dati finti
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_init.sql
│   │   ├── 002_ai_tables.sql         # definizione ai_logs e ai_settings
│   │   └── 003_seed.sql
│   └── seed.sql
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── mock/
│       └── placeholder.jpg
│
├── .env.local                        # chiavi Supabase dev + OPENAI_API_KEY_DEV
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vercel.json
└── README.md
```

---

## ⚙️ Nuovi file principali (AI)
| File | Funzione |
|------|-----------|
| `/app/api/ai/generate/route.ts` | gestisce le richieste AI dal client, controlla input e quota |
| `/lib/ai/openaiClient.ts` | connessione sicura con OpenAI (chiave env dev) |
| `/lib/ai/prompts/*.ts` | prompt modulari per copy, price, message |
| `/lib/ai/aiLogger.ts` | scrive log su `ai_logs` (tipo, durata, output hash) |
| `/components/ai/*` | UI per suggerimenti, modali, feedback |
| `/supabase/migrations/002_ai_tables.sql` | crea `ai_logs` e `ai_settings` |

---

## 🧱 Schema dati AI (Supabase)
```sql
CREATE TABLE ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text CHECK (type IN ('copy','price','message')),
  input_preview text,
  output_preview text,
  tokens_used int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE ai_settings (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  opt_in boolean DEFAULT true,
  monthly_limit int DEFAULT 50,
  used_this_month int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
```

---

## 🧩 Differenze MVP Dev vs Prod
| Area | Dev | Prod |
|------|------|------|
| Supabase | `castala-dev` | `castala-prod` |
| AI Key | `OPENAI_API_KEY_DEV` | `OPENAI_API_KEY_PROD` |
| AI Costi | mock/fake | real billing |
| Log | verbose (console + Supabase) | ridotto, audit only |
| Dati | seed faker | utenti reali |
| Stripe | test mode | live |
| AI Toggle | sempre attivo | attivo per piani Free/Pro |

---

## 🧠 Dataset di test
- 10 annunci demo generati con AI copy.  
- 15 offerte con messaggi auto-generati.  
- 5 utenti con opt-in AI disattivato (per confronto).  
- 30 log AI in tabella `ai_logs`.

---

## 🪄 Scopo MVP AI Dev
- Validare UX dei pulsanti “✨ Genera” e “💡 Suggerisci”.  
- Testare coerenza e utilità percepita.  
- Misurare click-through, tempo di editing e feedback “utile/non utile”.
