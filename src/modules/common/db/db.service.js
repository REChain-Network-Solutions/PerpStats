import { appConfig } from '../config/main.configuration.js';
import pg from 'pg';

const { Pool } = pg;

export class Database {
    pool;

    constructor() {
        this.pool = new Pool(appConfig.db.pool.options);
    }

    getDbInstance() {
        return this.pool;
    }
}
