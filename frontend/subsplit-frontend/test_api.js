import axios from 'axios';
async function test() {
  const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });
  const response = await api.get('/marketplace/categories');
  console.log("Axios response data:", response.data);
  const apiResponse = response.data;
  console.log("Extracted data:", apiResponse.data || []);
}
test();
