import { defineStore } from "pinia";

const useStore = defineStore("store", {
  state: () => ({
    showLogin: false
  }),
  actions: {
    login(isShow: boolean) {
      this.showLogin = isShow;
    }
  }
});

export default useStore;
