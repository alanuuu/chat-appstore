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
          <el-form-item :label="`${pageTitle}名称`" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item :label="`${pageTitle}图标`" prop="logo">
            <upload key="logo" />
          </el-form-item>
          <el-form-item label="分类" prop="cate">
            <el-select
              class="w-full"
              placeholder="请选择分类"
              v-model="form.cate"
            >
              <el-option :label="1" :value="1"></el-option>
              <el-option :label="2" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" rows="4" v-model="form.desc" />
          </el-form-item>
          <el-form-item
            v-if="type === SourceType.prompt"
            label="Prompt"
            prop="content"
          >
            <el-input type="textarea" rows="6" v-model="form.content" />
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
import { useStore} from "@/store";
import api from "@/api";
import { useMsg } from "@/assets/hooks";
import { qs } from "@/assets/utils";
import { SourceType, SourceMap } from "~~/types";
import upload from "./components/upload.vue";

const store = useStore();
const route = useRoute();

const form = reactive({
  name: "",
  logo: "",
  cate: "",
  desc: "",
  content: ""
});

const rules = {
  name: [
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
  logo: [{ required: false, message: "请上传图标", trigger: "change" }],
  cate: [{ required: true, message: "请选择分类", trigger: "change" }],
  desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
  content: [{ required: true, message: "请输入Prompt", trigger: "blur" }]
};

const formEl = ref<any>(null);
const submitForm = () => {
  formEl.value.validate((valid: boolean) => {
    if (!valid) return false;
    const data = qs(form);
    api.register(data).then(({ data: res }) => {
      console.log(res);
      if (res?.code !== 200) return;
      ElNotification.success("注册成功!");
    });
  });
};

const [type, id] = route.params.rest as SourceType[];

const pageTitle = computed(() => {
  return (id ? "修改" : "提交") + SourceMap[type];
});

// const btnText = ref("获取验证码");
// const btnTime = ref(5);
// const btnDisabled = ref(false);
// const getCode = () => {
//   if (btnDisabled.value) return;
//   api.sendMsg({}).then(({ data: res }) => {
//     console.log(res);
//     btnDisabled.value = true;
//     btnText.value = btnTime.value + "s后重试";
//     let timer = setInterval(() => {
//       btnText.value = --btnTime.value + "s后重试";
//       if (btnTime.value <= 0) {
//         clearInterval(timer);
//         btnText.value = "获取验证码";
//         btnDisabled.value = false;
//         btnTime.value = 5;
//       }
//     }, 1000);
//   });
// };
const { btnText, btnDisabled, getMsgCode } = useMsg();
const getCode = () => {
  formEl.value.validateField(["desc"]).then((valid: boolean) => {
    if (!valid) return false;
    getMsgCode(form.desc);
  });
};

const login = () => {
  store.login(true);
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
