import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.test from the backend root directory (be/)
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') });
