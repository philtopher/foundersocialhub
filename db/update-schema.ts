import { pool } from "./index";

async function main() {
  try {
    console.log("Applying schema changes...");
    
    // Add subscription_plan enum type if it doesn't exist
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
        ALTER TABLE users ADD COLUMN subscription_plan subscription_plan DEFAULT 'standard';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);
    
    console.log("Schema updated successfully.");
  } catch (error) {
    console.error("Error updating schema:", error);
  }
}

main();
