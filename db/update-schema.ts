import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { pool } from "./index";
import * as schema from "../shared/schema";

// Create Drizzle database instance
const db = drizzle(pool, { schema });

async function main() {
  try {
    console.log("Applying schema changes...");
    
    // Add subscription_plan enum if it doesn't exist
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE subscription_plan AS ENUM ('standard', 'founder');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Add the column if it doesn't exist
    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan subscription_plan DEFAULT 'standard';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);
    
    console.log("Schema updated successfully.");
  } catch (error) {
    console.error("Error updating schema:", error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main();
