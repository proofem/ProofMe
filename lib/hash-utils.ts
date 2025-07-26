import CryptoJS from 'crypto-js';

export class HashUtils {
  
  /**
   * Generate SHA-256 hash from file
   */
  static async generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Generate SHA-256 hash from string
   */
  static generateStringHash(input: string): string {
    return CryptoJS.SHA256(input).toString();
  }

  /**
   * Generate SHA-256 hash from JSON object
   */
  static generateObjectHash(obj: Record<string, any>): string {
    const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
    return this.generateStringHash(jsonString);
  }

  /**
   * Verify file integrity by comparing hashes
   */
  static async verifyFileIntegrity(file: File, expectedHash: string): Promise<boolean> {
    try {
      const actualHash = await this.generateFileHash(file);
      return actualHash === expectedHash;
    } catch (error) {
      console.error('File verification failed:', error);
      return false;
    }
  }

  /**
   * Generate content fingerprint with metadata
   */
  static async generateContentFingerprint(
    file: File, 
    metadata: Record<string, any> = {}
  ): Promise<{
    fileHash: string;
    metadataHash: string;
    combinedHash: string;
    timestamp: string;
  }> {
    const fileHash = await this.generateFileHash(file);
    const timestamp = new Date().toISOString();
    
    const enrichedMetadata = {
      ...metadata,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp
    };
    
    const metadataHash = this.generateObjectHash(enrichedMetadata);
    const combinedHash = this.generateStringHash(fileHash + metadataHash);
    
    return {
      fileHash,
      metadataHash,
      combinedHash,
      timestamp
    };
  }

  /**
   * Create proof of existence hash
   */
  static createProofHash(
    contentHash: string,
    ownerAddress: string,
    timestamp: string
  ): string {
    const proofData = {
      contentHash,
      ownerAddress: ownerAddress.toLowerCase(),
      timestamp
    };
    return this.generateObjectHash(proofData);
  }

  /**
   * Generate short hash for display purposes
   */
  static shortenHash(hash: string, length: number = 8): string {
    if (hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  }

  /**
   * Validate hash format (64 character hex string for SHA-256)
   */
  static isValidSHA256(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash);
  }

  /**
   * Generate deterministic hash from multiple inputs
   */
  static generateMultiInputHash(...inputs: string[]): string {
    const combined = inputs.sort().join('|');
    return this.generateStringHash(combined);
  }

  /**
   * Create blockchain-ready proof object
   */
  static createBlockchainProof(
    fileHash: string,
    ownerAddress: string,
    metadata: Record<string, any> = {}
  ): {
    hash: string;
    owner: string;
    timestamp: string;
    proof: string;
    metadata: Record<string, any>;
  } {
    const timestamp = new Date().toISOString();
    const proof = this.createProofHash(fileHash, ownerAddress, timestamp);
    
    return {
      hash: fileHash,
      owner: ownerAddress.toLowerCase(),
      timestamp,
      proof,
      metadata: {
        ...metadata,
        version: '1.0',
        algorithm: 'SHA-256'
      }
    };
  }
}