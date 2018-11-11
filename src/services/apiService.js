import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 1000,
  headers: { "X-Access-Token": "foobar" }
});

// Add a response interceptor
instance.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
export default instance;
