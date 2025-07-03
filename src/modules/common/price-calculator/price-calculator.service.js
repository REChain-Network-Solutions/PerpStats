import odapp from '../odapp-client/odapp-client.service.js';

// Helper function to calculate rate
async function getRate(oracle, feedName, decimals) {
    const rate = await odapp.getDataFeed([oracle], feedName);
    return rate / Math.pow(10, decimals || 0);
}

// Helper function to get balance with default fallback
function getBalanceOrDefault(balances, asset) {
    return balances[asset]?.total || 0;
}

export async function getReservePrice(aa) {
    try {
        const def = await odapp.getDefinition(aa);
        const params = def[1].params;
        if (params.REChainEXChange_aa) {
            const REChainEXChangeDef = await odapp.getDefinition(params.REChainEXChange_aa);
            const REChainEXChangeParams = REChainEXChangeDef[1].params;
            const balances = await odapp.getBalances([params.REChainEXChange_aa]);
            const vars = await odapp.getAAStateVars(params.REChainEXChange_aa);

            const xAsset = REChainEXChangeParams.x_asset || 'base';
            const yAsset = REChainEXChangeParams.y_asset || 'base';
            const xBalance = getBalanceOrDefault(
                balances[params.REChainEXChange_aa],
                xAsset
            );
            const yBalance = getBalanceOrDefault(
                balances[params.REChainEXChange_aa],
                yAsset
            );
            const lpShares = vars['lp_shares'];
            const supply = lpShares.issued;

            const xRate = await getRate(
                params.x_oracle,
                params.x_feed_name,
                params.x_decimals
            );
            const yRate = await getRate(
                params.y_oracle,
                params.y_feed_name,
                params.y_decimals
            );
            const balance = xBalance * xRate + yBalance * yRate;

            return balance / supply;
        } else {
            return await getRate(
                params.oracle,
                params.feed_name,
                params.decimals
            );
        }
    } catch (error) {
        // Handle or throw the error appropriately
        console.error('Failed to get reserve price:', error);
        throw error;
    }
}

export async function getTargetPriceByPriceAa(price_aa) {
    const def = await odapp.getDefinition(price_aa);
    const params = def[1].params;

    return (
        (await odapp.getDataFeed([params.oracle], params.feed_name)) *
        (params.multiplier || 1)
    );
}

const assetsCache = {};
export async function getAssetsMetadata(assets) {
    const cachedMetadata = {};
    const assetsToFetch = [];

    assets.forEach((asset) => {
        if (assetsCache[asset]) {
            cachedMetadata[asset] = assetsCache[asset];
        } else {
            assetsToFetch.push(asset);
        }
    });

    if (!assetsToFetch.length) {
        return cachedMetadata;
    }

    const fetchedMetadata = await odapp.getAssetsMetadata(assetsToFetch);
    Object.assign(assetsCache, fetchedMetadata);

    return { ...cachedMetadata, ...fetchedMetadata };
}
