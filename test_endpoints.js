const http = require('http');

const endpoints = [
  '/api/calls',
  '/api/call-notes',
  '/api/agent-status',
  '/api/follow-ups',
  '/api/call-analytics/dashboard',
  '/api-docs/'
];

console.log('Testing Endpoints...');

const testEndpoint = (path) => {
  return new Promise((resolve) => {
    http.get({
      hostname: 'localhost',
      port: 3000,
      path: path
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, body: data }));
    }).on('error', (err) => {
      resolve({ path, status: 'ERROR', body: err.message });
    });
  });
};

(async () => {
  for (const path of endpoints) {
    const result = await testEndpoint(path);
    console.log(`[GET] ${result.path} - Status: ${result.status}`);
    if (result.status === 401) {
      console.log(`  -> Response indicates auth works: ${result.body.substring(0, 100)}`);
    } else {
      console.log(`  -> Output length: ${result.body.length}`);
    }
  }
  process.exit(0);
})();
