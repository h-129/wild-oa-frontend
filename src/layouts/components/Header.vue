<template>
  <div id="header-container">
    <span :style="{width:asideWidth}" class="logo-container">
      <el-icon class="mr-2"><IceDrink/></el-icon>
      <span v-if="!mStore.getCollapsed" class="title">小萌后台</span>
    </span>
    <el-icon class="icon-btn" @click="handleCollapsed">
      <Fold v-if="!mStore.getCollapsed"/>
      <Expand v-else/>
    </el-icon>
    <el-tooltip
        content="点我刷新"
        effect="dark"
        placement="bottom"
    >
      <el-icon class="icon-btn ml-2" @click="handleRefreshRight">
        <RefreshRight/>
      </el-icon>
    </el-tooltip>

    <div class="right-container">
      <el-tooltip
          :content="title"
          effect="dark"
          placement="bottom"
      >
        <el-icon class="mr-6 icon-btn" @click="handleFullEvent">
          <FullScreen v-if="!isFullscreen"/>
          <Aim v-else/>
        </el-icon>
      </el-tooltip>
      <!--      下拉菜单-->
      <el-dropdown @command="handleCommand">
    <span class="flex items-center text-light-50 cursor-pointer">
        <el-avatar :src="avatarUrl"/>
      <span class="ml-2">{{ userNickname }}</span>
      <el-icon>
        <arrow-down/>
      </el-icon>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="editProfile">修改资料</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import {Aim, ArrowDown, Expand, Fold, FullScreen, IceDrink, RefreshRight} from "@element-plus/icons-vue";
import {computed, onMounted} from "vue";
import systemAvatar from "@/assets/avatar.png"
import {userStore} from "@/store/user/index.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";
import {useFullscreen} from "@vueuse/core"; //导入核心包
import {menuStore} from "@/store/menu/index.js";
import {logout} from "@/api/auth/index.js";

const mStore = menuStore()
const {isFullscreen, toggle} = useFullscreen()
const router = useRouter();
const uStore = userStore();
const avatarUrl = computed(() => {
  return uStore.getUserInfo?.avatar || systemAvatar
})
//用户名获取
const userNickname = computed(() => {
  const {nickname} = uStore.getUserInfo || {}
  return nickname || "默认用户";
})
//处理下拉框事件
const handleCommand = (e) => {
  switch (e) {
    case "logout":
      handleLogout()
      break;
    case "editProfile":
      break;
  }
}
//处理刷新事件
const handleRefreshRight = () => {
  window.location.reload()
}
//处理全屏事件
const handleFullEvent = () => {
  toggle()
}
//处理全屏事件的文字提示
const title = computed(() => {
  if (isFullscreen.value) {
    return "退出全屏"
  } else {
    return "进入全屏"
  }
})
//处理侧边栏展开
const handleCollapsed = () => {
  mStore.setCollapsed(!mStore.getCollapsed)
}
//处理退出登录
const handleLogout = async () => {
  try {
    // 1. 等待用户点击“确定”
    await ElMessageBox.confirm("是否要退出登录?", "提示", {type: 'warning'})
    await uStore.userLogout()
    await mStore.clear()
    // 3. 弹出成功提示 (简写形式)
    ElMessage.success('退出登录成功')

    // 4. 跳转回登录页
    await router.push('/login')

  } catch (error) {
    // 用户点击了“取消”会走这里
    ElMessage.info('已取消')
  }
}
//logo区域宽度
const asideWidth = computed(() => {
  if (!mStore.getCollapsed) {
    return "250px";
  } else {
    return "60px"
  }
})
//页面初始化
onMounted(() => {

})

</script>
<style lang="scss" scoped>
#header-container {
  @apply flex items-center bg-indigo-500 text-light-50 fixed top-0 left-0 right-0 h-64px;
  .logo-container {
    transition: all 0.3s ease-in-out;
    @apply flex items-center justify-center w-250px;
    .title {
      @apply text-sm text-stroke-sm;
    }
  }

  .icon-btn {
    @apply cursor-pointer;
  }

  .right-container {
    @apply ml-auto mr-12px flex items-center;
  }
}
</style>