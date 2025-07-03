import dayjs from 'dayjs';

export function getNotDefaultAssetsFromMeta(metaByAA) {
    const keys = Object.keys(metaByAA);
    const assets = [];

    keys.forEach((key) => {
        if (key.startsWith('asset_')) {
            const asset = key.substring(6);
            assets.push(asset);
        }
    });

    return assets;
}

export function isBrokenPresale(meta, presalePeriod) {
    const presaleAssetIssue = meta.creation_ts;
    const finishDate = dayjs((presaleAssetIssue + presalePeriod) * 1000);
    return !meta.presale_amount && finishDate.diff(dayjs()) < 0;
}
