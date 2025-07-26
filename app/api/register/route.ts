import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, walletAddress } = await request.json();

    if (!name || !walletAddress) {
      return NextResponse.json(
        { error: 'Name and wallet address are required' },
        { status: 400 }
      );
    }

    // Generate DID (Decentralized Identity)
    const did = `did:icp:${crypto.randomBytes(16).toString('hex')}`;
    
    // Mock user creation (In production, this would interact with PostgreSQL)
    const user = {
      id: crypto.randomUUID(),
      name,
      walletAddress,
      did,
      created_at: new Date().toISOString()
    };

    // TODO: In production, save to PostgreSQL database
    // const query = 'INSERT INTO users (id, name, wallet_address, did, created_at) VALUES ($1, $2, $3, $4, $5)';
    // await db.query(query, [user.id, user.name, user.walletAddress, user.did, user.created_at]);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        walletAddress: user.walletAddress,
        did: user.did
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}