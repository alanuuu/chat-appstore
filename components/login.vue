<template>
  <client-only>
    <el-dialog v-model="showLogin" title="" width="480px">
      <h2 class="text-center text-2xl">用户登录</h2>
      <div
        class="min-h-full flex flex-col justify-center py-8 pt-0 sm:px-6 lg:px-6"
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
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" />
              </el-form-item>
              <el-form-item v-if="imgSrc" label="验证码" prop="imgCode">
                <div class="flex w-full">
                  <el-input v-model="form.imgCode" />
                  <img
                    @click="getCodeImg"
                    class="ml-2 h-full cursor-pointer rounded-md"
                    :src="imgSrc"
                    alt=""
                  />
                </div>
              </el-form-item>
            </el-form>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-gray-900"
                >
                  记住我
                </label>
              </div>

              <div class="text-sm">
                <nuxt-link to="/user/forget">
                  <a
                    @click="store.login(false)"
                    href="#"
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    忘记密码?
                  </a>
                </nuxt-link>
              </div>
            </div>

            <div class="mt-6">
              <button
                @click="submitForm"
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                登 录
              </button>
            </div>

            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300" />
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500"> 没有账号 </span>
                </div>
              </div>

              <div class="mt-6">
                <nuxt-link to="/user/register">
                  <a
                    @click="store.login(false)"
                    href="#"
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="">立即注册</span>
                  </a>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElNotification,
  ElButton,
  ElDialog
} from "element-plus";
import useStore from "@/store";
import { storeToRefs } from "pinia";
import { qs } from "@/assets/utils";
import api from "@/api";

const store = useStore();
const { showLogin } = storeToRefs(store);

const form = reactive({
  username: "",
  password: "",
  imgCode: ""
});

const rules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6到20个字符之间", trigger: "blur" }
  ],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  imgCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

const formEl = ref<any>(null);
const submitForm = () => {
  formEl.value.validate((valid: boolean) => {
    if (!valid) return false;
    api.login(qs(form)).then(({ data: res }) => {
      if (res.code !== 200) {
        getCodeImg();
        ElNotification.error(res.msg);
        return;
      }
      ElNotification.success("登录成功");
      store.login(false);
    });
  });
};

function fileToBase64(file: Blob, callback: (result: string) => void) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    var result = reader.result as string;
    callback(result);
  };
}

const imgSrc = ref("");
const getCodeImg = () => {
  api.getCodeImg({}).then(({ data: res }) => {
    fileToBase64(res, url => {
      imgSrc.value = url;
    });
  });
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
