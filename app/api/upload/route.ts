import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const walletAddress = formData.get('walletAddress') as string;

    if (!file || !userId || !walletAddress) {
      return NextResponse.json(
        { error: 'File, userId, and walletAddress are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer and generate SHA-256 hash
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const contentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Mock content record creation
    const contentRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      file_name: file.name,
      file_hash: contentHash,
      file_size: file.size,
      file_type: file.type,
      timestamp: new Date().toISOString()
    };

    // TODO: In production:
    // 1. Store file in IPFS or ICP Canister storage
    // 2. Save metadata to PostgreSQL
    // 3. Call ICP smart contract to store proof on blockchain
    
    // Mock blockchain transaction
    const blockchainTxn = `0x${crypto.randomBytes(32).toString('hex')}`;

    // TODO: Call Motoko smart contract
    // const proof = await icpContract.addProof(contentHash, walletAddress);

    return NextResponse.json({
      success: true,
      content: {
        id: contentRecord.id,
        fileName: contentRecord.file_name,
        fileHash: contentRecord.file_hash,
        timestamp: contentRecord.timestamp,
        blockchainTxn,
        verified: true
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload and authenticate content' },
      { status: 500 }
    );
  }
}