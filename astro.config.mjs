// @ts-check
import { defineConfig } from 'astro/config';

// Remark plugin to convert video links and YouTube embeds
function remarkVideos() {
  return (tree) => {
    // Traverse the tree recursively
    function visit(node, index, parent) {
      // Handle video file links
      if (node.type === 'link' && node.url) {
        if (node.url.endsWith('.mp4') || node.url.endsWith('.mov')) {
          node.type = 'html';
          node.value = `<video src="${node.url}" autoplay muted loop playsinline controls></video>`;
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

// https://astro.build/config
export default defineConfig({
  integrations: [],
  output: 'static',
  markdown: {
    remarkPlugins: [remarkVideos]
  }
});
