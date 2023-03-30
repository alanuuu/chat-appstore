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
const props = defineProps({
  key: {
    type: String,
    default: ""
  }
});
const emits = defineEmits(["submit"]);

const upload = (file: File) => {
  console.log(file);
  api
    .get_card_up_url({
      aspect: props.key
    })
    .then(({ data: res }) => {
      console.log(res);
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
