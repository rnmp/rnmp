import { promises as fs } from 'fs';
import path from 'path';

export const prerender = false;

export async function POST({ request }) {
  try {
    const { title, content, date } = await request.json();
    
    if (!title || !content || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Extract year from date
    const year = date.substring(0, 4);
    
    // Convert HTML content to Markdown
    const markdown = htmlToMarkdown(content);
    
    // Create frontmatter
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
---`;
    
    // Combine frontmatter and content
    const fileContent = `${frontmatter}\n\n${markdown}`;
    
    // Create year directory if it doesn't exist
    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog', year);
    await fs.mkdir(blogDir, { recursive: true });
    
    // Write file
    const filePath = path.join(blogDir, `${slug}.md`);
    await fs.writeFile(filePath, fileContent);
    
    return new Response(JSON.stringify({ 
      success: true, 
      slug: `${year}/${slug}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Save post error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function htmlToMarkdown(html) {
  let markdown = html;
  
  // Convert paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
  
  // Convert headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
  
  // Convert bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
  
  // Convert italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
  
  // Convert links
  markdown = markdown.replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // Convert images
  markdown = markdown.replace(/<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)');
  markdown = markdown.replace(/<img src="([^"]+)"[^>]*>/g, '![]($1)');
  
  // Convert code blocks
  markdown = markdown.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n\n');
  
  // Convert inline code
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  
  // Convert blockquotes
  markdown = markdown.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (match, content) => {
    return content.trim().split('\n').map(line => '> ' + line).join('\n') + '\n\n';
  });
  
  // Convert line breaks
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');
  
  // Convert lists
  markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, content) => {
    return content.replace(/<li>(.*?)<\/li>/g, '- $1\n').trim() + '\n\n';
  });
  
  markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, content) => {
    let index = 1;
    return content.replace(/<li>(.*?)<\/li>/g, () => {
      return `${index++}. $1\n`;
    }).trim() + '\n\n';
  });
  
  // Remove any remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();
  
  return markdown;
}