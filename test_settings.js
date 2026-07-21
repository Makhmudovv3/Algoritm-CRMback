const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = 'your_jwt_secret_here';

const token = jwt.sign(
  { id: '3c52fcd0-b599-4fa9-91c8-14f7407440ad', role: 'SUPER_ADMIN' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const makeRequest = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: responseBody });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

(async () => {
  try {
    console.log('Testing GET /api/settings');
    let res = await makeRequest('/api/settings');
    console.log(`Status: ${res.statusCode}`);

    console.log('Testing GET /api/settings/company');
    res = await makeRequest('/api/settings/company');
    console.log(`Status: ${res.statusCode}`);

    console.log('Testing PUT /api/settings/company');
    res = await makeRequest('/api/settings/company', 'PUT', {
      settings: [
        { key: 'companyName', value: 'Updated Company Name' }
      ]
    });
    console.log(`Status: ${res.statusCode}`);
    console.log(res.body);

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
