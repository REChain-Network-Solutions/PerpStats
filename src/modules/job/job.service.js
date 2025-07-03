import { CronJob } from 'cron';
import { receiveAndSavePerpetualStats } from '../perpetual-stats/index.js';
import { getLastPerpStatDate } from '../perpetual-stats/perpetual-stats.service.js';

const checkJobInitiationOnStart = async () => {
    const lastStatLogRowDate = await getLastPerpStatDate();

    const lastStatLogDate = new Date(lastStatLogRowDate);
    const now = new Date();

    const minutesUntilNextHour = 60 - now.getMinutes();

    const hoursFromLastJob = (now - lastStatLogDate) / (1000 * 60 * 60);

    return minutesUntilNextHour > 10 && hoursFromLastJob > 1;
};

export const checkAndInitiateJob = async () => {
    try {
        const job = new CronJob(
            '0 0 * * * *',
            receiveAndSavePerpetualStats,
            null,
            true
        );

        const initiateJobOnStart = await checkJobInitiationOnStart();

        if (initiateJobOnStart) {
            console.log('Starting...');
            await receiveAndSavePerpetualStats();
        }
    } catch (error) {
        console.error('Error on job initiation: ', error);
    }
};
