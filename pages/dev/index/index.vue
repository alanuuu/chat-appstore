<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative pb-32 bg-gray-400">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
          alt=""
        />
        <div
          class="absolute inset-0 bg-gray-700 mix-blend-multiply"
          aria-hidden="true"
        />
      </div>
      <div
        class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8"
      >
        <h1
          class="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          AI100 开放平台
        </h1>
        <p class="mt-6 max-w-3xl text-xl text-gray-300">
          成为开发者，发布您的机器人和应用
        </p>
      </div>
    </div>

    <!-- Overlapping cards -->
    <section
      class="-mt-32 max-w-7xl mx-auto relative z-10 pb-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="contact-heading"
    >
      <h2 class="sr-only" id="contact-heading">Contact us</h2>
      <div
        class="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8"
      >
        <div
          v-for="link in supportLinks"
          :key="link.name"
          class="flex flex-col bg-white rounded-2xl shadow-xl"
        >
          <div class="flex-1 relative pt-16 px-6 pb-8 md:px-8">
            <div
              class="absolute top-0 p-5 inline-block bg-indigo-600 rounded-xl shadow-lg transform -translate-y-1/2"
            >
              <component
                :is="link.icon"
                class="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-xl font-medium text-gray-900">{{ link.name }}</h3>
            <p class="mt-4 text-base text-gray-500">{{ link.description }}</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-bl-2xl rounded-br-2xl md:px-8">
            <a
              :href="link.href"
              class="text-base font-medium text-indigo-700 hover:text-indigo-600"
              >立即提交<span aria-hidden="true"> &rarr;</span></a
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import { NewspaperIcon, PhoneIcon, SupportIcon } from '@heroicons/vue/outline'
import { ChatDotRound, Document, Mouse } from "@element-plus/icons-vue";

const supportLinks = [
  {
    name: "提交机器人",
    href: "#",
    description:
      "提交基于Prompt构建的机器人，分享给其他人使用",
    icon: ChatDotRound
    // icon: PhoneIcon,
  },
  {
    name: "提交Doc AI",
    href: "#",
    description:
      "上传文档创建文档机器人",
    icon: Document
    // icon: SupportIcon,
  },
  {
    name: "提交应用",
    href: "#",
    description:
      "提交您的应用",
    icon: Mouse
    // icon: NewspaperIcon,
  }
];

export default {
  setup() {
    return {
      supportLinks
    };
  }
};
</script>
