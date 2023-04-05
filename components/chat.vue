<template>
  <div id="chat" class="m-w-100 m-m-0">
    <div class="chat-box m-m-0">
      <ul
        ref="recordsList"
        @click="showMenu = false"
        class="content record-list max-w-7xl mx-auto"
        v-if="records.length"
      >
        <li
          v-for="(item, index) in records"
          :key="index"
          :class="['record-item', item.type]"
        >
          <div class="avatar">
            <img :src="resolveAvatar(item)" alt="" />
          </div>
          <div class="text">
            <img
              class="icon-loading"
              v-if="loading && !item.message && item.type === 'left'"
              src="@/assets/imgs/icon-loading.svg"
              alt=""
            />
            <template v-else-if="item.waiting">
              {{ item.message }}
              <img
                class="icon-loading"
                src="@/assets/imgs/icon-waiting.svg"
                alt=""
              />
            </template>
            <template v-else>
              <MdRender
                :text="item?.message"
                :id="'code_' + new Date().getTime() + '_' + index"
              />
              <!-- <FeedBack
                @spmFeed="$event => $emit('spmFeed', $event)"
                ref="feedBack"
                v-if="showFeedBack(item)"
                :item="item"
              /> -->
            </template>
          </div>
        </li>
        <div class="vip-dialog"></div>
      </ul>
      <div class="content" @click="showMenu = false" v-else>
        <div class="logo" :style="{ marginTop: '0' }">
          <img src="@/assets/imgs/icon-menu-chat.png" alt="" />
          <span>ChatGPT</span>
          <!-- <img class="icon-beta" src="@/assets/imgs/icon-beta.png" alt="" /> -->
        </div>
      </div>
      <div class="input-container">
        <client-only>
          <el-popover
            :popper-options="{
              boundariesElement: 'body',
              gpuAcceleration: true,
              positionFixed: true,
              preventOverflow: true
            }"
            :teleported="false"
            width="598"
            v-model="showSuggest"
            popper-class="chat-sug"
            placement="top"
            trigger="manual"
          >
            <div class="sug-box">
              <div class="sug-header">
                <div class="title">热门问题</div>
              </div>
              <div class="sug-list">
                <div
                  :class="['sug-item', { active: index === suggestIndex }]"
                  @click="clickSug(index)"
                  v-for="(item, index) in suggestList"
                  :key="item.docId"
                >
                  <span>{{ item.sug }}</span>
                  <img src="@/assets/imgs/icon-fire.png" alt="" />
                </div>
              </div>
            </div>
            <template #reference class="m-w-100 flex align-center">
              <div class="message-input">
                <el-input
                  ref="searchEl"
                  v-model="message"
                  @focus="clearSugList"
                  @blur="resetSugList"
                  @input="inputHandler"
                  @keypress.enter.native="enterHandler"
                  @keydown.down.native="changeSuggestIndex('next')"
                  @keydown.up.native="changeSuggestIndex('prev')"
                  :placeholder="placeholderVal"
                  :disabled="loading"
                >
                  <i
                    @click="clearInput"
                    v-show="message"
                    slot="suffix"
                    class="el-input__icon el-icon-error"
                  ></i>
                </el-input>
                <img
                  src="@/assets/imgs/icon-loading.svg"
                  v-show="showLoading && loading"
                  alt=""
                />
                <img
                  @click="sendMessage"
                  class="icon-send"
                  v-show="!loading"
                  src="@/assets/imgs/icon-send.svg"
                  alt=""
                />
              </div>
            </template>
          </el-popover>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { urlToObject, isMobile } from "@/assets/utils";
import { ElPopover, ElInput } from "element-plus";
import api from "@/api";
// import api from "./api/index";
import MdRender from "./MdRender.vue";
import axios from "axios";
import throttle from "lodash/throttle";
import pick from "lodash.pick";
import AiAvatar from "@/assets/imgs/icon-menu-chat.png";
import UserAvatar from "@/assets/imgs/default.jpg";
const ErrorType = {
  break: 1,
  error: 2
};

const ReturnType = {
  ask: 1,
  view: 2
};

export default {
  components: {
    MdRender,
    ElPopover,
    ElInput
    // FeedBack
  },
  props: {
    sugLength: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      records: [],
      suggestList: [],
      sugList: [],
      loading: false,
      showSuggest: false,
      showLoading: true,
      suggestIndex: -1,
      errorMessage: "向我提问的人太多啦，我回答不过来了呢~",
      freeTime: 5,
      message: "",
      source: "",
      recordTimer: null,
      isVip: true,
      restNum: 100,
      restTickets: 0,
      getStatus: 0,
      waitingLast: Infinity,
      showVip: false,
      showMenu: false,
      uuid: "",
      userInfo: {},
      sugTimer: null,
      placeholderVal: "快来向我提问吧~",
      placeHolderItem: null,
      filter: {
        pageNum: 1,
        pageSize: 20,
        categoryId: "",
        keyword: ""
      }
    };
  },
  computed: {
    docId() {
      return this.$route.params.id;
    },
    suggestItem() {
      return this.suggestList[this.suggestIndex];
    },
    inputHandler() {
      return throttle(this.changeMessage, 500);
    },
    spm_from() {
      const query = this.$route.query;
      const spm = query?.spm_from || query?.from_spm;
      return spm;
    },
    cid() {
      const { params } = urlToObject(location.href);
      return params?.cid || "1";
    }
  },
  watch: {
    sugList: {
      handler: function (val) {
        if (val?.length > 0) {
          this.initSugList();
        }
      },
      immediate: true
    }
  },

  created() {
    this.getChatList();
    this.getErrorMessage();
  },
  beforeRouteLeave(to, from, next) {
    this.showMenu = false;
    this.loading = false;
    clearInterval(this.recordTimer);
    this.source?.close?.();
    next();
  },
  methods: {
    getChatList() {
      const fetch = api.getChatList(this.filter);
      fetch
        .then(({ data: res }) => {
          this.sugList = res.list;
        })
        .catch(e => {
          console.log(e);
        });
    },

    initSugList() {
      const list = this.sugList;
      this.placeHolderItem = list[0];
      this.placeholderVal = "试试这样问我：" + this.placeHolderItem?.question;
      clearInterval(this.sugTimer);
      this.sugTimer = setInterval(() => {
        const item = list[Math.floor(Math.random() * 10)];
        this.placeHolderItem = item;
        this.placeholderVal = "试试这样问我：" + item?.question;
      }, 5000);
    },
    clearSugList() {
      clearInterval(this.sugTimer);
      this.placeHolderItem = "";
      this.placeholderVal = "";
    },
    resetSugList() {
      const list = this.sugList;
      this.placeholderVal = "试试这样问我：" + list[0]?.question;
      setTimeout(() => {
        this.initSugList();
      }, 500);
    },

    showFeedBack(item) {
      return (
        !item?.loading && item.message && item?.id && item?.type === "left"
      );
    },

    updateRecords(val) {
      this.records = val;
    },
    async changeMessage() {
      const keyword = this.message.trim();
      if (!keyword) {
        this.showSuggest = false;
        return;
      }
      const { data: res } = await api.checkSug({
        query: keyword
      });

      if (!res) {
        this.showSuggest = false;
        return;
      }

      const formData = new FormData();
      formData.append("query", keyword);
      api.getChatSuggest(formData).then(({ data: res }) => {
        const list = res;
        this.suggestIndex = -1;
        if (list.length && this.message.trim()) {
          this.suggestList = list.slice(0, this.sugLength);
          this.showSuggest = true;
        } else {
          this.showSuggest = false;
        }
      });
    },
    resolveAvatar(item) {
      let avatar;
      const img = this.userInfo?.avatar;
      switch (item.type) {
        case "left":
          avatar = AiAvatar;
          break;
        case "right":
          avatar = img || UserAvatar;
          break;
        default:
          break;
      }
      return avatar;
    },

    clickSug(index) {
      this.suggestIndex = index;
      this.selectSuggest({
        source: 2
      });
    },
    clearInput() {
      this.$refs.searchEl.clear();
    },
    changeSuggestIndex(type) {
      const len = this.suggestList.length;
      switch (type) {
        case "next":
          this.suggestIndex++;
          if (this.suggestIndex >= len) {
            this.suggestIndex = -1;
          }
          break;
        case "prev":
          this.suggestIndex--;
          if (this.suggestIndex < -1) {
            this.suggestIndex = len - 1;
          }
          break;
        default:
          break;
      }
    },
    enterHandler() {
      if (this.suggestIndex === -1) {
        this.sendMessage();
      } else {
        this.selectSuggest({
          source: 2
        });
      }
    },
    async selectSuggest(options) {
      if (!this.suggestItem) return;
      const id = this.suggestItem.docId;
      api
        .getChatById({
          docId: id,
          source: options?.source
        })
        .then(({ data: res }) => {
          this.showSuggest = false;
          this.suggestList = [];
          this.loading = true;
          if (!options?.skipQ) {
            this.records.push({
              type: "right",
              message: res?.question
            });
          }
          this.records.push({
            id,
            type: "left",
            message: ""
          });
          let position = 0;
          clearInterval(this.recordTimer);
          const answer = res.answer;
          this.recordTimer = setInterval(() => {
            // this.$set(this.records, this.records.length - 1, {
            //   id,
            //   type: "left",
            //   loading: position < answer.length,
            //   message: answer.slice(0, (position += 3))
            // });
            this.records[this.records.length - 1] = {
              id,
              type: "left",
              loading: position < answer.length,
              message: answer.slice(0, (position += 3))
            };

            this.scrollToBottom();
            if (position >= answer.length) {
              clearInterval(this.recordTimer);
              const last = this.records[this.records.length - 1];
              delete last.loading;
              // this.$set(this.records, this.records.length - 1, last);
              this.records[this.records.length - 1] = last;
              position = 0;
              this.resolveRestNum();
              if (options?.source) {
                api.saveChat({
                  question: res?.question,
                  answer,
                  userid: this.userInfo.userid,
                  zhName: this.userInfo.name,
                  avatar: this.userInfo.avatar,
                  cid: this.cid,
                  source: 2,
                  isVip: this.isVip,
                  isSug: true
                });
              }
            }
          }, 150);
        });
    },
    saveWeixinChat(params) {
      const data = pick(params, [
        "question",
        "answer",
        "userid",
        "zhName",
        "avatar",
        "cid"
      ]);
      axios.post("https://devbit-api.csdn.net:6066/chat/saveChat", data);
    },
    showRecords() {
      this.records = [];
      this.showVip = false;
      const params = this.$route.params;
      const id = params.id;
      const title = params.title;
      if (!id) return;
      this.suggestIndex = 0;
      // this.suggestList = []
      this.suggestList = [
        {
          docId: id,
          sug: ""
        }
      ];
      title &&
        this.records.push({
          type: "right",
          message: title
        });
      this.initSugList();
      // this.placeholderVal = '快来向我提问吧~'
      this.selectSuggest({
        skipQ: !!title,
        returnType: ReturnType.view
      });
    },
    async sendMessage() {
      if (!this.message.trim()) {
        if (this.placeHolderItem) {
          this.message = this.placeHolderItem.question;
          this.suggestList = [
            {
              sug: this.message,
              ...this.placeHolderItem
            }
          ];
        } else {
          return;
        }
      }
      const keyword = this.message;
      this.loading = true;
      this.records.push({
        type: "right",
        message: keyword
      });
      this.scrollToBottom();
      this.showSuggest = false;

      api
        .checkKeyword({
          query: keyword,
          rtype: 2
        })
        .then(({ data: res }) => {
          if (!res) {
            this.records.push({
              type: "left",
              message: "很抱歉，这个问题我无法回答。"
            });
            this.scrollToBottom();
            this.loading = false;
            this.saveWeixinChat({
              question: keyword,
              answer: "很抱歉，这个问题我无法回答。",
              userid: this.userInfo.userid,
              zhName: this.userInfo.name,
              avatar: this.userInfo.avatar,
              cid: this.cid
            });
            if (isMobile()) return;
            this.$nextTick(() => {
              this.$refs.searchEl?.focus();
            });
          } else {
            const index = this.suggestList.findIndex(item => {
              return item.sug === keyword;
            });
            if (index !== -1) {
              this.suggestIndex = index;
              this.selectSuggest({
                skipQ: true,
                source: 2
              });
              return;
            }
            this.records.push({
              type: "left",
              message: ""
            });
            this.scrollToBottom();
            const uuid = this.createUuid();
            this.createEventSource({
              keyword,
              uuid
            });
          }
        })
        .catch(() => {
          this.message = "";
        });
    },
    createUuid() {
      return new Date().getTime() + "_" + Math.floor(Math.random() * 10);
    },
    createEventSource({ keyword, uuid }) {
      return new Promise(resolve => {
        this.source?.close?.();
        this.source = api.openChat({
          keyword,
          uuid
        });
        this.source.onopen = event => {
          console.log("onopen", event);
        };
        this.source.onmessage = event => {
          if (event.data === "[DONE]") {
            // console.log('onmessage done', event)
            const last = this.records[this.records.length - 1];
            delete last.loading;
            // this.$set(this.records, this.records.length - 1, last);
            this.records[this.records.length - 1] = last;

            this.source.close?.();
            this.resolveRestNum();
            const params = {
              question: keyword,
              answer: this.records[this.records.length - 1]?.message,
              isVip: this.isVip,
              source: 2,
              userid: this.userInfo.userid,
              zhName: this.userInfo.name,
              avatar: this.userInfo.avatar,
              cid: this.cid,
              ticketCode: this.ticketCode,
              qid: this.currentId
            };
            api.saveChat(params);

            this.saveWeixinChat(params);
            return;
          }
          if (event.data) {
            const data = JSON.parse(event.data);
            const text = data.message.content.parts.join("");
            this.currentId = data.conversation_id + `-${Date.now()}`;
            // this.$set(this.records, this.records.length - 1, {
            //   type: "left",
            //   id: this.currentId,
            //   loading: true,
            //   message: text
            // });
            this.records[this.records.length - 1] = {
              type: "left",
              id: this.currentId,
              loading: true,
              message: text
            };
            this.scrollToBottom();
          }
        };
        this.source.onerror = event => {
          console.log("error", event);
          console.log(event?.status);
          if (event?.status === 401) {
            const uuid = this.createUuid();
            this.createEventSource({ keyword, uuid });
            return;
          }
          const errorType = this.records[this.records.length - 1]?.message
            ? ErrorType.break
            : ErrorType.error;
          const params = {
            question: keyword,
            answer: null,
            isVip: this.isVip,
            source: 2,
            userid: this.userInfo.userid,
            zhName: this.userInfo.name,
            avatar: this.userInfo.avatar,
            cid: this.cid,
            ticketCode: this.ticketCode,
            errorType
          };
          api.saveChat(params);

          this.saveWeixinChat(params);
          setTimeout(() => {
            // this.$set(this.records, this.records.length - 1, {
            //   type: "left",
            //   message: this.errorMessage
            // });
            this.records[this.records.length - 1] = {
              type: "left",
              message: this.errorMessage
            };
            this.source?.close?.();
            this.loading = false;
            if (isMobile()) return;
            this.$nextTick(() => {
              this.$refs.searchEl?.focus();
            });
          }, 3000);
        };
        resolve(true);
      });
    },
    async resolveRestNum() {
      this.loading = false;
      if (isMobile()) return;
      this.$nextTick(() => {
        this.$refs.searchEl?.focus();
      });
    },
    getErrorMessage() {
      api
        .getErrorMessage({
          src: 2
        })
        .then(({ data: res }) => {
          this.errorMessage = res?.prompt;
          this.freeTime = res?.times ?? 5;
        });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let recordsList;
        if (isMobile()) {
          recordsList = document.documentElement;
        } else {
          recordsList = this.$refs.recordsList;
        }
        const top = recordsList?.scrollHeight + recordsList?.scrollTop;
        recordsList?.scrollTo({
          top,
          behavior: "smooth"
        });
        this.message = "";
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "./assets/css/common.less";
@import "@/assets/css/common.scss";
#chat {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0px auto;
  font-size: 14px;
  @extend .fixheader;
  .chat-box {
    flex: 1;
    // height: 100%;
    padding: 64px 20px 34px 40px;
    position: relative;
    background: #fff;
    padding-bottom: 94px;
    box-shadow: 0px 1px 0px 0px #f0f0f2;
    @media screen and (max-width: 768px) {
      padding-left: 20px;
      padding-right: 20px;
      padding: 32px 0 84px 20px;
      background: #fafafc;
    }
    .el-breadcrumb {
      position: absolute;
      left: 40px;
      top: 22px;
      z-index: 10;
      @media screen and (max-width: 768px) {
        left: 20px;
      }
    }

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 500;
        transition: margin-top 0.3s;
        position: relative;
        .logo-c {
          color: #fc5531;
          width: 12px;
          height: 14px;
          margin-right: 1px;
        }
        img {
          width: 48px;
          height: 48px;
          margin-right: 4px;
        }

        .icon-beta {
          right: -30px;
          top: 4px;
          background: none;
          border: none;
          width: 28px;
          height: 12px;
          position: absolute;
        }
      }
      .desc {
        font-size: 14px;
        margin-top: 14px;
        margin-bottom: 28px;
        max-width: 66%;
        color: #555570;
        @media screen and (max-width: 768px) {
          max-width: 82%;
        }
        p {
          word-break: break-all;
        }
        ul {
          padding-left: 18px;
          margin: 10px 0;
          li {
            list-style: decimal;
            margin: 4px 0;
          }
        }
      }
      .vip-button,
      :deep(.vip-button) {
        cursor: pointer;
        display: inline-block;
        margin-left: 24px;
        width: 202px;
        height: 32px;
        .action-button {
          display: block;
          width: 100%;
          height: 100%;
          background: #444555;
          color: #f8e3c3;
          border-radius: 32px;
          text-align: center;
          line-height: 32px;
          text-decoration: none;
          &:hover {
            opacity: 0.8;
          }
        }
        &.center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      :deep(.vip-button) {
        margin-left: 0;
        margin-top: 8px;
      }

      &.record-list {
        list-style: none;
        justify-content: flex-start;
        margin: 0 auto;
        overflow-y: auto;
        padding: 0;
        padding-bottom: 20px;
        padding-right: 20px;
        @extend .scrollstyle;
        .record-item {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .avatar {
            border-radius: 4px;
            overflow: hidden;
            // opacity: 0.8;
            border: 1px solid #f0f0f5;
            box-sizing: border-box;
            @media screen and (max-width: 768px) {
              border-radius: 50%;
            }
            img {
              width: 42px;
              height: 42px;
              display: block;
            }
          }
          .text {
            border-radius: 4px;
            opacity: 0.8;
            border: 1px solid #f0f0f5;
            padding: 10px 20px;
            max-width: calc(100% - 88px);
            position: relative;

            &::before {
              content: "";
              position: absolute;
              width: 0;
              height: 0;
              top: 15px;
              border: 1px solid #f0f0f5;
            }
            :deep(p) {
              margin: 0;
              white-space: pre-line;
              line-height: 22px;
              & + p,
              & + pre {
                margin-top: 8px;
              }
            }
            .icon-loading {
              width: 20px;
              height: 20px;
              vertical-align: middle;
            }
          }
          &.left,
          &.right {
            .text {
              background: rgba(39, 124, 204, 0.1);
              border: 1px solid #f0f0f5;
              margin-left: 12px;
              &::before {
                left: -13px;
                border-right: 6px solid rgba(39, 124, 204, 0.1);
                border-top: 6px solid transparent;
                border-left: 6px solid transparent;
                border-bottom: 6px solid transparent;
              }
            }
          }

          &.left {
            .text {
              padding-bottom: 10px;
              // padding-bottom: 38px;
            }
          }
          &.right {
            flex-direction: row-reverse;
            .text {
              background: #faf6ee;
              opacity: 0.8;
              border: 1px solid rgba(240, 240, 245, 0.8);
              margin-right: 12px;
              &::before {
                left: unset;
                right: -13px;
                border-left: 6px solid #faf6ee;
                border-top: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
              }
            }
          }
          & + .record-item {
            margin-top: 34px;
          }
        }
      }
    }
    .input-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 94px;
      box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.05);
      @media screen and (max-width: 768px) {
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        border-radius: 5px 5px 0 0;
        background: #fff;
        z-index: 99;
        padding: 14px 16px;
        height: 80px;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          z-index: 10;
        }
      }
      :deep(.chat-sug) {
        padding: 0;
        top: unset !important;
        bottom: 82px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        position: absolute !important;
        @media screen and (max-width: 768px) {
          width: 90vw !important;
        }
        .sug-box {
          color: #555666;
          padding: 10px 0;
          img {
            width: 16px;
            vertical-align: -3px;
            margin-left: 4px;
          }
          .sug-header {
            height: 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 0 14px;
            margin-bottom: 4px;
            .title {
              color: #fc5531;
              flex: 1;
              overflow: hidden;
            }
            .el-icon-close {
              cursor: pointer;
              color: #fc5531;
            }
            .change {
              cursor: pointer;
            }
          }
          p {
            padding: 14px;
          }
          .sug-list {
            .sug-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 32px;
              padding: 4px 0;
              background: #fff;
              padding: 0 14px;
              cursor: pointer;
              &:hover,
              &.active {
                background: #f7f7fc;
              }
              span {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .icon-menu-fold {
      // position: absolute;
      // top: 16px;
      // right: 18px;
      width: 24px;
      margin: 0 14px 0 0;
      font-size: 22px;
      z-index: 10;
      color: #606266;
      cursor: pointer;
      position: relative;
      z-index: 11;
    }
    .menu-fold {
      position: absolute;
      width: 100%;
      bottom: -120px;
      left: 0;
      padding: 20px 14px;
      z-index: -1;
      opacity: 0;
      transition: all 0.3s;
      :last-child li {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background: #fff;
          bottom: -5px;
          left: 9px;
          box-shadow: 0px 14px 10px 0px rgba(0, 0, 0, 0.06);
          transform: rotateZ(45deg);
        }
      }
      li {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 16px;
        color: #555570;
        background: #ffffff;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        margin: 16px 0;
      }
      &.show {
        bottom: 64px;
        opacity: 1;
        z-index: 9;
      }
    }
    .message-input {
      width: 598px;
      height: 48px;
      margin: 0 auto;
      margin-top: 24px;
      padding: 0px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      z-index: 11;
      @media screen and (max-width: 768px) {
        box-shadow: none;
        background: #e8e8f0;
        height: 34px;
        line-height: 34px;
        margin-top: 0px;
        flex: 1;
        width: 100%;
        padding: 0 12px;
        :deep(.el-input) {
          .el-input__inner,
          i.el-input__icon {
            line-height: 34px;
          }
        }
      }
      :deep(.el-input) {
        height: 100%;
        .el-input__wrapper {
          box-shadow: none;
          background: none;
        }
        .el-input__inner {
          padding: 0;
          height: 100%;
          border: none;
          outline: none;
          box-shadow: none;
          background: none;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        input {
          flex: 1;
          height: 100%;
          outline: none;
          border: none;
          &[disabled] {
            background: none;
            cursor: not-allowed;
          }
          &:focus {
            & + .el-input__suffix {
              display: block;
            }
          }
        }
        .el-input__suffix {
          display: none;
        }
        .el-input__icon {
          font-size: 18px;
          line-height: 48px;
          cursor: pointer;
        }
        &:hover {
          .el-input__suffix {
            display: block;
          }
        }
      }
      img {
        width: 24px;
        height: 24px;
        margin-left: 8px;
        cursor: pointer;
        &.icon-send:hover {
          background: #f0f0f5;
        }
      }
      .anticon {
        font-size: 22px;
        color: var(--color-text-desc);
      }
    }
  }
  .side-bar {
    width: 338px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-card {
      background: #fff;
      &.list-card {
        flex: 1;
        overflow: hidden;
      }
      .card-header {
        height: 48px;
        border-bottom: 1px solid #f0f0f2;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-title {
          font-weight: 500;
          color: #222226;
          font-size: 16px;
        }
        .card-more {
          font-size: 14px;
          color: #999aaa;
          cursor: pointer;
        }
      }

      & + .side-card {
        margin-top: 10px;
      }
    }
  }
}
</style>
