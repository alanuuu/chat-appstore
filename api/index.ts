import axios from "./axios";
import { EventSourcePolyfill } from "event-source-polyfill";

interface RequestParams {
  [key: string]: any;
}

const api2 = "https://devbit-api.csdn.net:8086";

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
    axios.post("/admin/dev/token/get_token_for_free", params),
  // 提交prompt
  submit_prompt: (params: RequestParams) =>
    axios.post("/admin/dev/prompt/submit_prompt", params),
  get_prompt_category: (params: RequestParams) =>
    axios.get("/admin/dev/prompt/get_category", { params }),
  get_prompt_icon_upload_url: (params: RequestParams) =>
    axios.get("/admin/dev/prompt/get_prompt_icon_upload_url", { params }),
  // chat
  getChatById(params: RequestParams) {
    return axios
      .get(api2 + `/code/chatgpt/get_doc_by_id`, {
        params,
        headers: {
          UserName: "TESTDEVBIT"
        }
      })
      .then(resp => resp?.data || {});
  },
  openChat({ keyword, uuid }: { keyword: string; uuid: string }) {
    return new EventSourcePolyfill(
      api2 +
        "/chatgpt/data/proxy?question=" +
        keyword +
        "&uuid=" +
        uuid +
        "&source=2&version=2",
      // "https://47.245.6.22/conversation.php?id=csdn0302&q=" + keyword,
      {
        headers: {
          UserName: "TESTDEVBIT"
        },
        heartbeatTimeout: 120000
      }
    );
  },
  getErrorMessage(params: RequestParams) {
    return axios
      .get(api2 + "/code/chatgpt/get_err_prompt", { params })
      .then(resp => resp?.data || {});
  },
  getWaitingPositon(params: RequestParams) {
    return axios
      .get(api2 + "/chatgpt/data/get_req_pos", {
        params
      })
      .then(resp => resp?.data || {});
  },
  checkKeyword(params: RequestParams) {
    return axios
      .get(api2 + `/check/sensitive/query_check`, { params })
      .then(resp => resp?.data || {});
  },
  checkSug(params: RequestParams) {
    return axios
      .get(api2 + `/check/sensitive/sug_check`, { params })
      .then(resp => resp?.data || {});
  },
  saveChat(params: RequestParams) {
    return axios
      .post(api2 + "/code/chatgpt/submit_q_and_a", params, {
        headers: {
          UserName: params.userid
        }
      })
      .then(resp => resp?.data || {});
  },
  getChatSuggest(params: RequestParams) {
    return axios
      .post(api2 + "/code/chatgpt/suggestion", params, {
        headers: {
          UserName: "TESTDEVBIT"
        }
      })
      .then(resp => resp?.data || {});
  },
  getChatList(params: RequestParams) {
    return axios
      .post(api2 + `/code/chatgpt/list_forum_by_page`, params)
      .then(resp => resp?.data || {});
  }
};
