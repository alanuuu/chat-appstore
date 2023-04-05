<template>
  <el-upload
    action=""
    :before-upload="upload"
    :multiple="false"
    class="avatar-uploader"
    :show-file-list="false"
  >
    <img v-if="url" :src="url" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>
<script setup lang="ts">
import api from "@/api";
import { ElUpload, ElIcon } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { imageToBase64 } from "@/assets/utils";
const props = defineProps({
  url: {
    type: Function,
    default: ""
  }
});
const emits = defineEmits(["submit"]);

const upload = (file: File) => {
  props.url({}).then(({ data: res }: { data: any }) => {
    const url = res?.data?.uploadUrl?.replace(/^http/, "https");
    if (!url) return;
    // emits("submit", res?.data?.downloadUrl);
      api
        .uploadFile({
          url,
          file
        })
        .then(res => {
          console.log("url", res);

          imageToBase64(file, url => {
            emits("submit", url);
          });
        });
  });
  return false;
};

const url = ref("");

const submit = emits("submit", url.value);
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
