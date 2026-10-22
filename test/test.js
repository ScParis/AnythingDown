import { AnythingDown, detectPlatform } from '../dist/index.js';

async function runTests() {
  console.log('--- TEST 1: URL Detection ---');
  const urls = [
    'https://www.instagram.com/reel/C123456789/',
    'https://www.tiktok.com/@user/video/7123456789012345678',
    'https://vm.tiktok.com/ZMxxxxxx/',
    'https://www.facebook.com/watch/?v=123456789',
    'https://fb.watch/xxxxxx/',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://twitter.com/user/status/123456789',
    'https://x.com/user/status/123456789',
  ];

  for (const url of urls) {
    console.log(`URL: ${url} => Platform: ${detectPlatform(url)}`);
  }

  console.log('\n--- TEST 2: Binary Manager Check ---');
  const downloader = new AnythingDown();
  const ytdlpPath = await downloader['binaryManager'].getYtDlpPath();
  const ffmpegPath = downloader['binaryManager'].getFfmpegPath();
  console.log(`yt-dlp Path: ${ytdlpPath}`);
  console.log(`ffmpeg Path: ${ffmpegPath || 'Not found'}`);

  console.log('\n--- TEST 3: Metadata Extraction & Download Test ---');
  // Use a short, safe public test video (Big Buck Bunny snippet)
  const testUrl = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'; // Big Buck Bunny 30s
  console.log(`Fetching info for: ${testUrl}`);

  try {
    const info = await AnythingDown.getInfo(testUrl);
    console.log('Title:', info.title);
    console.log('Duration:', info.duration, 'seconds');
    console.log('Author:', info.author?.name);
    console.log('Platform:', info.platform);
    console.log('Formats count:', info.formats.length);

    console.log('\n--- TEST 4: Downloading Audio MP3 with onProgress ---');
    const result = await AnythingDown.downloadAudio(testUrl, {
      outputDir: './downloads_test',
      filename: 'test_audio',
      onProgress: (p) => {
        if (p.percent % 25 === 0 || p.percent === 100) {
          console.log(`Progress: ${p.percent}% | Speed: ${p.speed} | Status: ${p.status}`);
        }
      }
    });

    console.log('Audio Download Result:', result.success ? `Saved to ${result.filePath}` : result.error);
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

runTests();
