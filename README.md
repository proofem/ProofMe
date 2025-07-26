# ProofMe - Web3 Content Authentication Platform

A decentralized platform for authenticating and proving ownership of digital content using blockchain technology, Web3 wallets, and decentralized identity (DID).

## 🚀 Features

### Core Authentication
- **Web3 Wallet Integration**: Connect with MetaMask, Plug Wallet, and other Web3 wallets
- **Decentralized Identity (DID)**: Generate and manage decentralized identities for users
- **Content Upload**: Support for images, videos, documents, and certificates
- **Live Selfie Verification**: Optional identity verification during upload process
- **SHA-256 Hash Fingerprinting**: Generate unique content fingerprints

### Blockchain Integration
- **ICP Blockchain Storage**: Store content proofs on Internet Computer Protocol
- **Smart Contracts**: Motoko contracts for proof recording and retrieval
- **Immutable Records**: Timestamped ownership proofs that cannot be altered
- **Transaction Tracking**: Full audit trail of all authentication activities

### Verification System
- **Hash-based Verification**: Instant content authenticity checking
- **Public Verification Portal**: Anyone can verify content authenticity
- **REST API**: Third-party integration for content verification
- **Verification Certificates**: Downloadable proof of authenticity

### User Experience
- **Intuitive Dashboard**: Manage all authenticated content in one place
- **Modern UI/UX**: Responsive design with glassmorphism effects
- **Real-time Progress**: Visual feedback during upload and verification
- **Content Management**: View, share, and manage verified content

## 🛠 Tech Stack

### Frontend
- **Next.js 13+**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: Runtime environment
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Relational database for metadata
- **REST APIs**: Standard HTTP APIs for integration

### Blockchain
- **Internet Computer Protocol (ICP)**: Blockchain platform
- **Motoko**: Smart contract programming language
- **Web3 Integration**: Ethereum-compatible wallet support
- **Decentralized Storage**: IPFS or ICP Canister storage

### Security
- **SHA-256 Hashing**: Cryptographic content fingerprinting
- **Row Level Security**: Database-level access control
- **DID Standards**: W3C Decentralized Identifier specification
- **Signature Verification**: Cryptographic proof of ownership

## 📁 Project Structure

```
proofme/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── register/      # User registration
│   │   ├── upload/        # Content upload
│   │   ├── verify/        # Content verification
│   │   └── content/       # User content management
│   ├── dashboard/         # User dashboard
│   ├── verify/           # Public verification portal
│   └── page.tsx          # Landing page
├── components/            # Reusable UI components
├── lib/                  # Utility libraries
│   ├── web3-utils.ts     # Web3 wallet integration
│   ├── hash-utils.ts     # Content hashing utilities
│   └── icp-integration.ts # ICP blockchain client
├── smart-contracts/      # Motoko smart contracts
│   └── content_proof.mo  # Content authentication contract
├── database/             # Database schemas and migrations
│   ├── schema.sql        # Complete database schema
│   └── migrations/       # Database migration files
└── README.md            # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Web3 wallet (MetaMask recommended)
- ICP development environment (optional for local testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/proofme.git
   cd proofme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/proofme"
   
   # ICP Configuration
   NEXT_PUBLIC_ICP_CANISTER_ID="your-canister-id"
   NEXT_PUBLIC_ICP_NETWORK="local"
   NEXT_PUBLIC_ICP_HOST="http://localhost:8000"
   
   # Web3 Configuration
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"
   
   # API Configuration
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb proofme
   
   # Run migrations
   psql -d proofme -f database/schema.sql
   ```

5. **Deploy smart contracts (optional)**
   ```bash
   # Install dfx (ICP SDK)
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   
   # Start local ICP replica
   dfx start --background
   
   # Deploy the content proof canister
   dfx deploy content_proof
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

### Core Tables

#### Users
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- wallet_address (VARCHAR, Unique)
- did (TEXT, Unique)
- email (VARCHAR, Optional)
- is_verified (BOOLEAN)
- created_at (TIMESTAMP)
```

#### Content
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- file_name (VARCHAR)
- file_hash (VARCHAR, Unique)
- file_url (TEXT)
- file_size (BIGINT)
- file_type (VARCHAR)
- blockchain_txn (VARCHAR)
- is_verified (BOOLEAN)
- timestamp (TIMESTAMP)
```

## 🔗 API Endpoints

### Authentication
- `POST /api/register` - Register new user with DID
- `POST /api/auth/verify` - Verify wallet signature

### Content Management
- `POST /api/upload` - Upload and authenticate content
- `GET /api/content/:userId` - Get user's authenticated content
- `PUT /api/content/:id` - Update content metadata

### Verification
- `GET /api/verify/:hash` - Verify content authenticity
- `POST /api/verify/batch` - Batch verification
- `GET /api/stats` - Platform statistics

### Third-party Integration
- `GET /api/public/verify/:hash` - Public verification endpoint
- `POST /api/webhook/verify` - Webhook for external services

## 🔒 Smart Contract Functions

### ContentProof.mo (Motoko)

```motoko
// Add new content proof
addProof(hash: Text, fileName: Text, fileType: Text, caller: Principal) -> Result<Bool, Text>

// Verify existing proof
verifyProof(hash: Text) -> Result<OwnerInfo, Text>

// Get all proofs for owner
getOwnerProofs(owner: Principal) -> [ProofRecord]

// Check if hash exists
hashExists(hash: Text) -> Bool

// Update verification status
updateVerificationStatus(hash: Text, verified: Bool, caller: Principal) -> Result<Bool, Text>
```

## 🔌 Third-party Integration

### REST API Usage
```javascript
// Verify content authenticity
const response = await fetch('https://api.proofme.io/verify/YOUR_CONTENT_HASH', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
console.log('Content verified:', result.verified);
```

### Webhook Integration
```javascript
// Set up webhook for real-time verification
const webhook = {
  url: 'https://your-app.com/webhook/proofme',
  events: ['content.verified', 'content.uploaded']
};
```

## 🎨 UI Components

### Key Components
- **WalletConnector**: Web3 wallet connection interface
- **ContentUploader**: Drag-and-drop file upload with progress
- **VerificationPortal**: Hash-based content verification
- **Dashboard**: User content management interface
- **CertificateGenerator**: Authenticity certificate creation

### Design System
- **Colors**: Purple/blue gradient theme with accent colors
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Glassmorphism effects with subtle animations

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod
   ```

3. **Deploy ICP Canisters**
   ```bash
   dfx deploy --network ic
   ```

4. **Configure production database**
   - Set up PostgreSQL on your cloud provider
   - Update DATABASE_URL in production environment
   - Run migrations

### Environment Configuration
- Update ICP canister IDs for mainnet
- Configure production API endpoints
- Set up monitoring and logging
- Enable SSL/TLS certificates

## 🔐 Security Considerations

### Best Practices
- Store private keys securely (never in code)
- Validate all user inputs
- Use HTTPS for all API communications
- Implement rate limiting on API endpoints
- Regular security audits of smart contracts

### Data Privacy
- Hash files locally before upload
- Store minimal user data
- Implement GDPR compliance
- User data portability options

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Ensure responsive design
- Maintain accessibility standards

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [ICP Developer Docs](https://internetcomputer.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Motoko Programming Language](https://internetcomputer.org/docs/current/developer-docs/backend/motoko/)

### Community
- [Discord Server](#)
- [GitHub Discussions](#)
- [Twitter](https://twitter.com/proofme)

### Issues
If you encounter any issues, please [create a GitHub issue](https://github.com/your-org/proofme/issues) with:
- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

Built with ❤️ by the ProofMe team. Securing digital content ownership through blockchain technology.

A quick note 🚧
This repository is still under development.

The current code is primarily intended for demos and hackathons.
Some features may be incomplete, experimental, or non-functional at this stage.


🙏 Special Thanks
Huge thanks to the WCSH Hackathon organizers and ICP Hub Egypt
for this incredible opportunity to showcase our vision.

We're excited to turn ProofMe into a global standard for digital trust and authenticity.

