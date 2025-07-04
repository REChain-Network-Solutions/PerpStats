# API Reference

## GET /api/metrics/latest
**Description**: fetch latest metrics  
**Response**:
```json
{
  "timestamp": "...",
  "volume24h": 12345.67,
  "openInterest": 89012.34,
  "fundingRate": 0.0005
}
```

## GET /api/metrics/history
**Query**:
- `from` (ISO timestamp)
- `to` (ISO timestamp)

**Response**:
```json
[...]
```

## WebSocket: `wss://...`
Subscribe to topics:
```
subscribe: "metrics"
```
