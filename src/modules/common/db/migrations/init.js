import db from '../index.js';

const pool = db.getDbInstance();

try {
    console.log('migrating...');

    await pool.query(`CREATE TABLE IF NOT EXISTS perp_stats (
        id serial primary key, 
        aa varchar(32) not null, 
        price float not null,
        asset varchar(44) not null, 
        created_at timestamp with time zone DEFAULT now()
    )
`);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS perp_stats_asset_idx 
        ON perp_stats (asset, created_at DESC);
    `);

    console.log('migrating done...');
} catch (error) {
    console.error('Error on init migration: ', error);
}
