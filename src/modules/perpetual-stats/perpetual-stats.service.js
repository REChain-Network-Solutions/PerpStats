import getParam from '../../utils/getParam.js';
import {
    getReservePrice,
    getAssetsMetadata,
} from '../common/price-calculator/price-calculator.service.js';
import { adjustPrices } from '../../utils/adjustPrices.js';
import {
    getNotDefaultAssetsFromMeta,
    isBrokenPresale,
} from '../../utils/perpUtils.js';
import db from '../common/db/index.js';

const pool = db.getDbInstance();

export const getLastPerpStatDate = async () => {
    const result = await pool.query(`
      SELECT created_at as date 
      FROM perp_stats
      ORDER BY created_at DESC
      LIMIT 1
  `);

    return result.rows.length ? result.rows[0].date : null;
};

export const getPerpetualStats = async (aa, fromDate, toDate) => {
    const result = await pool.query(
        `
      SELECT aa, asset, price, created_at as date 
      FROM perp_stats
      WHERE aa = $1
        AND created_at > $2
        AND created_at < $3
  `,
        [aa, fromDate, toDate]
    );

    return result.rows;
};

async function getAssetStatsByHour(asset, fromDate, toDate) {
    const result = await pool.query(
        `
      SELECT DISTINCT asset, aa, price, created_at as date 
      FROM perp_stats
      WHERE asset = $1
        AND created_at > $2
        AND created_at < $3
        ORDER BY created_at ASC
  `,
        [asset, fromDate, toDate]
    );

    return result.rows;
}

async function getAssetStatsByDay(asset, fromDate, toDate) {
    const result = await pool.query(
        `
    WITH cte AS (
        SELECT 
            asset,
            price,
            created_at AS date,
            ROW_NUMBER() OVER (PARTITION BY asset, created_at::date ORDER BY created_at DESC) AS rn
        FROM perp_stats
        WHERE asset = $1
            AND created_at >= $2
            AND created_at < $3
    )
    SELECT
        asset,
        price,
        date
    FROM cte
    WHERE rn = 1
    ORDER BY date ASC
  `,
        [asset, fromDate, toDate]
    );

    return result.rows;
}

export const getAssetStats = async (asset, fromDate, toDate, groupByDay) => {
    let result;
    if (groupByDay) {
        result = await getAssetStatsByDay(asset, fromDate, toDate);
        result = result.map((v) => {
            return {
                ...v,
                date: v.date.toISOString().split('T')[0],
            };
        });
    } else {
        result = await getAssetStatsByHour(asset, fromDate, toDate);
    }

    console.error(result.length, asset, fromDate, toDate);

    return result;
};

export const savePerpetualStatsToDb = async (perpetualStats) => {
    const query = 'INSERT INTO perp_stats(aa, price, asset) VALUES ';

    const values = perpetualStats.map((perpetual) => {
        const aa = perpetual.aa;

        const perpetualAssetsPriceValues = [];
        for (const assetPrice of perpetual.prices) {
            perpetualAssetsPriceValues.push(
                `('${aa}',${assetPrice.price},'${assetPrice.asset}')`
            );
        }

        return perpetualAssetsPriceValues;
    });

    console.log('Saving stats to Db:');
    await pool.query(query + values.join(','));
    console.log('Saved..');
};

async function getPriceByAssets(aa, assets, varsAndParams) {
    const { state: initialState } = varsAndParams;
    const priceByAsset = {};

    for (const asset of assets) {
        const state = structuredClone(initialState);
        const isAsset0 = state.asset0 === asset;
        const assetInfo = structuredClone(varsAndParams['asset_' + asset]);
        await adjustPrices(
            asset,
            assetInfo,
            state,
            structuredClone(varsAndParams)
        );
        if (!isAsset0 && !assetInfo) continue;

        const reserve = state.reserve;
        if (!reserve) {
            priceByAsset[asset] = 0;
            continue;
        }

        const coef = state.coef;
        const supply = isAsset0 ? state.s0 : assetInfo.supply;
        const a = isAsset0 ? state.a0 : assetInfo.a;
        priceByAsset[asset] = (coef * coef * a * supply) / reserve;
    }

    return priceByAsset;
}

export async function prepareMetaByAA(metaByAA) {
    const assets = getNotDefaultAssetsFromMeta(metaByAA);
    const presalePeriod = getParam('presale_period', metaByAA);

    const reservePriceAA = metaByAA.reserve_price_aa;
    const { asset0 } = metaByAA.state;

    const assetList = [asset0];

    const reservePrice = await getReservePrice(reservePriceAA);

    const _assets = {};

    for (let asset of assets) {
        const m = metaByAA[`asset_${asset}`];
        if (m.presale && isBrokenPresale(m, presalePeriod)) {
            continue;
        }

        _assets[asset] = {
            ...m,
        };
    }

    for (let asset in _assets) {
        const { supply } = _assets[asset];
        if (!supply) continue;

        assetList.push(asset);
    }

    const metaByAsset = await getAssetsMetadata(assetList);
    const r = await getPriceByAssets(metaByAA.aa, assetList, metaByAA);

    let asset0Price = 0;
    let ps = [];
    for (let asset in r) {
        if (!metaByAsset[asset]) continue;
        const price = r[asset];

        let priceInUSD = price * reservePrice; // raw price in usd
        priceInUSD *= 10 ** (metaByAsset[asset].decimals || 0); // price in usd with decimals

        if (asset === asset0) {
            asset0Price = priceInUSD;
        } else {
            ps.push({ price: priceInUSD, asset });
        }
    }

    return {
        aa: metaByAA.aa,
        prices: [{ price: asset0Price, asset: asset0 }, ...ps],
    };
}
