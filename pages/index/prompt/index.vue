<template>
  <ul class="box max-w-7xl mx-auto">
    <li
      v-for="person in list"
      :key="person.id"
      class="item col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
    >
      <div class="flex-1 flex flex-col p-8">
        <img
          class="w-32 h-32 flex-shrink-0 mx-auto rounded-full object-cover"
          :src="person.imageUrl"
          alt=""
        />
        <h3 class="mt-6 text-gray-900 text-sm font-medium">
          {{ person.name }}
        </h3>
        <dl class="mt-1 flex-grow flex flex-col justify-between">
          <dt class="sr-only">Role</dt>
          <dd>
            <span
              class="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full"
              >{{ person.name }}</span
            >
          </dd>
          <dt class="sr-only">Title</dt>
          <dd class="text-gray-500 text-sm mt-3">{{ person.desc }}</dd>
        </dl>
      </div>
      <!-- <div>
        <div class="-mt-px flex divide-x divide-gray-200">
          <div class="w-0 flex-1 flex">
            <a
              :href="`mailto:${person.name}`"
              class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
            >
              <MailIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span class="ml-3">Email</span>
            </a>
          </div>
          <div class="-ml-px w-0 flex-1 flex">
            <a
              :href="`tel:${person.name}`"
              class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
            >
              <PhoneIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span class="ml-3">Call</span>
            </a>
          </div>
        </div>
      </div> -->
    </li>
  </ul>
</template>
<script setup lang="ts">
import { MailIcon, PhoneIcon } from "@heroicons/vue/solid/index";
const list = new Array(29).fill(0).map((item, index) => {
  return {
    id: index,
    imageUrl:
      "https://cdn-static-devbit.csdn.net/appstore/imgs/Snipaste_2023-03-29_16-35-25.png",
    name: "测试机器人",
    desc: "测试机器人".repeat(Math.floor(Math.random() * 30) + 1)
    // height: Math.floor(Math.random() * 300) + 100 + "px"
  };
});
</script>
<style lang="scss" scoped>
.box {
  column-count: 4;
  column-gap: 1rem;
}
.item {
  break-inside: avoid;
  margin-bottom: 1rem;
  border: 2px solid #fff;
  border-radius: 4px;
}
</style>
