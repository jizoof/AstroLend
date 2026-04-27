# AstroLend Scripts

Utility scripts for deploying, seeding, and managing the AstroLend lending protocol.

One-click deployment of all AstroLend contracts:

Creates and wraps tokens for use with AstroLend:
- Wraps native XLM as a Soroban token (SAC)
- Creates custom USDC asset and wraps it
- Stores token contract IDs in `deployment.json`

```bash
npm run setup-tokens
```

### 🌊 Seed Pool (`seed_pool.ts`)

Seeds the lending pool with initial liquidity:
- Creates a "whale" account
- Mints 1,000,000 USDC to the whale
- Deposits 500,000 USDC into the pool via `supply()`
- Prints pool state summary

```bash
# Requires deployment.json from deploy-all
npm run seed-pool

# Or set contract ID manually
export POOL_CONTRACT_ID="CXXXXXX..."
npm run seed-pool
```

### 👤 Fund User (`fund_user.ts`)

Funds demo user accounts with XLM and USDC:
- XLM via Friendbot (10,000 XLM)
- USDC minted from issuer (10,000 USDC)

```bash
# Fund a specific user address
npm run fund-user -- GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Create a new random user and fund it
npm run fund-user -- --new

# Custom amounts
npm run fund-user -- --new --xlm 50000 --usdc 25000
```

### 📊 Update Oracle Price (`update_price.ts`)

Fetches prices from CoinGecko and updates the on-chain oracle:

```bash
# Normal mode - real price from CoinGecko
npm run update-price

# Chaos mode - simulate 50% price crash
npm run update-price:crash

# Mock mode - use hardcoded price ($0.30)
npm run update-price:mock

# Chaos + mock combined
npm run update-price:crash-mock
```

## 💥 Crash Demo Flow

Demonstrate liquidation risk by simulating a price crash:

### Prerequisites
1. Have the frontend running: `cd frontend && npm run dev`
2. Connect Freighter wallet on **Testnet**
3. Have a position with collateral (XLM) and debt (USDC)

### Demo Steps

```bash
cd scripts

# Set environment (use testnet oracle and deployer secret key)
export ORACLE_CONTRACT_ID="CCAOAPHLPMLM4GLITITTP3R2JADJXSSBVZJ6P7AALMYH5HZFPSWDWOW3"
export SECRET_KEY="SXXXXXXX..."  # Deployer/admin secret key
export NETWORK="testnet"

# 1. Set normal price ($0.35)
npm run update-price:mock

# 2. Watch the dashboard - Health Factor should be green

# 3. CRASH! Simulate 50% price drop
npm run update-price:crash-mock

# 4. Watch the dashboard:
#    - XLM price drops from $0.30 → $0.15
#    - Collateral value drops by 50%
#    - Health Factor turns RED
#    - Liquidation warning appears!

# 5. Use "Quick Repay" in the UI to recover position

# 6. Restore normal prices
npm run update-price:mock
```

### What Happens During Crash

| Before Crash | After Crash |
|--------------|-------------|
| XLM: $0.30 | XLM: $0.15 (-50%) |
| Collateral: $600 | Collateral: $300 |
| Debt: $200 | Debt: $200 (unchanged) |
| HF: 2.4 (green) | HF: 1.2 (red!) |

The UI will:
- Flash the Health Factor bar red
- Show "LIQUIDATION RISK" banner
- Enable "Quick Repay" button
- Update every 10 seconds automatically

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | Deployer/admin wallet secret key |
| `NETWORK` | No | `testnet` (default) or `futurenet` |
| `POOL_CONTRACT_ID` | No* | Lending pool contract ID |
| `ORACLE_CONTRACT_ID` | No* | Price oracle contract ID |

*Required if not using `deployment.json`

### Quick Setup for Testnet

```bash
# Use deployed testnet contracts
export ORACLE_CONTRACT_ID="CCAOAPHLPMLM4GLITITTP3R2JADJXSSBVZJ6P7AALMYH5HZFPSWDWOW3"
export POOL_CONTRACT_ID="CASYJNF6UM5JN3UUCRQN6AHZF7CAXJ64EVWCCT3LVXOA34UEFTBYUH4G"
export NETWORK="testnet"

# Get deployer secret key from stellar CLI
export SECRET_KEY=$(stellar keys show deployer-testnet)
```

## Deployment Flow

```
1. npm run deploy-all
   └── Deploys: Oracle → Interest Rate Model → Pool
   └── Sets up: XLM token, USDC token
   └── Initializes all contracts
   └── Sets initial prices
   └── Saves to deployment.json

2. npm run seed-pool
   └── Creates whale account
   └── Mints 1M USDC to whale
   └── Supplies 500K USDC to pool

3. npm run fund-user -- --new
   └── Creates new user account
   └── Funds with 10K XLM + 10K USDC
   └── Prints address and secret key
```

## Output Files

### `deployment.json`

Contains all deployed contract IDs and token addresses:

```json
{
  "network": "futurenet",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "contracts": {
    "pool": "CXXXXXX...",
    "oracle": "CXXXXXX...",
    "interestRateModel": "CXXXXXX..."
  },
  "tokens": {
    "xlm": "CXXXXXX...",
    "usdc": "CXXXXXX...",
    "usdcIssuer": "GXXXXXX..."
  },
  "accounts": {
    "deployer": "GXXXXXX...",
    "whale": "GXXXXXX..."
  }
}
```

## Token Details

### XLM (Native)
- Wrapped using Stellar Asset Contract (SAC)
- Contract ID is deterministic based on network

### USDC (Mock)
- Custom asset issued by deployer account
- Wrapped using SAC
- Unlimited minting for testing
- 7 decimal places (Stellar standard)

## Troubleshooting

### "WASM files not found"
Build the contracts first:
```bash
cd contracts && cargo build --target wasm32-unknown-unknown --release
```

### "Account not funded"
Fund your account via Friendbot:
```bash
curl "https://friendbot-futurenet.stellar.org/?addr=$(soroban keys address deployer)"
```

### "USDC minting failed"
User needs USDC trustline. Add it with:
```bash
stellar trustline add --asset USDC:<ISSUER_ADDRESS>
```

### "Transaction failed"
- Check SECRET_KEY is correct
- Ensure account has enough XLM for fees
- Verify contract IDs in deployment.json

## Network Configuration

| Network | RPC URL | Friendbot |
|---------|---------|-----------|
| Futurenet | https://rpc-futurenet.stellar.org | https://friendbot-futurenet.stellar.org |
| Testnet | https://soroban-testnet.stellar.org | https://friendbot.stellar.org |
