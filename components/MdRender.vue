<template>
  <div class="md_doc_content md" :id="id">
    <div v-html="renderHtml"></div>
  </div>
</template>

<script>
// import HtmlView from "./HtmlView";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { copyToClipboard } from "@/assets/utils";
// const MarkdownAttrs = require("markdown-it-attrs");
import MarkdownAttrs from "markdown-it-attrs";

const markdown = new MarkdownIt({
  html: false,
  highlight(code) {
    const value = hljs.highlightAuto(code).value;
    return `<pre class="hljs md_code_container"><span class="copy_btn">复制</span><code>${value.trim()}</code></pre>`;
  }
});

markdown.use(MarkdownAttrs, {
  leftDelimiter: "[",
  rightDelimiter: "]",
  allowedAttributes: []
});

export default {
  props: {
    text: String,
    loading: Boolean,
    id: String,
    btnStyle: Object,
    spm: String,
    spmExtra: Object
  },
  // components: { HtmlView },
  data() {
    return {
      timeObj: null,
      restTime: 3,
      showCopyToast: false
    };
  },
  computed: {
    renderHtml() {
      const text = this.text;
      if (this.loading)
        return `<div id="md_loading">AI引擎生成答案中，请稍后…</div>`;
      if (!text?.trim()) return "";
      return markdown.render(text);
    }
  },
  watch: {
    renderHtml: {
      handler: function () {
        this.$nextTick(() => {
          this.bindCopyBtn();
        });
      },
      immediate: true
    }
  },
  methods: {
    bindCopyBtn() {
      const md = document.getElementById(this.id);
      if (!md) return;
      md.onclick = e => {
        const target = e.target;
        if (target.className !== "copy_btn") {
          return;
        }
        const text = target.nextSibling.innerText;
        copyToClipboard(text);
        this.$emit("spmCopy");
        // window?.csdn?.report?.reportClick({
        //   spm: '1018.2226.3001.9137	'
        // })
        document.querySelectorAll(".copy_btn").forEach(item => {
          item.innerText = "复制";
        });
        target.innerText = "复制成功";
        clearTimeout(this.timeObj);
        this.timeObj = setTimeout(() => {
          target.innerText = "复制";
        }, 2000);
      };
    },

    async openChat() {
      const path = this.$router.resolve({
        name: "chat-detail",
        query: {
          spm_from: "1018.2226.3001.9139",
          extra: "copy"
        }
      });
      window.open(path.href);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/markdown.scss";
.md_doc_content.md {
  box-sizing: border-box;
  p {
    margin: 0;
    white-space: pre-line;
    word-break: break-all;
    line-height: 22px;
    color: #222226;
    + p {
      margin-top: 10px;
    }
  }
  li {
    list-style: decimal;
  }
  pre {
    background: #fafafc;
  }
  #md_loading {
    text-align: center;
    margin-top: 60px;
  }
}
#copy_timer {
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);
  color: #555666;
  padding: 6px 14px;
  border-radius: 4px;
  z-index: 9999;
}
#copy_tips {
  position: fixed;
  top: -100px;
  left: -100px;
  font-size: 12px;
  background: #303133;
  padding: 8px 10px;
  color: #fff;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 9999;
  &::after {
    position: absolute;
    content: "";
    width: 8px;
    height: 8px;
    background: #303133;
    transform: translateX(-66px) rotateZ(45deg);
    bottom: -4px;
    right: 0;
  }
}
.md_code_container {
  position: relative;
  .copy_btn {
    position: absolute;
    top: 16px;
    right: 24px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.07);
    padding: 4px 10px;
    color: #000000;
    background-color: rgba(255, 255, 255, 0.9);
  }
  code {
    display: block;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
