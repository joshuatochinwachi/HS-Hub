import * as fs from 'fs';
import * as path from 'path';

// Automatic copy of generated product images into public folder (only runs locally)
const userHome = process.env.USERPROFILE || process.env.HOME || '';
const artifactsDir = path.join(
  userHome,
  '.gemini',
  'antigravity-ide',
  'brain',
  '8a438209-e3ba-491b-8124-5ca535d4feaa'
);

const imageMap = {
  'panini_prizm_wc.png': 'panini_prizm_wc_1783754804652.png',
  'mega_greninja_ex.png': 'mega_greninja_ex_1783754812628.png',
  'perfect_order_box.png': 'perfect_order_box_1783754824354.png',
  'trainers_toolkit.png': 'trainers_toolkit_1783754833334.png',
};

const destDir = path.join(process.cwd(), 'public', 'products');

if (fs.existsSync(artifactsDir)) {
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    for (const [destName, srcName] of Object.entries(imageMap)) {
      const srcPath = path.join(artifactsDir, srcName);
      const destPath = path.join(destDir, destName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Failed to copy product images:', err);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/android',
        destination: 'https://play.google.com/store/apps/details?id=com.kttylabs.app',
        permanent: true,
      },
      {
        source: '/ios',
        destination: 'https://apps.apple.com/gb/app/hollowscan/id6759551811',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
