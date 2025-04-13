// scripts/scheduler.ts
import { CronJob } from 'cron';
import checkAndProcessInterests from './dataCollection/checkInterestsForArticles';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting article check scheduler...');

// Create a cron job that runs every minute
const job = new CronJob(
  '* * * * *', // Cron expression for every minute
  async function() {
    console.log(`Running scheduled check at ${new Date().toISOString()}`);
    try {
      await checkAndProcessInterests();
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  },
  null, // onComplete
  true, // start immediately
  'America/New_York' // timezone - adjust as needed
);

// Log when the job is running
console.log('Scheduler is running. Press Ctrl+C to exit.');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping scheduler...');
  job.stop();
  process.exit(0);
});