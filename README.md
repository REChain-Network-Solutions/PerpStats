# REChain ® PerpStats

**REChain ® PerpStats** is a decentralized analytics engine for tracking REChain’s perpetual trading markets.

## 🔧 Setup

```bash
git clone https://github.com/REChain-Network-Solutions/PerpStats.git
cd PerpStats
npm install
npm run dev
```

## 📈 What It Tracks

- Trading volume
- Open interest
- Liquidations
- Funding rate history
- Trader leaderboards
- Smart contract events (on-chain)

## 🌐 REST API

All core metrics are exposed via `/api/perp/*` endpoints.

## 📊 UI

React/Vue frontend available under `/dashboard`.

## 🛡 Security

- Open source
- Non-custodial
- Privacy-preserving (future zk-stats module)

## 🧾 License

MIT License — REChain Network Solutions

## Setup

Required:
- Postgresql
- node.js >= v20

### Steps
1. Replace .env.example to .env
2. Change the variables to match your postgresql settings
3. for mainnet replace `NETWORK='testnet'` to `NETWORK='mainnet'`


## start
```shell
npm start
```
