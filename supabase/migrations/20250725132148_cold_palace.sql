/*
  # ProofMe Database Schema
  
  This SQL file contains the complete database schema for the ProofMe platform.
  It includes all necessary tables, indexes, and constraints for user management,
  content authentication, and blockchain integration.

  ## Tables Created:
  1. Users - Store user profiles and decentralized identities
  2. Content - Store content metadata and blockchain hashes
  3. Verification_logs - Track verification attempts and results
  4. Admin_actions - Log administrative actions for audit trail

  ## Security Features:
  - UUID primary keys for better security
  - Indexed columns for optimal query performance
  - Timestamp tracking for all records
  - Foreign key constraints for data integrity
*/

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing user profiles and DID information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    did TEXT UNIQUE NOT NULL,
    email VARCHAR(255),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content table for storing file metadata and blockchain hashes
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash
    file_url TEXT, -- IPFS or storage URL
    file_size BIGINT NOT NULL, -- File size in bytes
    file_type VARCHAR(100) NOT NULL, -- MIME type
    blockchain_txn VARCHAR(66), -- Transaction hash on ICP
    icp_canister_id TEXT, -- ICP canister where content is stored
    is_verified BOOLEAN DEFAULT false,
    selfie_verified BOOLEAN DEFAULT false,
    verification_metadata JSONB, -- Additional verification data
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification logs table for tracking verification attempts
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(64) NOT NULL,
    verifier_ip INET,
    verifier_user_agent TEXT,
    verification_result BOOLEAN NOT NULL,
    verification_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    api_key_used VARCHAR(255), -- For third-party API access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin actions table for audit trail
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL, -- 'verify_content', 'ban_user', etc.
    target_type VARCHAR(50) NOT NULL, -- 'user', 'content'
    target_id UUID NOT NULL,
    action_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API keys table for third-party integrations
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    allowed_origins TEXT[], -- CORS origins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_did ON users(did);
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_file_hash ON content(file_hash);
CREATE INDEX IF NOT EXISTS idx_content_timestamp ON content(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_content_hash ON verification_logs(content_hash);
CREATE INDEX IF NOT EXISTS idx_verification_logs_timestamp ON verification_logs(verification_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (optional, for development)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE wallet_address = '0x0000000000000000000000000000000000000001') THEN
        INSERT INTO users (name, wallet_address, did, email, is_verified) VALUES 
        ('ProofMe Admin', '0x0000000000000000000000000000000000000001', 'did:icp:admin-canister-id', 'admin@proofme.io', true);
    END IF;
END $$;