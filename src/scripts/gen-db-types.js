const { exec } = require('child_process');
const dotenv = require('dotenv');
const { assert } = require('console');

dotenv.config();

exec(
  `npx openapi-typescript "${process.env.SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_ANON_KEY}" --output src/types/db-types.ts`,
  () => {},
  (error, stdout, stderr) => {
    if (error) {
      console.warn(`exec error: ${error}`);
    }
  }
);
