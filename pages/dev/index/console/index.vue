<template>
  <div>
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
              <div class="absolute top-20 right-20 -mr-12 pt-2">
                <button
                  type="button"
                  class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XIcon class="h-6 w-6 text-gray-800" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div class="flex-shrink-0 flex items-center px-4">
                <img
                  class="h-8 w-auto"
                  src="https://tailwindui.com/imgs/logos/workflow-logo-indigo-500-mark-white-text.svg"
                  alt="Workflow"
                />
              </div>
              <nav class="mt-10 px-2 space-y-1">
                <nuxt-link
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  :class="[
                    item.current
                      ? 'bg-indigo-600 text-white'
                      : 'cursor-pointer text-gray-600 hover:bg-indigo-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      item.current
                        ? 'text-gray-300'
                        : 'text-gray-600 group-hover:text-gray-300',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </nuxt-link>
              </nav>
            </div>
          </div>
        </TransitionChild>
        <div class="flex-shrink-0 w-14">
          <!-- Force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-100 shadow"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex-1 flex flex-col min-h-0 bg-white">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav class="mt-16 flex-1 px-2 space-y-1">
            <nuxt-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                item.current
                  ? 'bg-indigo-600 text-white'
                  : 'cursor-pointer text-gray-800 hover:bg-indigo-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current
                    ? 'text-gray-300'
                    : 'text-gray-800 group-hover:text-gray-300',
                  'mr-3 flex-shrink-0 h-6 w-6'
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </nuxt-link>
          </nav>
        </div>
      </div>
    </div>
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
      <main class="flex-1">
        <div class="p-6">
          <NuxtPage></NuxtPage>
        </div>
      </main>
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
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon
} from "@heroicons/vue/outline/index";
import { SourceType } from "~~/types";

const route = useRoute();
const type = ref("");
watch(
  () => route.params.type,
  val => {
    console.log(val);
    val & (type.value = val);
  },
  {
    immediate: true
  }
);

const navigation = computed(() => {
  return [
    {
      name: "我的资源",
      href: "/dev/console/dashboard",
      icon: HomeIcon,
      current: !type.value || type.value === "dashboard"
    },
    {
      name: "我的机器人",
      href: `/dev/console/${SourceType.prompt}`,
      icon: UsersIcon,
      current: type.value === SourceType.prompt
    },
    {
      name: "我的文档",
      href: `/dev/console/${SourceType.doc}`,
      icon: InboxIcon,
      current: type.value === SourceType.doc
    },
    {
      name: "我的应用",
      href: `/dev/console/${SourceType.app}`,
      icon: FolderIcon,
      current: type.value === SourceType.app
    }
  ];
});
const sidebarOpen = ref(false);
</script>
