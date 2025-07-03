# 📈 REChain ® PerpStats — Wiki

**REChain ® PerpStats** is a decentralized analytics platform tailored for tracking **perpetual contracts**, **leverage trading**, and **on-chain DeFi derivatives** within the REChain Network.

It provides transparent, real-time insight into user behavior, liquidity flows, market metrics, and smart contract performance — all in a permissionless and trustless manner.

---

## 📌 Overview

**PerpStats** acts as the official stats layer for REChain’s perpetual markets. It helps traders, developers, DAOs, and auditors access deep insights into:

- Trading volume
- Open interest
- Funding rates
- Liquidation stats
- Position PnL (profit and loss)
- Protocol fees and revenue
- Oracles and price feeds behavior

---

## 🧱 Architecture

```
PerpStats/
├── core/                 # Aggregation and data fetchers
├── frontend/             # React/Vue frontend for dashboard
├── analytics/            # PnL and performance calculators
├── scripts/              # Cron jobs, data normalization
└── README.md
```

---

## 🛠 Features

| Category        | Metrics Tracked                                                                 |
|----------------|----------------------------------------------------------------------------------|
| 📊 Trading      | Volume, open interest, top traders, long vs short ratio                        |
| 💰 Liquidity    | Pool depth, slippage data, funding APY                                          |
| 🧠 Risk         | Liquidation % per epoch, leverage ratio stats, position size distribution       |
| 📉 PnL & Fees   | Realized/unrealized PnL, funding payments, protocol revenue                     |
| 🔒 Oracle       | Price feed behavior, deviation alerts                                           |
| 📤 Export       | Raw or aggregated data via REST or WebSocket API                                |

---

## 🧪 How to Run

### Prerequisites

- Node.js or Rust (for data backend)
- PostgreSQL / MongoDB / InfluxDB
- Redis (for caching)
- A REChain RPC node or access point

### Local Setup

```bash
git clone https://github.com/REChain-Network-Solutions/PerpStats.git
cd PerpStats
npm install
npm run dev
```

---

## 📡 Example API Endpoints

```http
GET /api/perp/volume
GET /api/perp/open-interest
GET /api/perp/funding-rates
GET /api/perp/liquidations
GET /api/perp/traders/top
```

---

## 📊 Dashboards

PerpStats includes a powerful UI for:

- Market-level overview
- Trader leaderboard
- Real-time position monitoring
- Historical funding rate chart
- Gas & fee cost monitoring

---

## 🔐 Security & Privacy

- No user-identifiable data
- Zero-knowledge integration options (future)
- All data is from public, verifiable sources (on-chain)

---

## 🌐 Integrations

- **REChain Perp DEX**
- **Oracle Module (Katya)**
- **REChain Governance DAO**
- **dChange DeFi Aggregator**

---

## 🧩 Related Projects

- [`Stats`](https://github.com/REChain-Network-Solutions/Stats.git)
- [`dChange`](https://github.com/REChain-Network-Solutions/dChange.git)
- [`Katya-`](https://github.com/sorydima/Katya-.git)
- [`REChain-/`](https://github.com/sorydima/REChain-/)

---

## 🔮 Roadmap

- [x] Core metrics API
- [ ] Historical funding rates chart
- [ ] Liquidation engine anomaly alerting
- [ ] Real-time PnL tracker with WebSocket
- [ ] zk-Stats module for privacy-preserving metrics

---

## 🤝 Contributions

Want to help improve REChain PerpStats? Submit issues or PRs via [GitHub](https://github.com/REChain-Network-Solutions/PerpStats/issues) or join us on [Telegram](https://t.me/REChainDAO).