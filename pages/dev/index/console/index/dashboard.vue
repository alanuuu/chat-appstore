<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div v-if="!tokenInfo">
    <h3 class="text-lg leading-6 font-medium text-gray-900">我的资源</h3>
    <div class="text-center mt-40">
      <!-- <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg> -->
      <KeyIcon class="text-gray-500 w-10 h-10 m-auto mb-6" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无Token</h3>
      <p class="mt-1 text-sm text-gray-500">点击免费申请开发者Token</p>
      <div class="mt-6">
        <button
          @click="getToken"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
          申请Token
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <h3 class="text-lg leading-6 font-medium text-gray-900">我的资源</h3>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div
        v-for="item in stats"
        :key="item.name"
        class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
      >
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{ item.name }}
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ item.stat }}
        </dd>
      </div>
    </dl>
    <h3 class="mt-12 text-lg leading-6 font-medium text-gray-900">Token</h3>
    <div
      class="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
    >
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              名称
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              描述
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              状态
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              过期时间
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">编辑</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="info in tableData" :key="info.email">
            <td class="py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <KeyIcon class="text-gray-500 w-10 h-10" />
                </div>
                <div class="ml-4 flex-1">
                  <div
                    class="flex w-full align-center font-medium text-gray-900"
                  >
                    <span class="max-w-md text-ellipsis overflow-hidden">
                      {{ info.name }}
                    </span>
                    <CopyDocument
                      @click="copyToken"
                      class="cursor-pointer inline-block text-gray-500 w-5 h-5"
                    />
                  </div>
                  <div class="text-gray-500">{{ info.email }}</div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="text-gray-900">{{ info.title }}</div>
              <div class="text-gray-500">{{ info.department }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
                >Active</span
              >
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ info.role }}
            </td>
            <td
              class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
            >
              <nuxt-link class="text-indigo-600 hover:text-indigo-900"
                >刷新<span class="sr-only">, {{ info.name }}</span></nuxt-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <h3 class="mt-12 text-lg leading-6 font-medium text-gray-900">充值记录</h3> -->
  </div>
</template>

<script lang="ts" setup>
import { PlusIcon, KeyIcon } from "@heroicons/vue/solid/index";
import { ElNotification } from "element-plus";
import { CopyDocument } from "@element-plus/icons-vue";
import {
  getTimeFromNow,
  copyToClipboard,
  formatDateTime
} from "@/assets/utils";
import api from "@/api";

type TokenInfo = DevToken | null;
const tokenInfo = ref<TokenInfo>(null);

const getTokenInfo = () => {
  api.getTokenInfo({}).then(({ data: res }) => {
    tokenInfo.value = res.data;
    console.log(res.data);
  });
};

onMounted(() => {
  getTokenInfo();
});

const getToken = () => {
  api.get_token_for_free({}).then(({ data: res }) => {
    if (res.code !== 200) return;
    ElNotification.success(res.msg);
    getTokenInfo();
  });
};

const copyToken = () => {
  copyToClipboard(tokenInfo.value?.value as string);
};

const stats = computed(() => {
  if (!tokenInfo.value) return null;
  return [
    { name: "QPM", stat: tokenInfo.value.maxQpm || 3 },
    { name: "剩余次数", stat: tokenInfo.value.remainCalls || "不限" },
    { name: "剩余时间", stat: getTimeFromNow(tokenInfo.value.expTime) }
  ];
});

const tableData = computed(() => {
  return [
    {
      id: 1,
      name: tokenInfo.value?.value,
      title: "开发者",
      department: "Api Token",
      email: tokenInfo.value?.id,
      role: formatDateTime(tokenInfo.value?.expTime as string),
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];
});
</script>
