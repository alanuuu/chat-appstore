// 用于替换v-html指令

export default {
  props: {
    text: String
  },
  render(h) {
    return h("div", {
      class: "md",
      domProps: {
        innerHTML: this.text
      }
    });
  }
};
