import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Remove description line from frontmatter
  const updatedContent = content.replace(/^description: ".*"\n/m, '');
  
  await fs.writeFile(filePath, updatedContent);
}

async function removeDescriptions() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  
  // Process 2024 posts
  const dir2024 = path.join(blogDir, '2024');
  const files2024 = await fs.readdir(dir2024);
  
  for (const file of files2024) {
    if (file.endsWith('.md')) {
      console.log(`Processing: 2024/${file}`);
      await processFile(path.join(dir2024, file));
    }
  }
  
  // Process 2025 posts
  const dir2025 = path.join(blogDir, '2025');
  const files2025 = await fs.readdir(dir2025);
  
  for (const file of files2025) {
    if (file.endsWith('.md')) {
      console.log(`Processing: 2025/${file}`);
      await processFile(path.join(dir2025, file));
    }
  }
  
  console.log('\nDone! Removed descriptions from all blog posts.');
}

removeDescriptions().catch(console.error);