import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchGitHubContent(path) {
  const url = `https://api.github.com/repos/rnmp/rnmp.github.io/contents/${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

async function fetchFileContent(downloadUrl) {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${downloadUrl}: ${response.statusText}`);
  }
  return response.text();
}

async function downloadAsset(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Failed to download asset ${url}:`, error);
    return false;
  }
}

function parseJekyllPost(content, filename) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  let frontmatter, body;
  
  if (!frontmatterMatch) {
    // Try to extract date and title from filename for posts without frontmatter
    const filenameMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|markdown)$/);
    if (!filenameMatch) {
      console.warn(`Could not parse filename: ${filename}`);
      return null;
    }
    
    const date = filenameMatch[1];
    const titleSlug = filenameMatch[2];
    const title = titleSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      title,
      date,
      layout: 'post',
      content: content.trim()
    };
  }

  frontmatter = frontmatterMatch[1];
  body = frontmatterMatch[2];

  // Parse frontmatter
  const title = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
  const date = frontmatter.match(/date:\s*["']?(\d{4}-\d{2}-\d{2}).*?["']?\s*$/m)?.[1] || '';
  const layout = frontmatter.match(/layout:\s*(.+)$/m)?.[1] || '';
  
  // Extract date from filename if not in frontmatter
  const dateFromFilename = filename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
  const finalDate = date || dateFromFilename;

  if (!title || !finalDate) {
    console.warn(`Missing title or date in ${filename}`);
    return null;
  }

  return {
    title,
    date: finalDate,
    layout,
    content: body.trim()
  };
}

function convertJekyllToMarkdown(content) {
  let markdown = content;

  // Convert Jekyll image syntax: ![alt]({{ site.baseurl }}/assets/...)
  markdown = markdown.replace(/!\[([^\]]*)\]\(\{\{\s*site\.baseurl\s*\}\}\/assets\/(.*?)\)/g, '![$1](/blog-images/$2)');
  
  // Convert Jekyll relative image paths
  markdown = markdown.replace(/!\[([^\]]*)\]\(\/assets\/(.*?)\)/g, '![$1](/blog-images/$2)');
  
  // Convert Jekyll highlight blocks to code blocks
  markdown = markdown.replace(/{% highlight (\w+) %}\n([\s\S]*?)\n{% endhighlight %}/g, '```$1\n$2\n```');
  
  // Remove Jekyll includes
  markdown = markdown.replace(/{% include .* %}/g, '');
  
  // Convert any remaining Jekyll variables
  markdown = markdown.replace(/\{\{[^}]+\}\}/g, '');

  return markdown;
}

function extractAssets(content) {
  const assets = [];
  
  // Match image references
  const imageRegex = /\/assets\/(.*?)(?:\)|\s|$)/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    assets.push(`assets/${match[1]}`);
  }
  
  return [...new Set(assets)]; // Remove duplicates
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importOldBlog() {
  console.log('Fetching posts from GitHub...');
  
  // Update first todo
  const todos = [
    {id: "1", content: "Fetch posts from GitHub repo rnmp/rnmp.github.io", status: "in_progress", priority: "high"},
    {id: "2", content: "Process Jekyll-style posts and convert frontmatter", status: "pending", priority: "high"},
    {id: "3", content: "Download and organize assets referenced in posts", status: "pending", priority: "medium"},
    {id: "4", content: "Generate proper slugs and organize by year", status: "pending", priority: "medium"},
    {id: "5", content: "Clean up and format imported posts", status: "pending", priority: "medium"}
  ];
  
  try {
    const posts = await fetchGitHubContent('_posts');
    console.log(`Found ${posts.length} posts`);
    
    const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
    const assetsDir = path.join(__dirname, '..', 'public', 'blog-images');
    
    // Process each post
    for (const postFile of posts) {
      if (!postFile.name.endsWith('.md') && !postFile.name.endsWith('.markdown')) continue;
      
      console.log(`\nProcessing: ${postFile.name}`);
      
      // Fetch post content
      const content = await fetchFileContent(postFile.download_url);
      const parsed = parseJekyllPost(content, postFile.name);
      
      if (!parsed) {
        console.warn(`Skipping ${postFile.name} - could not parse`);
        continue;
      }
      
      // Convert content
      let markdownContent = convertJekyllToMarkdown(parsed.content);
      
      // Extract and download assets
      const assets = extractAssets(parsed.content);
      for (const asset of assets) {
        const assetUrl = `https://raw.githubusercontent.com/rnmp/rnmp.github.io/master/${asset}`;
        const assetFilename = path.basename(asset);
        const localPath = path.join(assetsDir, assetFilename);
        
        console.log(`  Downloading asset: ${assetFilename}`);
        const success = await downloadAsset(assetUrl, localPath);
        
        if (success) {
          // Update references in content
          markdownContent = markdownContent.replace(
            new RegExp(`/assets/${assetFilename}`, 'g'),
            `/blog-images/${assetFilename}`
          );
        }
      }
      
      // Generate slug and organize by year
      const year = parsed.date.substring(0, 4);
      const slug = generateSlug(parsed.title);
      const yearDir = path.join(blogDir, year);
      
      // Create year directory
      await fs.mkdir(yearDir, { recursive: true });
      
      // Create frontmatter
      const frontmatter = `---
title: "${parsed.title.replace(/"/g, '\\"')}"
date: ${parsed.date}
---`;
      
      // Write file
      const fileContent = `${frontmatter}\n\n${markdownContent}`;
      const filePath = path.join(yearDir, `${slug}.md`);
      
      await fs.writeFile(filePath, fileContent);
      console.log(`  Created: ${year}/${slug}.md`);
    }
    
    console.log('\nDone importing old blog posts!');
    
  } catch (error) {
    console.error('Error importing blog:', error);
  }
}

importOldBlog().catch(console.error);