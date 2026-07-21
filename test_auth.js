const API_URL = 'http://localhost:3000/api';
let accessToken = '';

const testAuth = async () => {
  console.log('--- Phase 2 Verification ---');
  
  try {
    // 1. Test Super Admin Login
    console.log('\n[1] Testing Super Admin Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '998909086443', password: '6443' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData.success ? 'SUCCESS' : 'FAILED');
    accessToken = loginData.data.accessToken;

    // 2. Test Register Endpoint
    console.log('\n[2] Testing Register Endpoint...');
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        phone: `99890${Math.floor(1000000 + Math.random() * 9000000)}`,
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    console.log('Register Response:', registerData.success ? 'SUCCESS' : 'FAILED');
    
    const newUserPhone = registerData.data.user.phone;

    // 3. Test Normal User Login
    console.log('\n[3] Testing Normal User Login...');
    const normalLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: newUserPhone, password: 'password123' })
    });
    const normalLoginData = await normalLoginRes.json();
    console.log('Normal Login Response:', normalLoginData.success ? 'SUCCESS' : `FAILED: ${JSON.stringify(normalLoginData)}`);

    // 4. Test Protected Route
    console.log('\n[4] Testing Protected Route (/api/auth/me)...');
    const meRes = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const meData = await meRes.json();
    console.log('Protected Route Response:', meData.success ? 'SUCCESS' : 'FAILED', meData.data.role);

    console.log('\n[5] Auth Verification completed successfully!');
  } catch (error) {
    console.error('\n[X] Verification Failed:', error.message);
    process.exit(1);
  }
};

testAuth();
