import axios from "./axios";

interface RequestParams {
  [key: string]: any;
}

export default {
  getCodeImg: (params: RequestParams) =>
    axios.get("/user/code_img", { params, responseType: "blob" }),
  sendMsg: (params: RequestParams) => axios.get("/user/send_msg", { params }),
  isUserNameUsed: (params: RequestParams) =>
    axios.get("/user/is_username_used", { params }),
  login: (params: RequestParams) => axios.post("/user/login", params),
  logout: (params: RequestParams) => axios.get("/user/logout", { params }),
  refreshToken: (params: RequestParams) =>
    axios.post("/user/refresh_token", params),
  register: (params: RequestParams) => axios.post("/user/register", params)
};
