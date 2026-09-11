<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside :style="{width:asideWidth}" class="aside-div">
        <Menu/>
      </el-aside>
      <TagList/>
      <el-main style="padding-top: 64px">
        <!-- 路由出口 缓存组件 -->
        <router-view v-slot="{Component,route}">
          <transition mode="out-in" name="fade">
            <!-- 缓存组件 -->
            <keep-alive :max="10">
              <component :is="Component" :key="route.path"/>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Header from "@/layouts/components/Header.vue";
import Menu from "@/layouts/components/Menu.vue";
import {menuStore} from "@/store/menu/index.js";
import {computed} from "vue";
import TagList from "@/layouts/components/TagList.vue";

const mStore = menuStore();
const asideWidth = computed(() => {
  if (!mStore.getCollapsed) {
    return "250px"
  } else {
    return "60px"
  }
})
</script>

<style lang="scss" scoped>
.aside-div {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  /* 统一在这里写过渡时间即可 */
  transition: opacity 0.3s ease;
}
</style>