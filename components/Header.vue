<template>
  <Popover as="header" class="relative">
    <div class="bg-gray-900 py-3">
      <nav
        class="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
        aria-label="Global"
      >
        <div class="flex items-center flex-1">
          <div class="flex items-center justify-between w-full md:w-auto">
            <nuxt-link to="/">
              <span class="sr-only">Workflow</span>
              <img
                class="h-full w-auto sm:h-10"
                src="@/assets/img/logo-main.png"
                alt=""
              />
            </nuxt-link>
            <div class="-mr-2 flex items-center md:hidden">
              <PopoverButton
                class="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white"
              >
                <span class="sr-only">Open main menu</span>
                <MenuIcon class="h-6 w-6" aria-hidden="true" />
              </PopoverButton>
            </div>
          </div>
          <div class="hidden space-x-8 md:flex md:ml-10">
            <nuxt-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-base font-medium text-white hover:text-gray-300"
            >
              <span>{{ item.name }}</span>
            </nuxt-link>
          </div>
        </div>
        <!-- Search section -->
        <div class="flex justify-center lg:justify-end">
          <div class="w-full px-2 lg:px-6">
            <label for="search" class="sr-only">搜索</label>
            <div class="relative text-indigo-200 focus-within:text-gray-400">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <SearchIcon class="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                class="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-indigo-400 bg-opacity-25 text-indigo-100 placeholder-indigo-200 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
                placeholder="搜索"
                type="search"
              />
            </div>
          </div>
        </div>
        <div class="hidden md:flex md:items-center md:space-x-6">
          <a
            href="#"
            @click="login"
            class="text-base font-medium text-white hover:text-gray-300"
          >
            登录
          </a>
          <nuxt-link
            to="/user/register"
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
          >
            注册
          </nuxt-link>
        </div>
      </nav>
    </div>

    <transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel
        focus
        class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden"
      >
        <div
          class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="px-5 pt-4 flex items-center justify-between">
            <div>
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt=""
              />
            </div>
            <div class="-mr-2">
              <PopoverButton
                class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                <span class="sr-only">Close menu</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </PopoverButton>
            </div>
          </div>
          <div class="pt-5 pb-6">
            <div class="px-2 space-y-1">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                >{{ item.name }}</a
              >
            </div>
            <div class="mt-6 px-5">
              <a
                href="#"
                class="block text-center w-full py-3 px-4 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >Start free trial</a
              >
            </div>
            <div class="mt-6 px-5">
              <p class="text-center text-base font-medium text-gray-500">
                Existing customer?
                <a href="#" class="text-gray-900 hover:underline">登录</a>
              </p>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
  <Login />
</template>
<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { MenuIcon, XIcon } from "@heroicons/vue/outline";
import { SearchIcon } from "@heroicons/vue/solid";
import useStore from "@/store";
import Login from "~~/components/LoginCom.vue";

const store = useStore();

const navigation = [
  { name: "首页", href: "/" },
  { name: "机器人广场", href: "/prompt" },
  { name: "应用广场", href: "/app" },
  { name: "排行榜", href: "/rank" },
  { name: "开发者中心", href: "/dev" }
];

const login = () => {
  store.login(true);
};

// export default {
//   components: {
//     Popover,
//     PopoverButton,
//     PopoverPanel,
//     ChevronRightIcon,
//     MenuIcon,
//     XIcon
//   },
//   setup() {
//     return {
//       navigation
//     };
//   }
// };
</script>
<style lang="scss" scoped></style>
