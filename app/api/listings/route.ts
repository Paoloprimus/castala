import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';
import { getCurrentUserId } from '../../../lib/auth';

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
