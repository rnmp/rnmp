import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function cleanMarkdown(content) {
  let lines = content.split('\n');
  let inFrontmatter = false;
  let cleanedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle frontmatter
    if (line === '---') {
      inFrontmatter = !inFrontmatter;
      cleanedLines.push(line);
      continue;
    }
    
    if (inFrontmatter) {
      cleanedLines.push(line);
      continue;
    }
    
    // Remove trailing spaces
    line = line.trimEnd();
    
    // Fix multiple consecutive blank lines (keep max 2)
    if (line === '') {
      if (i > 0 && lines[i-1] === '' && i > 1 && lines[i-2] === '') {
        continue;
      }
    }
    
    // Clean up around images
    if (line.startsWith('![')) {
      // Ensure blank line before image if previous line has content
      if (i > 0 && cleanedLines[cleanedLines.length - 1].trim() !== '') {
        cleanedLines.push('');
      }
      cleanedLines.push(line);
      // Ensure blank line after image
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        cleanedLines.push('');
      }
      continue;
    }
    
    // Clean up headings
    if (line.match(/^#+\s/)) {
      // Ensure blank line before heading if previous line has content
      if (i > 0 && cleanedLines[cleanedLines.length - 1].trim() !== '') {
        cleanedLines.push('');
      }
      // Remove extra whitespace in headings
      line = line.replace(/^(#+)\s+/, '$1 ');
      // Remove bold from headings
      line = line.replace(/^(#+\s+)\*\*(.*?)\*\*$/, '$1$2');
      cleanedLines.push(line);
      continue;
    }
    
    // Fix links with weird formatting
    line = line.replace(/\[\s*\n\s*/g, '[');
    line = line.replace(/\s*\n\s*\]/g, ']');
    
    // Clean up blockquotes
    if (line.startsWith('>')) {
      line = line.replace(/^>\s+/, '> ');
    }
    
    // Fix list items
    if (line.match(/^\s*[-*]\s/)) {
      line = line.replace(/^\s*[-*]\s+/, '- ');
    }
    
    cleanedLines.push(line);
  }
  
  // Join lines and clean up
  let cleaned = cleanedLines.join('\n');
  
  // Fix broken links across lines
  cleaned = cleaned.replace(/\[\n([^\]]+)\n\]\(([^)]+)\)/g, '[$1]($2)');
  cleaned = cleaned.replace(/\[([^\]]+)\]\(\n([^)]+)\n\)/g, '[$1]($2)');
  
  // Remove weird spacing patterns
  cleaned = cleaned.replace(/\n\s+\n/g, '\n\n');
  
  // Ensure file ends with single newline
  cleaned = cleaned.trimEnd() + '\n';
  
  return cleaned;
}

async function processBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  const files = await fs.readdir(blogDir);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(blogDir, file);
    console.log(`Processing: ${file}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const cleaned = await cleanMarkdown(content);
    
    await fs.writeFile(filePath, cleaned);
    console.log(`  ✓ Cleaned`);
  }
  
  console.log('\nDone! All blog posts have been cleaned.');
}

processBlogPosts().catch(console.error);