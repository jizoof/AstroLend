# AstroLend Frontend

Next.js web application for the AstroLend lending protocol on Stellar Futurenet.

The AstroLend frontend provides a modern, user-friendly interface for interacting with the Peer-to-Pool lending protocol. Built with Next.js 16, React 19, and Tailwind CSS, integrated with Soroban smart contracts via Freighter wallet.

## Features

- 🏦 **Dashboard**: Real-time overview of user positions, TVL, and market data from on-chain
- 💰 **Lend & Withdraw**: Deposit assets to earn interest, withdraw when needed
- 📊 **Borrow & Repay**: Borrow assets against collateral with real-time health monitoring
- 📈 **Markets Overview**: View all available markets and their rates from oracle
- 🔒 **Freighter Integration**: Seamless wallet connection and transaction signing
- 🌐 **Soroban Integration**: Real on-chain contract calls via Soroban SDK
- 🎨 **Modern UI**: Built with Radix UI components and Tailwind CSS
- 🌓 **Dark Mode**: Full theme support

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or pnpm
- [Freighter Wallet](https://freighter.app/) browser extension
- Freighter set to **Futurenet** network

### Installation

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

### Environment Variables

Create a `.env.local` file in the frontend directory with your deployed contract addresses:

```env
# Pool Contract ID (deployed on Futurenet)
NEXT_PUBLIC_POOL_CONTRACT_ID=CXXX...

# Price Oracle Contract ID
NEXT_PUBLIC_ORACLE_CONTRACT_ID=CXXX...

# Interest Rate Model Contract ID
NEXT_PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ID=CXXX...

# Wrapped XLM Token Contract ID (SAC)
NEXT_PUBLIC_XLM_TOKEN_ID=CXXX...

# Mock USDC Token Contract ID (SAC)
NEXT_PUBLIC_USDC_TOKEN_ID=CXXX...
```

> **Note**: You can get these contract IDs by running the deployment scripts in `/scripts/`. See the main README for deployment instructions.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout with WalletProvider
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix UI)
│   ├── navbar.tsx      # Navigation with wallet connection
│   ├── main-application.tsx
│   ├── markets-overview.tsx
│   ├── health-factor-indicator.tsx
│   └── ...
├── pages/               # Page components
│   ├── dashboard.tsx   # Main dashboard with on-chain data
│   ├── lend-withdraw.tsx
│   ├── borrow-repay.tsx
│   └── collateral.tsx
├── hooks/               # Custom React hooks
│   └── use-wallet.ts   # Freighter wallet hook
├── context/             # React context
│   └── wallet-context.tsx  # Freighter wallet provider
├── config/              # Configuration
│   └── contracts.ts    # Contract addresses and network config
├── services/            # API and contract services
│   ├── soroban-service.ts  # Real Soroban contract calls
│   └── mock-contract-api.ts  # Mock data for development
├── types/               # TypeScript types
├── utils/               # Utility functions
└── public/              # Static assets
```

## Wallet Integration

The frontend integrates with **Freighter Wallet** for Stellar/Soroban interactions:

### For Users

1. Install the [Freighter browser extension](https://freighter.app/)
2. Create or import a Stellar account
3. Switch to **Futurenet** network in Freighter settings
4. Fund your account from the [Futurenet Friendbot](https://friendbot-futurenet.stellar.org/)
5. Connect wallet on AstroLend

### For Developers

The wallet integration is handled through:

- `context/wallet-context.tsx` - Manages wallet state with `@stellar/freighter-api`
- `hooks/use-wallet.ts` - Hook for accessing wallet state and functions
- `services/soroban-service.ts` - Builds and submits Soroban transactions

Key functions exposed by `useWallet()`:
```typescript
const {
  publicKey,           // Connected wallet address
  isConnected,         // Connection status
  isFreighterInstalled,// Whether Freighter extension exists
  network,             // Current network (should be FUTURENET)
  connectWallet,       // Connect to Freighter
  disconnectWallet,    // Disconnect wallet
  signTx,              // Sign transaction XDR
  error,               // Connection error message
  isLoading,           // Loading state
} = useWallet()
```

## Contract Integration

The frontend interacts with these Soroban contracts:

| Contract | Purpose |
|----------|---------|
| **Pool** | Main lending pool (supply, borrow, repay, liquidate) |
| **Price Oracle** | Asset prices (XLM/USD, USDC/USD) |
| **Interest Rate Model** | Variable interest rate calculation |

### API Usage

```typescript
import { astrolendContractAPI } from "@/services/soroban-service"

const dashboardData = await astrolendContractAPI.getDashboardData(publicKey)
const markets = await astrolendContractAPI.getMarkets()

await astrolendContractAPI.depositCollateral(publicKey, amount, signTx)
await astrolendContractAPI.borrow(publicKey, amount, signTx)
await astrolendContractAPI.repay(publicKey, amount, signTx)
```

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI
- **Blockchain**: Stellar Soroban (Futurenet)
- **Wallet**: @stellar/freighter-api
- **Soroban SDK**: @stellar/stellar-sdk
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## Development Notes

- If contracts are not deployed, the frontend falls back to mock data
- The Soroban service automatically handles transaction simulation and preparation
- All amounts use 7 decimal places (Stellar standard)
- Health factor < 1.0 indicates an unhealthy position subject to liquidation

## Testing Without Contracts

The frontend can run without deployed contracts using mock data:

1. Leave the `NEXT_PUBLIC_*_CONTRACT_ID` variables empty
2. The app will use `mock-contract-api.ts` for data
3. Transactions will fail (no contracts to call)

This is useful for UI development and testing.

## License

MIT License
