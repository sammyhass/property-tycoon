const { exec } = require('child_process');
const dotenv = require('dotenv');
const { assert } = require('console');
/*
 * Generate types from supabase schema, and write to src/scripts/db-types.ts
 */
dotenv.config();

exec(
  `npx openapi-typescript "${process.env.SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_ANON_KEY}" --output src/types/db-types.ts`,
  () => {},
  (error, stdout, stderr) => {
    assert(!error, `exec error: ${error}`);
  }
);
