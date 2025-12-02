import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString('utf8');
    
    return NextResponse.json({ text: text.slice(0, 4000) }); // First 4k chars
  } catch (error) {
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
}
