import axios from "./axios";

interface RequestParams {
  [key: string]: any;
}

export default {
  // 登录注册
  getCodeImg: (params: RequestParams) =>
    axios.get("/user/code_img", { params, responseType: "blob" }),
  sendMsg: (params: RequestParams) => axios.get("/user/send_msg", { params }),
  isUserNameUsed: (params: RequestParams) =>
    axios.get("/user/is_username_used", { params }),
  isTelUsed: (params: RequestParams) =>
    axios.get("/user/is_tel_used", { params }),
  login: (params: RequestParams) => axios.post("/user/login", params),
  logout: (params: RequestParams) => axios.get("/user/logout", { params }),
  refreshToken: (params: RequestParams) =>
    axios.post("/user/refresh_token", params),
  register: (params: RequestParams) => axios.post("/user/register", params),
  // 开发者
  get_card_up_url: (params: RequestParams) =>
    axios.get("/user/get_card_up_url", { params }),
  reg_dev: (params: RequestParams) => axios.post("/user/reg_dev", params),
  put: (params: RequestParams) => axios(params)
};
