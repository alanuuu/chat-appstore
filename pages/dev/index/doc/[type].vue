<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog
      as="div"
      class="fixed inset-0 flex md:hidden"
      @close="sidebarOpen = false"
    >
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="transition ease-in-out duration-300 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      >
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <TransitionChild
            as="template"
            enter="ease-in-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in-out duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="absolute top-20 right-14 -mr-12 pt-2">
              <button
                type="button"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                @click="sidebarOpen = false"
              >
                <span class="sr-only">Close sidebar</span>
                <XIcon class="h-6 w-6 text-blue" aria-hidden="true" />
              </button>
            </div>
          </TransitionChild>
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              />
            </div>
            <nav class="mt-5 px-2 space-y-1">
              <nuxt-link to="#h2" @click="sidebarOpen = false">
                前言
              </nuxt-link>
            </nav>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>

  <div class="md:pl-64 flex flex-col flex-1">
    <div class="sticky top-0 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
      <button
        type="button"
        class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <MenuIcon class="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  </div>

  <div class="bg-white overflow-hidden">
    <div class="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mt-8 lg:grid lg:grid-cols-5 lg:gap-8">
        <div class="hidden md:block relative lg:row-start-1 lg:col-start-1">
          <div
            class="relative text-gray-800 text-base mx-auto max-w-prose lg:max-w-none"
          >
            <ul role="list">
              <li class="cursor-pointer" v-for="(item, index) in titleList">
                <a :href="'#' + item.id">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 lg:mt-0 lg:col-start-2 lg:col-end-5">
          <div class="text-base max-w-prose mx-auto lg:max-w-none">
            <h4></h4>
            <component
              class="mb-4 text-gray-500"
              :is="item.type"
              :id="item.id"
              :src="item.url"
              v-for="(item, index) in list"
            >
              {{ item.text }}
            </component>
          </div>
          <div
            class="mt-5 prose prose-indigo text-gray-500 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue";
import { XIcon, MenuIcon } from "@heroicons/vue/outline";
import { SourceType, SourceMap } from "~~/types";

const sidebarOpen = ref(false);

const docs = {
  [SourceType.prompt]: [
    {
      id: 1,
      type: "h3",
      text: "创建机器人"
    },
    {
      id: 2,
      type: "p",
      text: "填写你的机器人基本信息"
    },
    {
      id: 3,
      type: "img",
      url: "https://cdn-static-devbit.csdn.net/appstore/imgs/Snipaste_2023-03-29_16-35-25.png"
    },
    {
      id: 4,
      type: "h3",
      text: "测试机器人"
    },
    {
      id: 5,
      type: "h3",
      text: "提交机器人"
    }
  ],
  [SourceType.doc]: [
    {
      id: 1,
      type: "h3",
      text: "创建文档机器人"
    },
    {
      id: 2,
      type: "p",
      text: "填写你的文档基本信息"
    },
    {
      id: 3,
      type: "img",
      url: "https://cdn-static-devbit.csdn.net/appstore/imgs/Snipaste_2023-03-29_16-53-03.png"
    },
    {
      id: 4,
      type: "h3",
      text: "测试文档机器人"
    },
    {
      id: 5,
      type: "h3",
      text: "提交机器人"
    }
  ],
  [SourceType.app]: [
    {
      id: 1,
      type: "h3",
      text: "申请开发者token"
    },
    {
      id: 2,
      type: "p",
      text: "每个开发者拥有一个独立的token"
    },
    {
      id: 3,
      type: "img",
      url: "https://cdn-static-devbit.csdn.net/appstore/imgs/Snipaste_2023-03-29_16-53-03.png"
    },
    {
      id: 4,
      type: "h3",
      text: "测试文档机器人"
    },
    {
      id: 5,
      type: "h3",
      text: "提交机器人"
    }
  ]
};

const route = useRoute();
const type = route.params.type;

console.log(type);

const list = computed(() => docs[type]);
const titleList = computed(() => {
  return list.value.filter(item => item.type === "h3");
});
</script>

<style lang="scss" scoped>
h3 {
  font-size: 20px;
  color: #1c1c28;
}
img {
  max-width: 520px;
}
</style>
