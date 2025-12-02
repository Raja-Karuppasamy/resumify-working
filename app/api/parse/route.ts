import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString('utf8');
    
    // 🔥 SIMPLE REGEX PARSING (replace with AI later)
    const name = text.match(/^[A-Z\s]{2,50}$/gm)?.[0]?.trim() || 'Name not found';
    const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '';
    
    return NextResponse.json({ 
      text, 
      name, 
      email,
      raw: text.slice(0, 500) + '...' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
}
