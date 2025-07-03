import 'dotenv/config';

const network = process.env.NETWORK || 'mainnet';

const envBaseAAs = process.env.BASE_AAS;
if (!envBaseAAs) {
    throw new Error('BASE_AAS env variable is not set');
}

const baseAAs = envBaseAAs
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v);

export const appConfig = {
    db: {
        pool: {
            options: {
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
            },
        },
    },
    client: {
        url:
            network === 'mainnet'
                ? 'https://odapp.aa-dev.net'
                : 'https://odapp-t.aa-dev.net',
    },
    oREChain: {
        baseAAs,
    },
};
