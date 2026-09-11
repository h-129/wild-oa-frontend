import {defineStore} from "pinia";

export const menuStore = defineStore("menuStore", {
    state: () => {
        return {
            collapsed: false,
            tabList: [
                {
                    title: "首页",
                    path: "/"
                }
            ]
        };
    },
    getters: {
        getCollapsed(state) {
            return state.collapsed
        },
        getTabList(state) {
            return state.tabList
        }
    },
    actions: {
        setCollapsed(collapsed) {
            this.collapsed = collapsed
        },
        setTabList(tabList) {
            this.tabList = tabList
        },
        //添加标签
        addTab(tab) {
            let noTab = this.tabList.findIndex(t => t.path === tab.path) === -1
            if (noTab) {
                this.tabList.push(tab)
            }
        },
        removeTab(path) {
            this.tabList = this.tabList.filter(t => t.path !== path)
        },
        //关闭所有标签
        clearAllTabs() {
            this.tabList = [
                {
                    title: "首页",
                    path: "/"
                }
            ]
        },
        clear() {
            this.tabList = [
                {
                    title: "首页",
                    path: "/"
                }
            ]
        }
    },
    persist: {
        storage: sessionStorage,
        pick: ['tabList'],
    }
});
