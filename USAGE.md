# Usage

## CLI Commands

- `npm run stats` – compute all metrics
- `npm run export` – export data

### Options
```
--from <timestamp>   filter start time  
--to <timestamp>     filter end time  
--format [json|csv]  output format  
```

### Sample

```bash
npm run export -- --from 2025-01-01T00:00:00Z                 --to 2025-06-30T23:59:59Z                 --format csv > trades.csv
```

For API usage, see [API_REFERENCE.md](API_REFERENCE.md).
