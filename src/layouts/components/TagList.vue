<template>
  <div id="tag-list-div" :style="{left: asideWidth}">
    <!-- 标签列表 -->
    <el-tabs
        v-model="activeTab"
        style="min-width: 100%"
        type="card"
        @tab-remove="handleTabRemove"
    >
      <el-tab-pane
          v-for="item in tabList"
          :key="item.path"
          :closable="item.path!=='/'"
          :label="item.title"
          :name="item.path"
      />
    </el-tabs>
    <!-- 下拉菜单 -->
    <span class="tag-btn">
      <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <el-icon>
        <arrow-down/>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  </span>
  </div>
</template>
<script setup>
import {computed} from 'vue'
import {ArrowDown} from "@element-plus/icons-vue";
import {menuStore} from "@/store/menu/index.js";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const mStore = menuStore()
//选中的标签
const activeTab = computed({
  get() {
    return route.path
  },
  set(val) {
    router.push(val)
  }
})
const tabList = computed(() => {
  return mStore.getTabList
})
// 删除标签
const handleTabRemove = (e) => {
  console.log("删除标签", e)
  let tabs = tabList.value;//获取标签列表
  let activeIndex = activeTab.value;
  //如果当前选中的标签是删除的标签，将选中的标签设置为下一个标签或者上一个
  if (activeIndex === e) {
    tabs.forEach((tab, index) => {
      if (tab.path === e) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeIndex = nextTab.path;
        }
      }
    })
  }
  activeTab.value = activeIndex;
  //删除标签
  mStore.removeTab(e)
}
// 标签列表宽度
const asideWidth = computed(() => {
  if (!mStore.getCollapsed) {
    return "250px";
  } else {
    return "60px"
  }
})
//监听下拉菜单点击事件
const handleCommand = (e) => {
  console.log(e)
  if (e === 'clearOther') {
    let tabs = tabList.value.filter(item => item.path === activeTab.value || item.path === '/');
    mStore.setTabList(tabs)
    //切换为当前选中的标签
    router.push(activeTab.value)
  } else {
    mStore.clearAllTabs()
    //切换为首页
    router.push('/')
  }
}
// 路由更新时触发
onBeforeRouteUpdate((to) => {
  //使用pinia添加标签
  mStore.addTab({
    title: to.meta.title,
    path: to.path,
  })
})
</script>
<style lang="scss" scoped>
#tag-list-div {
  @apply fixed bg-gray-100 flex items-center px-4;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
  transition: all 0.3s ease-in-out;

  :deep(.el-tabs__header) {
    @apply mb-0;
  }

  :deep(.el-tabs__nav) {
    border: 0 !important;
  }

  :deep(.el-tabs__item) {
    line-height: 32px;
    @apply bg-white mx-1 rounded;
  }

  .tag-btn {
    @apply bg-white rounded ml-auto flex items-center justify-center;
    height: 32px;
    width: 32px;
  }
}
</style>