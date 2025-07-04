# Installation Guide

## Prerequisites
- Node.js >=14  
- npm or Yarn  
- PostgreSQL (or SQLite, see config)

## Steps

1. Clone repo  
   `git clone https://github.com/REChain-Network-Solutions/PerpStats.git`
2. Configure env  
   `cp .env.example .env` and set:
   ```
   NODE_URL=…
   DATABASE_URL=…
   ```
3. Install dependencies  
   `npm install`
4. Run migrations (if needed)  
   `npm run migrate`
5. Start in dev mode  
   `npm run dev`
6. Build & start  
   `npm run build && npm start`
