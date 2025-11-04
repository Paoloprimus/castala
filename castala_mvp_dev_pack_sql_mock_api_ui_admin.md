# Castala — MVP-dev Pack (SQL + Mock API + UI Admin)

Copia/incolla i file nelle posizioni indicate. Segui i 5 passi finali.

---

## 1) Supabase SQL — migrazioni

### `/supabase/migrations/001_init.sql`
```sql
-- Core tables (MVP-dev: niente RLS per fare in fretta)
create table if not exists users (
  id uuid primary key,
  email text not null,
  full_name text,
  role text check (role in ('seller','buyer','mediator','credit','admin')) default 'seller',
  created_at timestamptz default now()
);

create table if not exists listings (
  id uuid primary key,
  seller_id uuid not null references users(id),
  title text not null,
  description text,
  base_price integer not null,
  location text,
  gallery_url text,
  status text check (status in ('draft','open','closed')) default 'open',
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_listings_status_expires on listings(status, expires_at);

create table if not exists offers (
  id uuid primary key,
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references users(id),
  amount integer not null check (amount > 0),
  message text,
  created_at timestamptz default now()
);

create index if not exists idx_offers_listing_amount on offers(listing_id, amount desc);

create table if not exists ratings (
  id uuid primary key,
  target_type text check (target_type in ('seller','mediator','credit','app')) not null,
  target_id uuid,
  stars int check (stars between 1 and 5) not null,
  text text,
  author_id uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists mediators (
  id uuid primary key,
  name text not null,
  agency text,
  rating_avg numeric(3,2) default 0,
  rating_count int default 0
);

create table if not exists referrals (
  id uuid primary key,
  listing_id uuid not null references listings(id) on delete cascade,
  partner_type text check (partner_type in ('mediator','credit')) not null,
  partner_id uuid,
  user_id uuid not null references users(id),
  created_at timestamptz default now()
);

-- Email finta (outbox) e pagamenti finti (mock)
create table if not exists outbox_emails (
  id uuid primary key,
  to_email text not null,
  subject text not null,
  html text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key,
  user_id uuid references users(id),
  plan text check (plan in ('free','pro')) default 'free',
  status text check (status in ('succeeded','failed','refunded','mocked')) default 'mocked',
  created_at timestamptz default now()
);

-- Telemetria minimale UI
create table if not exists ui_metrics (
  id uuid primary key,
  user_id uuid references users(id),
  event text,
  meta jsonb,
  created_at timestamptz default now()
);
```

### `/supabase/migrations/002_ai_tables.sql`
```sql
create table if not exists ai_settings (
  user_id uuid primary key references users(id),
  opt_in boolean default true,
  monthly_limit int default 50,
  used_this_month int default 0,
  updated_at timestamptz default now()
);

create table if not exists ai_logs (
  id uuid primary key,
  user_id uuid references users(id),
  type text check (type in ('copy','price','message','feedback')),
  input_preview text,
  output_preview text,
  tokens_used int default 0,
  mock boolean default true,
  created_at timestamptz default now()
);
```

### `/supabase/migrations/003_seed.sql`
```sql
-- Utenti finti (usa gli stessi ID anche in .env)
insert into users (id, email, full_name, role) values
  ('00000000-0000-0000-0000-000000000001','seller@example.com','Sara Venditrice','seller'),
  ('00000000-0000-0000-0000-000000000002','buyer@example.com','Bruno Compratore','buyer'),
  ('00000000-0000-0000-0000-000000000003','mario.mediatore@example.com','Mario Mediatore','mediator'),
  ('00000000-0000-0000-0000-000000000004','carla.crediti@example.com','Carla Crediti','credit'),
  ('00000000-0000-0000-0000-000000000005','admin@example.com','Ada Admin','admin')
  on conflict (id) do nothing;

insert into listings (id, seller_id, title, description, base_price, location, gallery_url, status, expires_at) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Bilocale luminoso','Zona centrale, piano 3, balcone.',120000,'Verona','https://picsum.photos/seed/casa1/800/500','open', now() + interval '7 days'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Trilocale con giardino','Quartiere tranquillo, box auto.',175000,'Vicenza','https://picsum.photos/seed/casa2/800/500','open', now() + interval '5 days')
  on conflict (id) do nothing;

insert into offers (id, listing_id, buyer_id, amount, message) values
  ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',119000,'Ciao, offerta rapida. Posso chiudere presto.'),
  ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',121000,'Aumento leggero, pronta disponibilità.')
  on conflict (id) do nothing;

insert into mediators (id, name, agency, rating_avg, rating_count) values
  ('30000000-0000-0000-0000-000000000001','Studio Verdi','Verdi Agency',4.6,12),
  ('30000000-0000-0000-0000-000000000002','Team Blu','Blu Agency',4.3,9)
  on conflict (id) do nothing;

insert into ai_settings (user_id, opt_in, monthly_limit, used_this_month) values
  ('00000000-0000-0000-0000-000000000001', true, 50, 0),
  ('00000000-0000-0000-0000-000000000002', true, 50, 0)
  on conflict (user_id) do nothing;

insert into ai_logs (id, user_id, type, input_preview, output_preview, tokens_used, mock) values
  ('40000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','copy','Genera descrizione bilocale','Bilocale luminoso con balcone...', 40, true),
  ('40000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','price','Suggerisci prezzo','€118.000 - €124.000', 12, true)
  on conflict (id) do nothing;

insert into outbox_emails (id, to_email, subject, html) values
  ('50000000-0000-0000-0000-000000000001','seller@example.com','Hai ricevuto un’offerta','<p>Offerta su Bilocale luminoso</p>')
  on conflict (id) do nothing;
```

---

## 2) Feature flags e auth finta

### `/config/featureFlags.ts`
```ts
export const FLAGS = {
  USE_STRIPE: process.env.NEXT_PUBLIC_FEATURE_USE_STRIPE === 'true',
  USE_EMAIL: process.env.NEXT_PUBLIC_FEATURE_USE_EMAIL === 'true',
  USE_AI: process.env.NEXT_PUBLIC_FEATURE_USE_AI === 'true',
};
```

### `/lib/auth.ts` (utente finto da .env)
```ts
export function getCurrentUserId() {
  return process.env.NEXT_PUBLIC_DEV_USER_ID || '00000000-0000-0000-0000-000000000001';
}
```

### `.env.local` (esempio)
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON
NEXT_PUBLIC_FEATURE_USE_STRIPE=false
NEXT_PUBLIC_FEATURE_USE_EMAIL=false
NEXT_PUBLIC_FEATURE_USE_AI=false
NEXT_PUBLIC_DEV_USER_ID=00000000-0000-0000-0000-000000000001
```

---

## 3) Mock services

### `/lib/ai/mockOpenAI.ts`
```ts
export async function generateMock(type: 'price'|'copy'|'message', prompt: string) {
  if (type === 'price') {
    return { text: 'Prezzo suggerito: €118.000 - €124.000', tokens: 12, mock: true };
  }
  if (type === 'copy') {
    return { text: 'Bilocale luminoso, piano alto, balcone e vista aperta. Zona servita.', tokens: 40, mock: true };
  }
  return { text: 'Messaggio gentile e conciso per l’offerta.', tokens: 10, mock: true };
}
```

### `/lib/mocks/paymentsMock.ts`
```ts
export async function fakeCheckout(userId: string, plan: 'free'|'pro' = 'pro') {
  // Simula ritardo
  await new Promise(r => setTimeout(r, 1200));
  return { id: crypto.randomUUID(), userId, plan, status: 'mocked' as const };
}
```

### `/lib/mocks/emailMock.ts`
```ts
export async function sendEmailMock(to: string, subject: string, html: string) {
  console.log('[EMAIL MOCK]', { to, subject });
  return { id: crypto.randomUUID(), to, subject, html };
}
```

### `/lib/mocks/storageMock.ts`
```ts
export function getPlaceholderImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`;
}
```

---

## 4) AI client + logger + API

### `/lib/ai/aiLogger.ts`
```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function logAI(userId: string, type: 'copy'|'price'|'message'|'feedback', input_preview: string, output_preview: string, tokens_used = 0, mock = true) {
  await supabase.from('ai_logs').insert({ id: crypto.randomUUID(), user_id: userId, type, input_preview, output_preview, tokens_used, mock });
}
```

### `/lib/ai/openaiClient.ts` (switch mock/real)
```ts
import { FLAGS } from '@/config/featureFlags';
import { generateMock } from './mockOpenAI';

export async function generateAI(type: 'price'|'copy'|'message', prompt: string) {
  if (!FLAGS.USE_AI) return generateMock(type, prompt);
  // (Opzionale) ramo reale con OpenAI se mai abiliti
  return generateMock(type, prompt);
}
```

### `/app/api/ai/generate/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { generateAI } from '@/lib/ai/openaiClient';
import { logAI } from '@/lib/ai/aiLogger';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, prompt } = body as { type: 'copy'|'price'|'message'; prompt: string };
  const userId = getCurrentUserId();
  const out = await generateAI(type, prompt || '');
  await logAI(userId, type, prompt?.slice(0,120) || '', out.text.slice(0,200), out.tokens, true);
  return NextResponse.json({ ok: true, text: out.text });
}
```

---

## 5) API minime Listings/Offers (solo ciò che serve alla demo)

### `/lib/db.ts` (client Supabase lato server)
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
```

### `/app/api/listings/route.ts` (GET list, POST create)
```ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, data });
}

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId();
  const body = await req.json();
  const row = {
    id: crypto.randomUUID(),
    seller_id: userId,
    title: body.title,
    description: body.description,
    base_price: body.base_price,
    location: body.location,
    gallery_url: body.gallery_url,
    status: 'open',
    expires_at: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
  };
  const { error } = await supabase.from('listings').insert(row);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, data: row });
}
```

### `/app/api/listings/[id]/offers/route.ts` (GET offerte per annuncio)
```ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(_: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('listing_id', id)
    .order('amount', { ascending: false });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, data });
}
```

### `/app/api/offers/route.ts` (POST crea offerta)
```ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId();
  const body = await req.json();
  const row = {
    id: crypto.randomUUID(),
    listing_id: body.listing_id,
    buyer_id: userId,
    amount: body.amount,
    message: body.message || null,
  };
  const { error } = await supabase.from('offers').insert(row);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, data: row });
}
```

---

## 6) UI ultraleggera per la demo (App Router)

### `/app/page.tsx` (Home: lista + CTA)
```tsx
'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  useEffect(() => { fetch('/api/listings').then(r=>r.json()).then(j=>setListings(j.data||[])); }, []);
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Castala (MVP-dev)</h1>
      <a className="inline-block px-4 py-2 bg-black text-white rounded" href="/new">+ Crea annuncio</a>
      <div className="space-y-3">
        {listings.map(l => (
          <a key={l.id} href={`/listing/${l.id}`} className="block border p-3 rounded">
            <div className="text-lg font-semibold">{l.title}</div>
            <div className="text-sm opacity-80">Base: €{l.base_price} · {l.location}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
```

### `/app/new/page.tsx` (Crea annuncio con AI)
```tsx
'use client';
import { useState } from 'react';

export default function NewListing() {
  const [title, setTitle] = useState('Bilocale luminoso');
  const [description, setDescription] = useState('Zona centrale...');
  const [basePrice, setBasePrice] = useState(120000);
  const [location, setLocation] = useState('Verona');
  const [galleryUrl, setGalleryUrl] = useState('https://picsum.photos/seed/new/800/500');

  async function aiCopy() {
    const r = await fetch('/api/ai/generate', { method:'POST', body: JSON.stringify({ type:'copy', prompt: title }), headers:{ 'Content-Type':'application/json' } });
    const j = await r.json(); setDescription(j.text);
  }
  async function aiPrice() {
    const r = await fetch('/api/ai/generate', { method:'POST', body: JSON.stringify({ type:'price', prompt: description }), headers:{ 'Content-Type':'application/json' } });
    const j = await r.json(); alert(j.text);
  }
  async function save() {
    const r = await fetch('/api/listings', { method:'POST', body: JSON.stringify({ title, description, base_price: basePrice, location, gallery_url: galleryUrl }), headers:{ 'Content-Type':'application/json' } });
    const j = await r.json(); if (j.ok) window.location.href = `/listing/${j.data.id}`;
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-2">
      <h1 className="text-xl font-bold">Nuovo annuncio</h1>
      <input className="border p-2 w-full" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2 w-full h-28" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={aiCopy}>✨ Genera descrizione</button>
        <button className="px-3 py-2 border rounded" onClick={aiPrice}>💡 Suggerisci prezzo</button>
      </div>
      <input className="border p-2 w-full" type="number" value={basePrice} onChange={e=>setBasePrice(parseInt(e.target.value||'0'))} />
      <input className="border p-2 w-full" value={location} onChange={e=>setLocation(e.target.value)} />
      <input className="border p-2 w-full" value={galleryUrl} onChange={e=>setGalleryUrl(e.target.value)} />
      <button className="px-4 py-2 bg-black text-white rounded" onClick={save}>Salva</button>
    </main>
  );
}
```

### `/app/listing/[id]/page.tsx` (Dettaglio + offerte)
```tsx
'use client';
import { useEffect, useState } from 'react';

export default function ListingDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [listing, setListing] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/listings').then(r=>r.json()).then(j=>{
      const l = (j.data||[]).find((x:any)=>x.id===id); setListing(l);
    });
    fetch(`/api/listings/${id}/offers`).then(r=>r.json()).then(j=>setOffers(j.data||[]));
  }, [id]);

  async function aiMsg() {
    const r = await fetch('/api/ai/generate', { method:'POST', body: JSON.stringify({ type:'message', prompt: 'offerta' }), headers:{ 'Content-Type':'application/json' } });
    const j = await r.json(); setMessage(j.text);
  }
  async function submitOffer() {
    const r = await fetch('/api/offers', { method:'POST', body: JSON.stringify({ listing_id: id, amount, message }), headers:{ 'Content-Type':'application/json' } });
    const j = await r.json(); if (j.ok) location.reload();
  }

  if (!listing) return <main className="p-4">Carico…</main>;
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <img src={listing.gallery_url} alt="" className="w-full rounded" />
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <div>Base: €{listing.base_price} · {listing.location}</div>
      <p className="opacity-80">{listing.description}</p>

      <section className="border-t pt-3">
        <h2 className="font-semibold mb-2">Fai un’offerta</h2>
        <input className="border p-2 mr-2" type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||'0'))} />
        <button className="px-2 py-2 border rounded mr-2" onClick={aiMsg}>🪄 Messaggio AI</button>
        <textarea className="border p-2 w-full mt-2" value={message} onChange={e=>setMessage(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded mt-2" onClick={submitOffer}>Invia offerta</button>
      </section>

      <section className="border-t pt-3">
        <h3 className="font-semibold mb-1">Offerte</h3>
        <ul className="space-y-2">
          {offers.map(o => (
            <li key={o.id} className="border p-2 rounded">€{o.amount} — {o.message || '—'}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

---

## 7) Admin viste (opzionali ma utili per demo)

### `/app/admin/ai/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';

export default function AIAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/ai').then(r=>r.json()).then(j=>setRows(j.data||[]));
  }, []);
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-3">AI Logs</h1>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="border p-2 rounded">
            <div className="text-sm opacity-60">{r.type} · {new Date(r.created_at).toLocaleString()}</div>
            <div className="font-medium">In: {r.input_preview}</div>
            <div>Out: {r.output_preview}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### `/app/api/admin/ai/route.ts`
```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
export async function GET() {
  const { data, error } = await supabase.from('ai_logs').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, data });
}
```

---

## 8) Script utili

### `package.json` (aggiunte)
```json
{
  "scripts": {
    "db:reset": "supabase db reset",
    "dev": "next dev"
  }
}
```

---

## 9) Checklist rapida demo
1) Metti `.env.local` con le 5 variabili.
2) Esegui migrazioni: `npm run db:reset` (o `supabase db reset`).
3) Avvia: `npm run dev` e apri `http://localhost:3000`.
4) Crea un annuncio con “✨ Genera descrizione / 💡 Suggerisci prezzo”.
5) Apri l’annuncio, fai un’offerta con “🪄 Messaggio AI”.
6) (Opz.) Vedi log AI su `/admin/ai`.
```

