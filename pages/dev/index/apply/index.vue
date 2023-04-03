<template>
  <h2 class="mt-16 text-center text-2xl">申请成为开发者</h2>
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
          <h2 class="font-bold mb-8 text-gray-600">主体信息</h2>
          <el-form-item label="主体类型" prop="type">
            <el-radio-group v-model="form.type" class="ml-4">
              <el-radio label="1" size="large">个人</el-radio>
              <el-radio class="ml-20" label="2" size="large">企业</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="企业名称" prop="type">
            <el-input v-model="form.company" />
          </el-form-item> -->
          <h2 class="font-bold my-8 text-gray-600">联系方式</h2>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="form.realName" />
          </el-form-item>
          <el-form-item label="身份证" prop="cardId">
            <el-input v-model="form.cardId" type="cardId" />
          </el-form-item>
          <el-form-item label="上传身份证" prop="idcardImg">
            <div class="flex w-full">
              <el-upload
                action=""
                :before-upload="e => upload(e, IdCard.front)"
                :multiple="false"
                class="w-1/2 avatar-uploader"
                :show-file-list="false"
              >
                <img
                  v-if="form.idcardImg1"
                  :src="form.idcardImg1"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <el-upload
                action=""
                :before-upload="e => upload(e, IdCard.back)"
                :multiple="false"
                class="ml-2 w-1/2 avatar-uploader"
                :show-file-list="false"
              >
                <img
                  v-if="form.idcardImg2"
                  :src="form.idcardImg2"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item prop="rule">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  v-model="form.rule"
                  id="remember-me"
                  realName="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-gray-600"
                >
                  我已阅读并同意开发者注册协议
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
            提 交
          </button>
        </div>
        <!-- <div class="mt-6">
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
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElRadio,
  ElRadioGroup,
  ElNotification,
  ElUpload,
  ElIcon
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/api";
import { qs, imageToBase64 } from "@/assets/utils";
import { IdCard } from "~~/types";
import axios from "axios";
import pick from "lodash.pick";

const store = useStore();

const form = reactive({
  type: "1",
  realName: "",
  cardId: "",
  idcardImg1: "",
  idcardImg2: "",
  // company: "",
  rule: false
});

const rules = {
  realName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      message: "名称不能包含特殊符号",
      trigger: "blur"
    }
  ],

  cardId: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern:
        /^(\d{6})(19|20)(\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])(\d{3})(\d|X|x)$/,
      message: "身份证号格式不正确",
      trigger: "blur"
    }
  ],
  idcardImg: [
    {
      required: true,
      trigger: "change",
      validator: (rule: any, value: string, callback: CallBack) => {
        if (!form.idcardImg1 || !form.idcardImg2) {
          return callback(new Error("请上传身份证正反面"));
        }
        callback();
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
  ]
};

const upload = (file: File, type: IdCard) => {
  api
    .get_card_up_url({
      aspect: type
    })
    .then(({ data: res }) => {
      console.log(res);
      const url = res?.data.replace(/^http/, "https");
      if (!url) return;

      api
        .uploadFile({
          url,
          file
        })
        .then(res => {
          switch (type) {
            case IdCard.front:
              imageToBase64(file, url => {
                form.idcardImg1 = url;
              });
              break;
            case IdCard.back:
              imageToBase64(file, url => {
                form.idcardImg2 = url;
              });
              break;
            default:
              break;
          }
        });
    });
  return false;
};

const formEl = ref<any>(null);
const submitForm = () => {
  formEl.value.validate((valid: boolean) => {
    if (!valid) return false;
    const data = pick(form, ["realName", "cardId"]);
    api.reg_dev(data).then(({ data: res }) => {
      console.log(res);
      if (res?.code !== 200) return;
      ElNotification.success("提交成功，请等待审核");
      navigateTo("/dev/console/dashboard");
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
    .el-upload {
      display: block;
      text-align: center;
    }
  }
  .avatar-uploader .avatar {
    width: 100%;
    height: 122px;
    display: block;
  }
  :deep(.el-upload) {
    width: 100%;
  }
}
</style>
