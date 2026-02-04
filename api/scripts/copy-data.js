const fs = require('fs');
const path = require('path');

// Create dist/data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'dist', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Copy JSON files from src/data to dist/data
const srcDataDir = path.join(__dirname, '..', 'src', 'data');
if (fs.existsSync(srcDataDir)) {
  const files = fs.readdirSync(srcDataDir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const src = path.join(srcDataDir, file);
      const dest = path.join(dataDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file}`);
    }
  });
}
