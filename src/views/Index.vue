<template>
  <div>首页 {{ uStore.getToken }}

    <el-button v-permission="['sys:user:list']">管理员按钮</el-button>
  </div>
</template>
<script lang="ts" setup>
import {userStore} from "@/store/user/index.js";

const uStore = userStore();
</script>
<style lang="scss" scoped>

</style>