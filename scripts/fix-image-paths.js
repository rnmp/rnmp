import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fixImagePaths() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  
  // Get all years
  const years = await fs.readdir(blogDir);
  
  for (const year of years) {
    if (!year.match(/^\d{4}$/)) continue;
    
    const yearDir = path.join(blogDir, year);
    const files = await fs.readdir(yearDir);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(yearDir, file);
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Fix image paths that include yyyy-mm subdirectories
      const originalContent = content;
      content = content.replace(/\/blog-images\/\d{4}-\d{2}\//g, '/blog-images/');
      
      if (content !== originalContent) {
        await fs.writeFile(filePath, content);
        console.log(`Fixed image paths in: ${year}/${file}`);
      }
    }
  }
  
  console.log('\nDone fixing image paths!');
}

fixImagePaths().catch(console.error);