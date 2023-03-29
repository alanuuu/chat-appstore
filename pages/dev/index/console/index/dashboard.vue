<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div>
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
              时间
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">编辑</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="person in tableData" :key="person.email">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    class="h-10 w-10 rounded-full"
                    :src="person.image"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">
                    {{ person.name }}
                  </div>
                  <div class="text-gray-500">{{ person.email }}</div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="text-gray-900">{{ person.title }}</div>
              <div class="text-gray-500">{{ person.department }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
                >Active</span
              >
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ person.role }}
            </td>
            <td
              class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
            >
              <nuxt-link class="text-indigo-600 hover:text-indigo-900"
                >刷新<span class="sr-only">, {{ person.name }}</span></nuxt-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt-12 text-lg leading-6 font-medium text-gray-900">充值记录</h3>
  </div>
</template>

<script lang="ts" setup>
const stats = [
  { name: "QPM", stat: "3" },
  { name: "剩余次数", stat: "不限" },
  { name: "剩余天数", stat: "24天" }
];

const tableData = [
  {
    id: 1,
    name: "srgdr-gdthr-uhrwieuwin",
    title: "开发者",
    department: "Optimization",
    email: "lindsay.walton@example.com",
    role: "2023-02-02",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];
</script>
