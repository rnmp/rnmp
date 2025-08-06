import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const SITE_URL = 'https://rolando.is';

// Copy of the remarkVideos plugin from astro.config.mjs
function remarkVideos() {
  return (tree) => {
    // Traverse the tree recursively
    function visit(node, index, parent) {
      // Handle video file links
      if (node.type === 'link' && node.url) {
        if (node.url.endsWith('.mp4') || node.url.endsWith('.mov')) {
          // Make URL absolute if it starts with /
          const videoUrl = node.url.startsWith('/') ? `${SITE_URL}${node.url}` : node.url;
          node.type = 'html';
          node.value = `<video src="${videoUrl}" autoplay muted loop playsinline controls></video>`;
        }
      }
      
      // Handle YouTube links in paragraphs (only if link is alone)
      if (node.type === 'paragraph' && 
          node.children && 
          node.children.length === 1 && 
          node.children[0].type === 'link') {
        const link = node.children[0];
        const url = link.url;
        
        // Check if it's a YouTube URL
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url?.match(youtubeRegex);
        
        if (match) {
          const videoId = match[1];
          // Convert the paragraph to an HTML node with YouTube embed
          node.type = 'html';
          node.value = `<div class="video-embed">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>`;
        }
      }

      // Visit children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child, idx) => visit(child, idx, node));
      }
    }

    visit(tree, 0, null);
  };
}

// Rehype plugin to make all URLs absolute
function rehypeAbsoluteUrls() {
  return (tree) => {
    function visit(node) {
      // Handle img tags
      if (node.type === 'element' && node.tagName === 'img') {
        if (node.properties?.src && node.properties.src.startsWith('/')) {
          node.properties.src = `${SITE_URL}${node.properties.src}`;
        }
      }
      
      // Handle a tags
      if (node.type === 'element' && node.tagName === 'a') {
        if (node.properties?.href && node.properties.href.startsWith('/')) {
          node.properties.href = `${SITE_URL}${node.properties.href}`;
        }
      }
      
      // Handle video tags
      if (node.type === 'element' && node.tagName === 'video') {
        if (node.properties?.src && node.properties.src.startsWith('/')) {
          node.properties.src = `${SITE_URL}${node.properties.src}`;
        }
      }
      
      // Visit children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => visit(child));
      }
    }
    
    visit(tree);
  };
}

// Create markdown processor with the same plugins as the main site
const markdownProcessor = await createMarkdownProcessor({
  remarkPlugins: [remarkVideos],
  rehypePlugins: [rehypeAbsoluteUrls],
});

export async function GET(context) {
  const posts = await getCollection('blog');
  
  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB - dateA;
  });

  // Process posts to include HTML content
  const itemsWithContent = await Promise.all(
    sortedPosts.map(async (post) => {
      // Convert markdown to HTML using the processor with remarkVideos and absolute URLs
      const result = await markdownProcessor.render(post.body);
      
      return {
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: post.data.description || '',
        link: `/typing/${post.slug}/`,
        // Use the processed HTML content with absolute URLs
        content: result.code,
      };
    })
  );

  return rss({
    title: "Rolando's Blog",
    description: "Thoughts on programming, design, and creating digital experiences",
    site: SITE_URL,
    items: itemsWithContent,
    customData: `<language>en-us</language>`,
  });
}