const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  { width: 1200, suffix: 'large' },
  { width: 800, suffix: 'medium' },
  { width: 400, suffix: 'small' }
];

async function optimizeImage(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);

  // Skip if already an optimized version
  if (name.endsWith('-small') || name.endsWith('-medium') || name.endsWith('-large')) {
    return;
  }

  for (const size of sizes) {
    const outputPath = path.join(dir, `${name}-${size.suffix}${ext}`);
    try {
      // Skip if optimized version exists
      await fs.access(outputPath);
      console.log(`Skipping existing file: ${outputPath}`);
    } catch {
      // File doesn't exist, create it
      await sharp(filePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
      console.log(`Created: ${outputPath}`);
    }
  }
}

async function processDirectory(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      await optimizeImage(fullPath);
    }
  }
}

// Add sharp to package.json
const packageJsonPath = 'package.json';
fs.readFile(packageJsonPath, 'utf8')
  .then(data => {
    const pkg = JSON.parse(data);
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies.sharp = "^0.32.6";
    return fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
  })
  .then(() => {
    console.log('Added sharp to package.json');
    console.log('Please run: npm install');
  })
  .catch(console.error);

// Start optimization when run directly
if (require.main === module) {
  const imagesDir = path.join(__dirname, 'assets', 'images');
  processDirectory(imagesDir)
    .then(() => console.log('Image optimization complete!'))
    .catch(console.error);
}