import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/db';

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
