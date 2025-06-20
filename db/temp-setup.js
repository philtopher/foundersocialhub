import { Pool } from 'pg';
import fs from 'fs';

// Create a temporary in-memory solution for development
const setupTempDatabase = async () => {
  console.log('Setting up temporary database solution...');
  
  // Try to connect to any available PostgreSQL instance
  const connectionConfigs = [
    process.env.DATABASE_URL,
    `postgresql://postgres:postgres@localhost:5432/postgres`,
    `postgresql://user:password@localhost:5432/foundersocials`
  ].filter(Boolean);

  for (const config of connectionConfigs) {
    try {
      const pool = new Pool({ 
        connectionString: config,
        ssl: config.includes('neon') ? { rejectUnauthorized: false } : false
      });
      
      const result = await pool.query('SELECT NOW()');
      console.log('Database connected successfully:', config.substring(0, 30) + '...');
      
      // Read and execute setup SQL
      const setupSQL = fs.readFileSync('./db/setup-local.sql', 'utf8');
      await pool.query(setupSQL);
      console.log('Database schema setup complete');
      
      await pool.end();
      return true;
    } catch (error) {
      console.log(`Failed to connect to: ${config.substring(0, 30)}... - ${error.message}`);
      continue;
    }
  }
  
  console.log('No database connection available, using fallback mode');
  return false;
};

setupTempDatabase().catch(console.error);