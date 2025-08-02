import { promises as fs } from 'fs';
import path from 'path';

export const prerender = false;

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const filename = formData.get('filename');
    
    if (!image || !filename) {
      return new Response(JSON.stringify({ error: 'Missing image or filename' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the image data
    const buffer = Buffer.from(await image.arrayBuffer());
    
    // Ensure blog-images directory exists
    const imagesDir = path.join(process.cwd(), 'public', 'blog-images');
    await fs.mkdir(imagesDir, { recursive: true });
    
    // Save the image
    const imagePath = path.join(imagesDir, filename);
    await fs.writeFile(imagePath, buffer);
    
    // Return the URL
    const url = `/blog-images/${filename}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      url 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}