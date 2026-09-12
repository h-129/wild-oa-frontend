<template>
  <div id="menu-container" :style="{width:asideWidth}">
    <el-menu
        :collapse="mStore.getCollapsed"
        :default-active="defaultActive"
        class="!border-0"
        @select="handleSelect"
    >
      <template v-for="(item,index) in menuList" :key="index">
        <!-- 包含子菜单 -->
        <el-sub-menu v-if="item.children&&item.children.length>0" :index="item.name">
          <template v-slot:title>
            <el-icon>
              <!-- 判断：如果图标名字带冒号(如 lucid:settings)说明是 Iconic，否则当成 ElementPlus 组件 -->
              <Icon v-if="item.icon && item.icon.includes(':')" :icon="item.icon"/>
              <component :is="item.icon" v-else/>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!--          遍历子菜单构建-->
          <el-menu-item v-for="(item2,index2) in item.children" :key="index2" :index="item2.path">
            <el-icon>
              <Icon v-if="item2.icon && item2.icon.includes(':')" :icon="item2.icon"/>
              <component :is="item2.icon" v-else/>
            </el-icon>
            <span> {{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!--        无二级菜单-->
        <el-menu-item v-else :index="item.path">
          <template v-slot:title>
            <el-icon>
              <Icon v-if="item.icon && item.icon.includes(':')" :icon="item.icon"/>
              <component :is="item.icon" v-else/>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup>
import {useRoute, useRouter} from "vue-router";
import {menuStore} from "@/store/menu/index.js";
import {computed} from "vue";
import {userStore} from "@/store/user/index.js";

const mStore = menuStore();
const uStore = userStore();
const router = useRouter();
const route = useRoute();
//默认选中
const defaultActive = computed(() => route.path);
//菜单列表
const menuList = computed(() => uStore.getMenus)
//监听菜单激活回调
const handleSelect = (path) => {
  router.push({path: path});
}
//控制菜单的宽度
const asideWidth = computed(() => {
  if (!mStore.getCollapsed) {
    return "250px"
  } else {
    return "60px"
  }
})

</script>
<style lang="scss" scoped>
#menu-container {
  transition: all 0.3s ease-in-out;
  @apply shadow-md fixed top-64px bottom-0 left-0 overflow-y-auto overflow-x-hidden bg-light-50;
}
</style>
