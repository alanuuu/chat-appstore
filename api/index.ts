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
  uploadFile: (params: RequestParams) =>
    axios.put(params.url, params.file, {
      headers: {
        "Content-Type": "application/octet-stream"
      }
    }),
  // 获取token信息
  getTokenInfo: (params: RequestParams) =>
    axios.get("/admin/dev/token/get_info", { params }),
  get_token_for_free: (params: RequestParams) =>
    axios.post("/admin/dev/token/get_token_for_free", params)
};
