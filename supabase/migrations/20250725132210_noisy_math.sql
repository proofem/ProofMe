/*
  # Initial ProofMe Database Setup

  This migration creates the foundational database structure for the ProofMe platform.
  
  1. New Tables
    - `users` - User profiles with wallet addresses and DIDs
    - `content` - Content metadata with blockchain hashes
    - `verification_logs` - Track all verification attempts
    - `admin_actions` - Audit trail for administrative actions
    - `api_keys` - Third-party API access management

  2. Security
    - Enable Row Level Security on all tables
    - Add policies for authenticated users to manage their own data
    - Create indexes for optimal query performance

  3. Features
    - UUID primary keys for enhanced security
    - Automatic timestamp management with triggers
    - JSONB fields for flexible metadata storage
    - Foreign key constraints for data integrity
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    did TEXT UNIQUE NOT NULL,
    email VARCHAR(255),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    file_url TEXT,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    blockchain_txn VARCHAR(66),
    icp_canister_id TEXT,
    is_verified BOOLEAN DEFAULT false,
    selfie_verified BOOLEAN DEFAULT false,
    verification_metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Verification logs table
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(64) NOT NULL,
    verifier_ip INET,
    verifier_user_agent TEXT,
    verification_result BOOLEAN NOT NULL,
    verification_timestamp TIMESTAMPTZ DEFAULT now(),
    api_key_used VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin actions table
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    action_details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 1000,
    allowed_origins TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_did ON users(did);
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_file_hash ON content(file_hash);
CREATE INDEX IF NOT EXISTS idx_content_timestamp ON content(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_content_hash ON verification_logs(content_hash);
CREATE INDEX IF NOT EXISTS idx_verification_logs_timestamp ON verification_logs(verification_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = wallet_address);

CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = wallet_address);

-- Create policies for content table
CREATE POLICY "Users can read own content"
    ON content
    FOR SELECT
    TO authenticated
    USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can insert own content"
    ON content
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can update own content"
    ON content
    FOR UPDATE
    TO authenticated
    USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

-- Create policies for API keys
CREATE POLICY "Users can manage own API keys"
    ON api_keys
    FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM users WHERE wallet_address = auth.uid()::text));

-- Create public policy for verification logs (read-only for transparency)
CREATE POLICY "Anyone can read verification logs"
    ON verification_logs
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();