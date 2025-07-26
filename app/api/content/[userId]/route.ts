import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: In production, query PostgreSQL for user's content
    // const query = 'SELECT * FROM content WHERE user_id = $1 ORDER BY timestamp DESC';
    // const result = await db.query(query, [userId]);

    // Mock user content
    const userContent = [
      {
        id: "1",
        fileName: "artwork_final.jpg",
        fileType: "image/jpeg",
        fileHash: "a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2",
        timestamp: "2025-01-09T10:30:00Z",
        verified: true,
        size: "2.4 MB",
        blockchainTxn: "0x8f3b2c1a9e7d6f5c4b3a2e1d9c8b7a6f5e4d3c2b1a"
      },
      {
        id: "2",
        fileName: "certificate.pdf", 
        fileType: "application/pdf",
        fileHash: "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6",
        timestamp: "2025-01-08T15:45:00Z",
        verified: true,
        size: "1.2 MB",
        blockchainTxn: "0x7e2d1c0b9a8f6e5d4c3b2a1e0d9c8b7a6f5e4d3c2b"
      }
    ];

    return NextResponse.json({
      success: true,
      content: userContent
    });

  } catch (error) {
    console.error('Content retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user content' },
      { status: 500 }
    );
  }
}