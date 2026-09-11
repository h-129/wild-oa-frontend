import {defineStore} from "pinia";
import {getUserInfo, logout} from "@/api/auth";

export const userStore = defineStore("userStore", {
    state: () => {
        return {
            token: "",
            user: null,
            permissions: [], //权限
            menus: [], //菜单
        };
    },
    getters: {
        getToken(state) {
            return state.token;
        },
        getUserInfo(state) {
            return state.user;
        },
        getPermissions(state) {
            return state.permissions;
        },
        getMenus(state) {
            return state.menus;
        }
    },
    actions: {
        setToken(token) {
            this.token = token;
        },
        setUser(user) {
            this.user = user;
        },
        setPermissions(permissions) {
            this.permissions = permissions;
        },
        setMenus(menus) {
            this.menus = menus;
        },
        //获取用户信息 包含权限和菜单信息
        async fetchUserInfo() {
            let res;
            try {
                res = await getUserInfo()
            } catch (e) {
                throw new Error(e.message);
            }
            const {user, permissions, menus} = res.data;
            this.setUser(user);
            this.setPermissions(permissions);
            this.setMenus(menus);
            return res.data;
        },
        //用户退出登录
        async userLogout() {
            try {
                await logout();
            } catch (e) {
                throw new Error(e.message);
            }
            this.clear()
        },
        clear() {
            this.token = "";
            this.user = null;
            this.permissions = [];
            this.menus = [];
        }
    },
    persist: {
        storage: localStorage,
        pick: ['token'],
    },
});
