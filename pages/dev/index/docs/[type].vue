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
            <ul role="list" class="menu-list">
              <li
                :class="['cursor-pointer', 'text-gray-600', item.tag]"
                v-for="(item, index) in list"
              >
                <a :href="'#' + item.props.id">
                  {{ item.children?.[0].value }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 lg:mt-0 lg:col-start-2 lg:col-end-5">
          <div class="text-base max-w-prose mx-auto lg:max-w-none">
            <ContentRenderer class="doc mb-4 text-gray-500" :value="data" />
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
import { XIcon, MenuIcon } from "@heroicons/vue/outline/index";
import { SourceType, SourceMap } from "~~/types";
const sidebarOpen = ref(false);

const route = useRoute();
const type = route.params.type;
const { data } = await useAsyncData("doc", () =>
  queryContent(`/${type}`).findOne()
);

const list = computed(() => {
  const arr = data?.value?.body?.children;
  if (!arr.length) return [];
  return arr.filter(item => /^h(2|3){1}/.test(item.tag));
});

console.log(list);
</script>

<style lang="scss" scoped>
.menu-list {
  position: fixed;
  top: 12rem;
  // margin-top: 4rem;
  li {
    margin: 0.6rem 0;
    &.h2 {
      padding-left: 1.2rem;
      font-size: 16px;
    }
    &.h3 {
      padding-left: 2rem;
      font-size: 15px;
    }
  }
}
:deep(.doc) {
  h1 {
    font-size: 1.6rem;
    color: #2c3e50;
    margin: 4rem 0;
    font-weight: bold;
  }
  h2 {
    font-size: 1.35rem;
    color: #555570;
    margin: 4rem 0 3.2rem;
    font-weight: bold;
  }
  h3 {
    font-size: 1.2rem;
    color: #555570;
    margin: 4rem 0 3.2rem;
    font-weight: bold;
  }
  p {
    margin: 2rem 0;
  }
  img {
    max-width: 520px;
  }
}
</style>
