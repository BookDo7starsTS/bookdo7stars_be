import dotenv from 'dotenv';
import sequelize from '../src/config/db.js';
import { AladinBooksJob } from '../src/job/SaveAladinBooks.js';

dotenv.config();

const job = new AladinBooksJob({ schedule: false });

try {
  await job.runAll();
  console.log('Aladin import completed successfully.');
} catch (error) {
  console.error('Aladin import failed:', error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
