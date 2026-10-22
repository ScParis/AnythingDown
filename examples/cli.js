#!/usr/bin/env node
import { AnythingDown, detectPlatform } from '../dist/index.js';

const url = process.argv[2];
const isAudio = process.argv.includes('--audio');

if (!url) {
  console.log(`
Usage:
  node examples/cli.js <URL> [--audio]

Examples:
  node examples/cli.js https://www.instagram.com/reel/Cxxxxxx/
  node examples/cli.js https://www.tiktok.com/@user/video/123456789
  node examples/cli.js https://www.youtube.com/watch?v=xxxxxx --audio
`);
  process.exit(0);
}

async function main() {
  console.log(`Detected platform: ${detectPlatform(url)}`);
  console.log(`Fetching metadata for: ${url}...`);

  const downloader = new AnythingDown();

  try {
    const info = await downloader.getInfo(url);
    console.log(`Title: ${info.title}`);
    if (info.author?.name) console.log(`Author: ${info.author.name}`);
    if (info.duration) console.log(`Duration: ${info.duration}s`);

    console.log(`\nDownloading ${isAudio ? 'audio (MP3)' : 'video'}...`);
    const result = await downloader.download(url, {
      outputDir: './downloads',
      audioOnly: isAudio,
      onProgress: (p) => {
        process.stdout.write(`\rDownloading: ${p.percent}% [Speed: ${p.speed || 'N/A'}] [ETA: ${p.eta || 'N/A'}]`);
      }
    });

    console.log('\n');
    if (result.success) {
      console.log(`Success! File saved to: ${result.filePath}`);
    } else {
      console.error(`Download failed: ${result.error}`);
    }
  } catch (err) {
    console.error(`\nError: ${err.message}`);
  }
}

main();
