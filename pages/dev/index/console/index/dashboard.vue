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
    <h3 class="mt-12 text-lg leading-6 font-medium text-gray-900">充值记录</h3>
  </div>
</template>

<script>
const stats = [
  { name: "QPM", stat: "3" },
  { name: "剩余次数", stat: "不限" },
  { name: "剩余天数", stat: "24天" }
];

export default {
  setup() {
    return {
      stats
    };
  }
};
</script>
