import axios from "axios";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://devbitapi-test.csdn.net:8080";
axios.defaults.baseURL = "http://192.168.80.190:8080";

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// axios.interceptors.response.use(
//   function (response) {
//     if (response.status !== 200) {
//       alert("Error: " + response.statusText);
//     }
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default axios;
