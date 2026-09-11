<template>
  <el-result
      icon="error"
      sub-title="你找的页面走丢了~"
      title="404提示"
  >
    <template #extra>
      <el-button type="primary" @click="backBtn('/')">回到首页</el-button>
    </template>
  </el-result>
</template>
<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const backBtn = (path) => {
  router.push(`${path}`)
}

</script>

<style lang="scss" scoped>

</style>