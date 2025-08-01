import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Update date format from ISO to yyyy-mm-dd
  const updatedContent = content.replace(
    /^date: (\d{4}-\d{2}-\d{2})T.*/m,
    'date: $1'
  );
  
  await fs.writeFile(filePath, updatedContent);
}

async function simplifyDates() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  
  // Process all years
  const years = await fs.readdir(blogDir);
  
  for (const year of years) {
    if (year.match(/^\d{4}$/)) {
      const yearDir = path.join(blogDir, year);
      const files = await fs.readdir(yearDir);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          console.log(`Processing: ${year}/${file}`);
          await processFile(path.join(yearDir, file));
        }
      }
    }
  }
  
  console.log('\nDone! Simplified all blog post dates to yyyy-mm-dd format.');
}

simplifyDates().catch(console.error);