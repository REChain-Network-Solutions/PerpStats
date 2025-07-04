# PerpStats

**PerpStats** is a decentralized analytics engine for tracking REChain Network’s perpetual trading markets. It ingests on-chain events, computes key metrics, and exposes them via API.

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features
- Real-time volume, open interest, funding rate calculations  
- Historical export (JSON, CSV)  
- REST & WebSocket API for live feeds

## Quick Start

```bash
git clone https://github.com/REChain-Network-Solutions/PerpStats.git
cd PerpStats
cp .env.example .env
# set NODE_URL and DATABASE_URL
npm install
npm run dev
```

## Usage
See [USAGE.md](USAGE.md) for CLI and config details.

## Architecture
High-level design overview: ingestion → processing → storage → API. More in [ARCHITECTURE.md](ARCHITECTURE.md).

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). All contributions welcome!

## License
Licensed under MIT. See [LICENSE](LICENSE).
