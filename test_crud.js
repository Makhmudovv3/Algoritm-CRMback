const http = require('http');

const PORT = 3000;
const HOST = 'localhost';

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData ? Buffer.byteLength(postData) : 0
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data.substring(0, 200) });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const OK_STATUSES = [200, 201, 204];

const check = (label, status) => {
  const passed = OK_STATUSES.includes(status);
  console.log(`  ${passed ? '✓' : '✗'} ${label}: HTTP ${status}`);
  return passed;
};

(async () => {
  let passed = 0;
  let failed = 0;

  // ── STEP 1: LOGIN ─────────────────────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 1: POST /api/auth/login');
  console.log('══════════════════════════════════');

  const loginRes = await request('POST', '/api/auth/login', {
    phone: '998909086434',
    password: '6434'
  });

  console.log('  Status:', loginRes.status);
  if (loginRes.status !== 200) {
    console.error('  FATAL: Login failed:', loginRes.data);
    process.exit(1);
  }

  // authService returns { user, accessToken, refreshToken }
  const token = loginRes.data.data?.accessToken;
  const userInfo = loginRes.data.data?.user;

  if (!token) {
    console.error('  FATAL: Token not found in response. Full data:', JSON.stringify(loginRes.data));
    process.exit(1);
  }

  console.log('  ✓ Login: HTTP 200 OK');
  console.log(`  User: ${userInfo?.firstName} ${userInfo?.lastName} (${userInfo?.role})`);
  console.log(`  Token (first 20 chars): ${token.substring(0, 20)}...`);

  // ── STEP 2: POST /api/calls ───────────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 2: POST /api/calls');
  console.log('══════════════════════════════════');

  const postCallRes = await request('POST', '/api/calls', {
    phone: '+998901234567',
    direction: 'incoming',
    type: 'sales',
    status: 'ringing'
  }, token);

  console.log('  Status:', postCallRes.status);
  console.log('  Response:', JSON.stringify(postCallRes.data).substring(0, 300));

  let createdCallId = null;
  if (check('POST /api/calls', postCallRes.status)) {
    passed++;
    createdCallId = postCallRes.data.data?.id;
    console.log('  Created ID:', createdCallId);
  } else {
    failed++;
  }

  // ── STEP 3: GET /api/calls ────────────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 3: GET /api/calls');
  console.log('══════════════════════════════════');

  const getCallsRes = await request('GET', '/api/calls', null, token);
  console.log('  Status:', getCallsRes.status);
  if (check('GET /api/calls', getCallsRes.status)) {
    passed++;
    const rows = getCallsRes.data?.data?.rows || getCallsRes.data?.data || [];
    console.log('  Total records returned:', Array.isArray(rows) ? rows.length : '(see data)');
  } else {
    failed++;
    console.log('  Error:', JSON.stringify(getCallsRes.data).substring(0, 200));
  }

  // ── STEP 4: PUT /api/calls/:id ───────────────────────────────
  if (createdCallId) {
    console.log('\n══════════════════════════════════');
    console.log(` STEP 4: PUT /api/calls/${createdCallId}`);
    console.log('══════════════════════════════════');

    const putCallRes = await request('PUT', `/api/calls/${createdCallId}`, {
      status: 'answered',
      duration: 120
    }, token);

    console.log('  Status:', putCallRes.status);
    if (check(`PUT /api/calls/${createdCallId}`, putCallRes.status)) {
      passed++;
    } else {
      failed++;
      console.log('  Error:', JSON.stringify(putCallRes.data).substring(0, 200));
    }
  }

  // ── STEP 5: GET /api/call-notes ──────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 5: GET /api/call-notes');
  console.log('══════════════════════════════════');

  const getNotesRes = await request('GET', '/api/call-notes', null, token);
  console.log('  Status:', getNotesRes.status);
  if (check('GET /api/call-notes', getNotesRes.status)) {
    passed++;
  } else {
    failed++;
    console.log('  Error:', JSON.stringify(getNotesRes.data).substring(0, 200));
  }

  // ── STEP 6: GET /api/agent-status ────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 6: GET /api/agent-status');
  console.log('══════════════════════════════════');

  const getStatusRes = await request('GET', '/api/agent-status', null, token);
  console.log('  Status:', getStatusRes.status);
  if (check('GET /api/agent-status', getStatusRes.status)) {
    passed++;
  } else {
    failed++;
    console.log('  Error:', JSON.stringify(getStatusRes.data).substring(0, 200));
  }

  // ── STEP 7: GET /api/follow-ups ──────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 7: GET /api/follow-ups');
  console.log('══════════════════════════════════');

  const getFollowRes = await request('GET', '/api/follow-ups', null, token);
  console.log('  Status:', getFollowRes.status);
  if (check('GET /api/follow-ups', getFollowRes.status)) {
    passed++;
  } else {
    failed++;
    console.log('  Error:', JSON.stringify(getFollowRes.data).substring(0, 200));
  }

  // ── STEP 8: GET /api/call-analytics/dashboard ────────────────
  console.log('\n══════════════════════════════════');
  console.log(' STEP 8: GET /api/call-analytics/dashboard');
  console.log('══════════════════════════════════');

  const getAnalyticsRes = await request('GET', '/api/call-analytics/dashboard', null, token);
  console.log('  Status:', getAnalyticsRes.status);
  if (check('GET /api/call-analytics/dashboard', getAnalyticsRes.status)) {
    passed++;
    console.log('  Analytics data:', JSON.stringify(getAnalyticsRes.data?.data).substring(0, 200));
  } else {
    failed++;
    console.log('  Error:', JSON.stringify(getAnalyticsRes.data).substring(0, 200));
  }

  // ── STEP 9: DELETE /api/calls/:id ────────────────────────────
  if (createdCallId) {
    console.log('\n══════════════════════════════════');
    console.log(` STEP 9: DELETE /api/calls/${createdCallId}`);
    console.log('══════════════════════════════════');

    const delCallRes = await request('DELETE', `/api/calls/${createdCallId}`, null, token);
    console.log('  Status:', delCallRes.status);
    if (check(`DELETE /api/calls/${createdCallId}`, delCallRes.status)) {
      passed++;
    } else {
      failed++;
      console.log('  Error:', JSON.stringify(delCallRes.data).substring(0, 200));
    }
  }

  // ── SUMMARY ──────────────────────────────────────────────────
  console.log('\n══════════════════════════════════');
  console.log(' VERIFICATION SUMMARY');
  console.log('══════════════════════════════════');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  if (failed === 0) {
    console.log('\n  ✓ ALL ENDPOINTS VERIFIED — PRODUCTION READY\n');
  } else {
    console.log('\n  ✗ SOME ENDPOINTS FAILED — NOT PRODUCTION READY\n');
  }
})();
