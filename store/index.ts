import { defineStore } from "pinia";

interface State {
  showLogin: boolean;
  userInfo: UserInfo;
}

export const useStore = defineStore("store", {
  state: (): State => ({
    showLogin: false,
    userInfo: ""
  }),
  actions: {
    login(isShow: boolean) {
      this.showLogin = isShow;
    },
    changeUserInfo(val: UserInfo) {
      this.userInfo = val;
    }
  }
});
