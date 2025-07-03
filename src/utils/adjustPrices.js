import {
    getTargetPriceByPriceAa,
    getReservePrice,
} from '../modules/common/price-calculator/price-calculator.service.js';

export const adjustPrices = async (asset, asset_info, state, varsAndParams) => {
    const getParameter = (name, defaultValue) => {
        if (varsAndParams[name] !== undefined) {
            return varsAndParams[name];
        }

        return defaultValue;
    };

    // vars
    const get_token_share_threshold = () =>
        getParameter('token_share_threshold', 0.1); // 10%
    const get_reserve_price_aa = () => getParameter('reserve_price_aa');
    const get_adjustment_period = () =>
        getParameter('adjustment_period', 3 * 24 * 3600); // 3 days
    const get_min_s0_share = () => getParameter('min_s0_share', 0.01); // 1%

    // code
    const timestamp = Math.floor(Date.now() / 1000);
    if (state.asset0 === asset) return;

    const elapsed = timestamp - (asset_info.last_ts || 0);
    let target_price, price_aa, new_reserve;
    asset_info.last_ts = timestamp;

    if (asset_info.presale && asset_info.preipo) {
        target_price = asset_info.last_auction_price;
    } else {
        price_aa = asset_info.price_aa;
        if (!price_aa) return;
        target_price =
            (await getTargetPriceByPriceAa(price_aa)) /
            (await getReservePrice(get_reserve_price_aa()));
        if (typeof target_price !== 'number' || target_price < 0) return;
    }

    if (asset_info.presale) {
        if (
            asset_info.presale_amount &&
            (timestamp >= asset_info.presale_finish_ts ||
                asset_info.presale_amount >=
                    get_token_share_threshold() * state.reserve ||
                (asset_info.preipo &&
                    asset_info.presale_amount / target_price >=
                        asset_info.max_tokens))
        ) {
            delete asset_info.presale;
            asset_info.initial_price = target_price;
            asset_info.supply = Math.floor(
                asset_info.presale_amount / target_price
            );
            asset_info.a =
                (Math.pow(target_price / state.coef, 2) * state.reserve) /
                asset_info.presale_amount;
            new_reserve = state.reserve + asset_info.presale_amount;
            state.coef = state.coef * Math.sqrt(new_reserve / state.reserve);
            state.reserve = new_reserve;
        }
        return;
    }

    let r = state.reserve;
    let c = state.coef;
    let s = asset_info.supply;
    let a = asset_info.a;
    let p = (c * c * a * s) / r;
    let s0 = state.s0;

    if (!s) return;

    let full_delta_p = target_price - p;
    let adjustment_period = get_adjustment_period();
    let delta_p =
        elapsed >= adjustment_period
            ? full_delta_p
            : (elapsed / adjustment_period) * full_delta_p;

    //	delta_a = a * delta_p/p; // >= -a
    //	asset_info.a = asset_info.a + delta_a; // stays positive
    //	state.coef = c / sqrt(1 + delta_a * pow2(s * c / r));

    let new_c =
        c * Math.sqrt(1 - (s * r * delta_p) / (r * r - a * Math.pow(c * s, 2)));

    if (!((new_c - c) * delta_p <= 0)) {
        return { error: 'c should change opposite to p' };
    }

    let new_a = ((p + delta_p) * r) / new_c / new_c / s;

    if (!((new_a - a) * delta_p >= 0)) {
        return { error: 'a should change as p' };
    }

    asset_info.a = new_a;
    state.coef = new_c;

    // apply drift that slowly depreciates p and moves the wealth to s0 holders
    if (asset_info.drift_rate) {
        const relative_price_drift =
            (elapsed / 360 / 24 / 3600) * asset_info.drift_rate;
        if (relative_price_drift < 1) {
            asset_info.a = asset_info.a * (1 - relative_price_drift);
            state.a0 =
                state.a0 +
                Math.pow(s / s0, 2) * asset_info.a * relative_price_drift;
        }
    }

    // keeping s0 share above some minimum
    let a0 = state.a0;
    let c1 = state.coef;
    let s0_share = a0 * Math.pow((s0 * c1) / r, 2);
    let new_a0, new_c2;
    let min_s0_share = get_min_s0_share();
    if (s0_share < min_s0_share) {
        new_a0 = (Math.pow(r / c1 / s0, 2) - a0) / (1 / min_s0_share - 1);
        new_c2 = (r / s0) * Math.sqrt(min_s0_share / new_a0);

        if (!(new_a0 > a0)) return { error: 'a0 should grow' };
        if (!(new_c2 < c)) return { error: 'c should fall' };

        state.a0 = new_a0;
        state.coef = new_c;
    }
};
