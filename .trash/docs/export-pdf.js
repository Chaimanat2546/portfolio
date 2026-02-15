#!/usr/bin/env node
/**
 * Script to export Docusaurus documentation to PDF
 * Usage: node export-pdf.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'static', 'pdf');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'user-manual.pdf');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📄 Exporting User Manual to PDF...');
console.log('=====================================');

try {
  // Check if docusaurus-to-pdf is available
  console.log('Step 1: Building Docusaurus site...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\nStep 2: Generating PDF...');
  
  // Use docusaurus-to-pdf if available
  try {
    execSync(`npx docusaurus-to-pdf -o "${OUTPUT_FILE}"`, { stdio: 'inherit' });
    console.log('\n✅ PDF generated successfully!');
    console.log(`📁 Location: ${OUTPUT_FILE}`);
  } catch (pdfError) {
    console.log('\n⚠️  docusaurus-to-pdf failed, trying alternative method...');
    
    // Alternative: Use Playwright
    console.log('\n📌 Alternative PDF generation:');
    console.log('1. Start the server: npm run serve');
    console.log('2. Use browser Print to PDF feature');
    console.log('   Or use: npx playwright screenshot --full-page http://localhost:3000 user-manual.pdf');
  }
  
} catch (error) {
  console.error('\n❌ Error generating PDF:', error.message);
  process.exit(1);
}

console.log('\n=====================================');
console.log('Done! 🎉');
