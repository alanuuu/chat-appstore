import axios from "axios";
import { ElNotification } from "element-plus";
import { useStore } from "~~/store";

axios.defaults.withCredentials = false;
axios.defaults.baseURL = "https://devbitapi-test.csdn.net/ai";
// axios.defaults.baseURL = "http://192.168.80.190:8080";

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

axios.interceptors.response.use(
  function (response) {
    const {
      data: { code }
    } = response;
    console.log(response);

    if (code === 403 || code === 401) {
      ElNotification.warning("登录信息过期，请重新登陆");
      const store = useStore();
      store.logout();
      store.login(true);
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
