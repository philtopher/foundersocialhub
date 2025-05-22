#!/bin/bash

# Navigate to the app directory (adjust this path if needed)
cd /home/ec2-user/app

# Create a backup of the original file
cp vite.config.ts vite.config.ts.bak

# Add the fileURLToPath import to correctly handle ESM __dirname equivalent
sed -i '3s/import path from "path";/import path from "path";\nimport { fileURLToPath } from "url";\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));/' vite.config.ts

# Replace import.meta.dirname with __dirname
sed -i 's/import.meta.dirname/__dirname/g' vite.config.ts

echo "Vite config file updated successfully for Amazon Linux 23 compatibility."