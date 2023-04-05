<template>
  <h2 class="mt-16 text-center text-2xl">{{ pageTitle }}</h2>
  <div
    class="min-h-full flex flex-col justify-center py-6 sm:px-6 lg:px-6 lg:mb-16"
  >
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white sm:rounded-lg sm:px-10">
        <el-form
          ref="formEl"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="top"
          class="demo-ruleForm w-full"
          size="large"
        >
          <el-form-item :label="`${pageTitle}名称`" prop="pname">
            <el-input v-model="form.pname" />
          </el-form-item>
          <el-form-item :label="`${pageTitle}图标`" prop="icon">
            <upload :url="uploadUrl" @submit="uploadImg" />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select
              class="w-full"
              placeholder="请选择分类"
              v-model="form.category"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" rows="4" v-model="form.desc" />
          </el-form-item>
          <el-form-item
            v-if="type === SourceType.prompt"
            label="Prompt"
            prop="prompt"
          >
            <el-input type="textarea" rows="6" v-model="form.prompt" />
          </el-form-item>
          <el-form-item
            v-if="type === SourceType.doc"
            label="文档"
            prop="content"
          >
            <el-upload class="upload-demo" :show-file-list="false">
              <el-button size="default" plain type="primary"
                >点击上传</el-button
              >
              <template #tip>
                <div class="el-upload__tip">文档大小不能超过10M</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item
            v-if="type === SourceType.app"
            label="上传应用"
            prop="content"
          >
            <el-upload class="upload-demo" :show-file-list="false">
              <el-button size="default" plain type="primary"
                >点击上传</el-button
              >
              <template #tip>
                <div class="el-upload__tip">文档大小不能超过10M</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="mt-6 flex justify-between">
          <!-- <button
            @click="submitForm"
            type="submit"
            class="w-1/2 mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            测 试
          </button> -->

          <button
            @click="submitForm"
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            提 交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElIcon,
  ElUpload,
  ElDialog,
  ElNotification
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/api";
import { useMsg } from "@/assets/hooks";
import { qs } from "@/assets/utils";
import { SourceType, SourceMap } from "~~/types";
import upload from "./components/upload.vue";

const store = useStore();
const route = useRoute();

const form = reactive({
  pname: "",
  icon: "",
  category: "",
  desc: "",
  prompt: ""
});

const rules = {
  pname: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      message: "名称不能包含特殊符号",
      trigger: "blur"
    }
  ],
  icon: [{ required: false, message: "请上传图标", trigger: "change" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
  prompt: [{ required: true, message: "请输入Prompt", trigger: "blur" }]
};

const [type, id] = route.params.rest as SourceType[];

// 获取分类
const categoryList = ref<Category[]>([]);
const CategoryMap = {
  [SourceType.prompt]: api.get_prompt_category,
  [SourceType.doc]: api.get_prompt_category,
  [SourceType.app]: api.get_prompt_category
};
const getCategory = () => {
  CategoryMap[type]({}).then(({ data: res }) => {
    categoryList.value = res.data;
  });
};

onMounted(() => {
  getCategory();
});

// 提交
const SubmitMap = {
  [SourceType.prompt]: api.submit_prompt,
  [SourceType.doc]: api.submit_prompt,
  [SourceType.app]: api.submit_prompt
};

const formEl = ref<any>(null);
const submitForm = () => {
  formEl.value.validate((valid: boolean) => {
    if (!valid) return false;
    SubmitMap[type](form).then(({ data: res }) => {
      console.log(res);
      if (res.code !== 200) return;
      ElNotification.success(res.msg);
      navigateTo(`/dev/console/${type}`);
    });
  });
};

// 上传图标
const UploadUrlMap = {
  [SourceType.prompt]: api.get_prompt_icon_upload_url,
  [SourceType.doc]: api.get_prompt_icon_upload_url,
  [SourceType.app]: api.get_prompt_icon_upload_url
};
const uploadUrl = computed(() => {
  return UploadUrlMap[type];
});

const pageTitle = computed(() => {
  return (id ? "修改" : "提交") + SourceMap[type];
});

const uploadImg = (url: string) => {
  console.log(url);
  form.icon = url;
};

// definePageMeta({
//   layout: false
// });
</script>

<style lang="scss" scoped>
.el-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
    .el-form-item__label {
      margin-bottom: 4px;
      font-weight: bold;
    }
  }
}
</style>
