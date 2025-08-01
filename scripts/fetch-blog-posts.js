import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchRSSFeed() {
  const response = await fetch('https://world.hey.com/rolandomurillo/feed.atom');
  const text = await response.text();
  return text;
}

function parseAtomFeed(xmlText) {
  const posts = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entry = match[1];
    
    const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/.exec(entry);
    const publishedMatch = /<published>([\s\S]*?)<\/published>/.exec(entry);
    const contentMatch = /<content[^>]*>([\s\S]*?)<\/content>/.exec(entry);
    const idMatch = /<id>([\s\S]*?)<\/id>/.exec(entry);
    
    if (titleMatch && publishedMatch && contentMatch) {
      const content = contentMatch[1]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      const post = {
        title: titleMatch[1],
        date: publishedMatch[1],
        content: content,
        slug: idMatch ? idMatch[1].split('/').pop() : titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: []
      };
      
      // Extract image URLs
      const imgRegex = /<img[^>]+src="([^"]+)"/g;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        post.images.push(imgMatch[1]);
      }
      
      posts.push(post);
    }
  }
  
  return posts;
}

function htmlToMarkdown(html) {
  let markdown = html;
  
  // Remove div wrappers
  markdown = markdown.replace(/<div[^>]*>/g, '');
  markdown = markdown.replace(/<\/div>/g, '\n');
  
  // Convert headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n');
  
  // Convert strong and em
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*');
  
  // Convert links
  markdown = markdown.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // Convert images
  markdown = markdown.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g, '\n![$2]($1)\n');
  markdown = markdown.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, '\n![]($1)\n');
  
  // Convert paragraphs
  markdown = markdown.replace(/<p[^>]*>/g, '\n');
  markdown = markdown.replace(/<\/p>/g, '\n');
  
  // Convert line breaks
  markdown = markdown.replace(/<br[^>]*>/g, '\n');
  
  // Convert lists
  markdown = markdown.replace(/<ul[^>]*>/g, '\n');
  markdown = markdown.replace(/<\/ul>/g, '\n');
  markdown = markdown.replace(/<ol[^>]*>/g, '\n');
  markdown = markdown.replace(/<\/ol>/g, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');
  
  // Convert blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, (match, content) => {
    return content.trim().split('\n').map(line => '> ' + line).join('\n') + '\n';
  });
  
  // Convert code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  // Remove indentation from image lines
  markdown = markdown.replace(/^\s+!\[/gm, '![');
  
  markdown = markdown.trim();
  
  return markdown;
}

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, '..', 'public', 'blog-images', filename);
    await fs.writeFile(outputPath, Buffer.from(buffer));
    return `/blog-images/${filename}`;
  } catch (error) {
    console.error(`Failed to download image ${url}:`, error);
    return url;
  }
}

async function processPosts() {
  console.log('Fetching RSS feed...');
  const feedContent = await fetchRSSFeed();
  
  console.log('Parsing feed...');
  const posts = parseAtomFeed(feedContent);
  
  console.log(`Found ${posts.length} posts`);
  
  // Delete existing blog posts
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  const existingPosts = await fs.readdir(blogDir);
  for (const file of existingPosts) {
    if (file.endsWith('.md')) {
      await fs.unlink(path.join(blogDir, file));
      console.log(`Deleted: ${file}`);
    }
  }
  
  // Process each post
  for (const post of posts) {
    console.log(`Processing: ${post.title}`);
    
    // Convert content to markdown
    let markdownContent = htmlToMarkdown(post.content);
    
    // Download images and update URLs
    for (let i = 0; i < post.images.length; i++) {
      const imageUrl = post.images[i];
      const extension = imageUrl.split('.').pop().split('?')[0];
      const filename = `${post.slug}-${i + 1}.${extension}`;
      
      console.log(`  Downloading image: ${filename}`);
      const localPath = await downloadImage(imageUrl, filename);
      
      // Replace image URL in markdown
      markdownContent = markdownContent.replace(imageUrl, localPath);
    }
    
    // Create frontmatter
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: ${post.date}
description: "${markdownContent.substring(0, 150).replace(/\n/g, ' ').replace(/"/g, '\\"')}..."
---`;
    
    // Write markdown file
    const fileContent = `${frontmatter}\n\n${markdownContent}`;
    const filePath = path.join(blogDir, `${post.slug}.md`);
    
    await fs.writeFile(filePath, fileContent);
    console.log(`  Created: ${post.slug}.md`);
  }
  
  console.log('Done!');
}

processPosts().catch(console.error);