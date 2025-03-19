import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  console.log('Form submission:', data);
  
  return NextResponse.json({ message: 'Form submitted successfully' });
}