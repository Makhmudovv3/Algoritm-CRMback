const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/teachers', {
      fullname: 'Test Teacher',
      phone: '+998901234569',
      email: '',
      branch_id: null,
      is_active: true
    }, {
      headers: { 'Authorization': 'Bearer MOCK' } 
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
