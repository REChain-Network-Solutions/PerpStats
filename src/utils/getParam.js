export const perpDefaults = {
    swap_fee: 0.003,
    arb_profit_tax: 0.9,
    adjustment_period: 3 * 24 * 3600, // 3 days
    presale_period: 14 * 24 * 3600, // 14 days
    auction_price_halving_period: 3 * 24 * 3600, // 3 days
    token_share_threshold: 0.1, // 10%
    min_s0_share: 0.01, // 1%
    stakers_fee_share: 0.5, // 50%
};

export function getParam(name, meta) {
    if (meta[name]) {
        return meta[name];
    }

    return perpDefaults[name] || 'none';
}

export default getParam;
