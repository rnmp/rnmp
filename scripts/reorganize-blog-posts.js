import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function reorganizeBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  const files = await fs.readdir(blogDir);
  
  // Process each markdown file
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(blogDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*"(.+)"/);
    const dateMatch = frontmatter.match(/date:\s*(\d{4})-(\d{2})-(\d{2})/);
    
    if (!titleMatch || !dateMatch) continue;
    
    const title = titleMatch[1];
    const year = dateMatch[1];
    const slug = slugify(title);
    
    console.log(`Processing: ${title}`);
    console.log(`  Year: ${year}`);
    console.log(`  Slug: ${slug}`);
    
    // Create year directory if it doesn't exist
    const yearDir = path.join(blogDir, year);
    await fs.mkdir(yearDir, { recursive: true });
    
    // Move file to year directory with new name
    const newPath = path.join(yearDir, `${slug}.md`);
    await fs.rename(filePath, newPath);
    console.log(`  Moved to: ${year}/${slug}.md`);
  }
  
  console.log('\nDone! Blog posts have been reorganized.');
}

reorganizeBlogPosts().catch(console.error);