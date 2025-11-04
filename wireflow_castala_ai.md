# 🧭 Wireflow – Castala! (AI-Enabled MVP)
**Payoff:** “Poi la casa si vende da sola.”

---

## 🌐 Flusso generale utente
```
╭────────────────────────────────────────────────────────╮
│        HOME → REGISTRAZIONE → DASHBOARD → CREA CASTA    │
╰────────────────────────────────────────────────────────╯
                          │
                          ▼
                +--------------------+
                |  Form Crea Annuncio|
                +--------------------+
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 [ ✨ AI Genera Descrizione ]       [ 💡 AI Suggerisci Prezzo ]
          │                               │
          ▼                               ▼
 [ Campo compilato/modificabile ]   [ Range di prezzo visibile ]
          │                               │
          └───────────────┬───────────────┘
                          ▼
                [ PUBBLICA CASTA ]
                          │
                          ▼
                  Annuncio attivo
```

---

## 🏗️ Flusso “Casta la tua casa” con AI
```
+---------------------------------------------------+
|  Titolo immobile                                  |
|  Descrizione [ ✨ Genera con AI ]                  |
|  Prezzo base [ 💡 Suggerisci con AI ]             |
|  Link esterno (Drive, Dropbox, iCloud)            |
|  Località                                         |
|  [ PUBBLICA ]                                     |
+---------------------------------------------------+
        │
        ▼
 ┌────────────────────────────────────────────┐
 │  AI Suggestion Modal:                      │
 │  “Ecco una descrizione generata”           │
 │  [ 🔄 Rigenera ] [ ✏️ Modifica ] [ ✅ Usa ] │
 └────────────────────────────────────────────┘
```

---

## 💬 Flusso Offerta (Buyer)
```
+---------------------------------------------------+
|  Importo offerta                                  |
|  Messaggio al venditore                           |
|  [ ✨ Suggerisci messaggio con AI ]               |
|  [ INVIA OFFERTA ]                                |
+---------------------------------------------------+
        │
        ▼
 AI genera messaggio tipo:
 “Buongiorno, sono interessato al suo immobile,
 potremmo sentirci per maggiori dettagli?”
        │
        ▼
 Buyer conferma → offerta registrata
```

---

## 📊 Flusso Dashboard Venditore (post-AI)
```
╭──────────────────────────────╮
│ Dashboard Venditore          │
├──────────────────────────────┤
│ - Caste attive               │
│ - Offerte ricevute           │
│ - Valutazioni                │
│ [ 🪄 Migliora annuncio con AI ] 
│ [ 📈 Statistiche Pro ]        │
╰──────────────────────────────╯
       │
       ▼
AI re-suggerisce titolo o testo
basandosi su feedback e click-rate
```

---

## 🧾 Flusso Mediatori / Creditizi (post-asta)
```
Annuncio chiuso → Mostra mediatori suggeriti
         │
         ▼
   [ CONTATTA MEDIATORE ]
         │
         ▼
Sistema registra referral lead
```

---

## ⭐ Flusso Valutazioni & AI Feedback
```
+----------------------------------------------+
|  ⭐ Lascia recensione                         |
|  📱 App: ⭐⭐⭐⭐☆                               |
|  🧠 Hai usato l’AI per generare testo?        |
|  [ ✅ Sì ]  [ ⬜ No ]                          |
+----------------------------------------------+
        │
        ▼
  AI feedback salvato in tabella `ai_logs`
  per miglioramento modelli futuri.
```

---

## 🔄 Flusso AI interno (tecnico)
```
Utente → UI “✨” click
        │
        ▼
Supabase function → API /ai/generate
        │
        ▼
OpenAI GPT-4-mini
        │
        ▼
Output (JSON)
        │
        ▼
UI Modal → mostra, modifica, conferma
        │
        ▼
Log in `ai_logs` (tipo, user_id, timestamp)
```

---

## 🪄 Note UX operative
- Ogni azione AI è opzionale.
- Nessun dato personale nei prompt.
- Sempre feedback “Generato con AI, modificabile”.
- Tutti i testi confermati restano in DB come contenuto utente.
- Ogni click AI loggato con tipo e tempo risposta.
