import { neon } from '@neondatabase/serverless';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { pdfName, pdfUrl, userId, fileKey } = await request.json();

  if (!process.env.DATABASE_URL) {
    return new Response(null, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Insert the PDF details into the chats table
    await sql(
      'INSERT INTO chats (pdfName, pdfUrl, userId, fileKey) VALUES ($1, $2, $3, $4)',
      [pdfName, pdfUrl, userId, fileKey]
    );

    return NextResponse.json({ code: 1 });
  } catch (e) {
    return NextResponse.json({
      code: 0,
      message: e instanceof Error ? e.message : e?.toString(),
    });
  }
}