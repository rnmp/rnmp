// @ts-check
import { defineConfig } from 'astro/config';

// Remark plugin to convert image tags with video extensions to video tags
function remarkVideos() {
  return (tree) => {
    // Traverse the tree recursively
    function visit(node) {
      if (node.type === 'image' && node.url) {
        if (node.url.endsWith('.mp4') || node.url.endsWith('.mov')) {
          // Convert image node to HTML node with video tag
          node.type = 'html';
          node.value = `<video src="${node.url}" autoplay muted loop playsinline controls></video>`;
        }
      }

      // Visit children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
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
