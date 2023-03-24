<template>
  <h2 class="mt-16 text-center text-2xl">用户注册</h2>
  <div class="min-h-full flex flex-col justify-center py-6 sm:px-6 lg:px-6">
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
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" />
          </el-form-item>
          <el-form-item label="手机号" prop="telNumber">
            <el-input maxlength="11" v-model="form.telNumber" />
          </el-form-item>
          <el-form-item label="验证码" prop="msgCode">
            <div class="flex w-full">
              <el-input class="flex-1 mr-2" v-model="form.msgCode" />
              <el-button
                :disabled="btnDisabled"
                class="w-28"
                @click="getCode"
                >{{ btnText }}</el-button
              >
            </div>
          </el-form-item>
          <el-form-item prop="rule">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  v-model="form.rule"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-gray-600"
                >
                  我已阅读并同意AI100使用协议
                </label>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="mt-6">
          <button
            @click="submitForm"
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            注 册
          </button>
        </div>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500"> 已有账号 </span>
            </div>
          </div>
          <div class="mt-6">
            <a
              href="#"
              @click="login"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="">立即登录</span>
            </a>
          </div>
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
  ElDialog,
  ElNotification
} from "element-plus";
import useStore from "@/store";
import api from "@/api";
import { useMsg } from "@/assets/hooks";
import { qs } from "@/assets/utils";

const store = useStore();

const form = reactive({
  username: "",
  telNumber: "",
  password: "",
  confirmPassword: "",
  msgCode: "",
  rule: false
});

const rules = {
  username: [
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "用户名只能填写字母数字或下划线",
      trigger: "blur"
    },
    {
      required: true,
      trigger: "blur",
      validator: (rule: any, value: string, callback: () => void) => {
        if (value.trim() === "") {
          callback(new Error("请输入用户名"));
        } else {
          api
            .isUserNameUsed({
              username: value
            })
            .then(({ data: res }) => {
              console.log(res);
              if (res.data) {
                callback(new Error("用户名已被注册"));
              } else {
                callback();
              }
            });
        }
      }
    }
  ],
  telNumber: [
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    },
    {
      trigger: "blur",
      required: true,
      validator: (rule: any, value: string, callback: () => void) => {
        if (value.trim() === "") {
          callback(new Error("请输入手机号"));
        } else {
          api
            .isTelUsed({
              telNumber: value
            })
            .then(({ data: res }) => {
              console.log(res);
              if (res.data) {
                callback(new Error("手机号已被注册"));
              } else {
                callback();
              }
            });
        }
      }
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6到20个字符之间", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6到20个字符之间", trigger: "blur" },
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: () => void) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== form.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      }
    }
  ],
  rule: [
    {
      required: true,
      pattern: /^true$/,
      message: "请阅读并同意用户使用协议",
      trigger: "change"
    }
  ],
  msgCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
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
  formEl.value.validateField(["telNumber"]).then((valid: boolean) => {
    if (!valid) return false;
    getMsgCode(form.telNumber);
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
