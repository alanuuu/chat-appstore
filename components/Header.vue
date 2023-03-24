<template>
  <div class="header flex box-border">
    <div class="flex-1 flex">
      <img class="logo" src="@/assets/img/logo-main.png" alt="" />
      <ul class="menu ml-4">
        <li v-for="(item, index) in menu" :key="index">
          <nuxt-link :to="item.pathName">{{ item.name }}</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="menu">
      <li>
        <a @click="login">登录 / 注册</a>
      </li>
    </div>
  </div>
  <Login />
</template>

<script setup lang="ts">
import Login from "./login.vue";
import useStore from "@/store";
const menu = [
  {
    name: "首页",
    pathName: "/"
  },
  {
    name: "机器人广场",
    pathName: "/"
  },
  {
    name: "应用广场",
    pathName: "/"
  },
  {
    name: "排行榜",
    pathName: "/"
  },
  {
    name: "开发者中心",
    pathName: "/"
  }
];

const login = () => {
  useStore().login(true);
};
</script>

<style lang="scss" scoped>
.header {
  height: 54px;
  line-height: 54px;
  background: #2c2c2c;
  overflow: hidden;
  padding: 4px 32px;
  .logo {
    height: 100%;
  }
  .menu {
    display: flex;
    list-style: none;
    li {
      margin-right: 24px;
      width: 104px;
      text-align: center;
      margin: 4px 0;
      line-height: 38px;
      a {
        border-radius: 4px;
        color: #eeeeee;
        display: block;
        width: 100%;
        height: 100%;
        font-size: 14px;
        &:hover {
          background: #5e5e5e;
          color: #fff;
        }
      }
    }
  }
}
</style>
