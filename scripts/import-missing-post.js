import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importMissingPost() {
  const response = await fetch('https://raw.githubusercontent.com/rnmp/rnmp.github.io/master/_posts/2021-05-24-watching-short-films.md');
  const content = await response.text();
  
  const title = 'Watching Short Films';
  const date = '2021-05-24';
  const year = '2021';
  
  const frontmatter = `---
title: "${title}"
date: ${date}
---`;
  
  const fileContent = `${frontmatter}\n\n${content.trim()}`;
  const yearDir = path.join(__dirname, '..', 'src', 'content', 'blog', year);
  const filePath = path.join(yearDir, 'watching-short-films.md');
  
  await fs.mkdir(yearDir, { recursive: true });
  await fs.writeFile(filePath, fileContent);
  
  console.log('Created: 2021/watching-short-films.md');
}

importMissingPost().catch(console.error);