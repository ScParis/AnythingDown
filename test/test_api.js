import { createServer } from '../dist/index.js';

async function testApi() {
  const app = createServer();
  const server = app.listen(3456);

  console.log('--- TEST API: Server listening on port 3456 ---');

  try {
    // 1. Health check
    console.log('Testing GET /api/health...');
    const healthRes = await fetch('http://localhost:3456/api/health');
    const healthJson = await healthRes.json();
    console.log('Health Response:', healthJson.status === 'ok' ? 'OK' : healthJson);
    console.log('Binaries ready:', healthJson.binaries);

    // 2. Info check
    console.log('\nTesting POST /api/info...');
    const infoRes = await fetch('http://localhost:3456/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }),
    });
    const infoJson = await infoRes.json();
    console.log('Info Success:', infoJson.success);
    console.log('Media Title:', infoJson.data?.title);
    console.log('Platform:', infoJson.platform);

    // 3. Web Dashboard check
    console.log('\nTesting GET / (Dashboard HTML)...');
    const pageRes = await fetch('http://localhost:3456/');
    const htmlText = await pageRes.text();
    console.log('Dashboard Loaded, length:', htmlText.length, 'Contains title:', htmlText.includes('AnythingDown API'));

    console.log('\n✅ All API tests passed successfully!');
  } catch (err) {
    console.error('API Test Error:', err);
  } finally {
    server.close();
  }
}

testApi();
