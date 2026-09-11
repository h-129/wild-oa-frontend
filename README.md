# Wild OA 协同办公系统 - 前端项目

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue3" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Element--Plus-2.14+-409EFF?style=flat-square&logo=element-plus&logoColor=white" alt="Element Plus" />
  <img src="https://img.shields.io/badge/Pinia-4.x-FFD443?style=flat-square&logo=vuedotjs&logoColor=black" alt="Pinia" />
  <img src="https://img.shields.io/badge/Vue--Router-4.x-35495E?style=flat-square&logo=vue.js&logoColor=white" alt="Vue Router" />
  <img src="https://img.shields.io/badge/WindiCSS-3.5+-48B0F1?style=flat-square&logo=windi-css&logoColor=white" alt="WindiCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
</p>

## 📖 项目简介

**Wild OA** 是一款基于 **Vue 3 + Vite + Element Plus** 构建的现代化轻量级协同办公（OA）系统。

目前已完成底层核心的 **RBAC（基于角色的访问控制）权限管理系统** 架构与实现，包含动态路由加载、侧边栏菜单根据权限动态生成、按钮级权限控制指令以及完整的用户/角色/菜单管理功能。该阶段已完成归档，后续将逐步集成流程审批、考勤办公等 OA 核心业务模块。

---

## 🛠️ 技术栈

| 领域 / 依赖 | 选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | [Vue 3](https://vuejs.org/) | 采用 `<script setup>` Composition API 语法糖 |
| **构建工具** | [Vite](https://vitejs.dev/) | 极速的热重载与构建工具 |
| **UI 组件库** | [Element Plus](https://element-plus.org/) | 现代化 Vue 3 桌面端 UI 组件库 |
| **路由管理** | [Vue Router 4](https://router.vuejs.org/) | 支持 Hash 模式、全局路由拦截与动态路由载入 |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) | 新一代 Vue 状态管理库 |
| **持久化存储** | [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) | Pinia 状态持久化插件（用于 Token 及用户数据） |
| **网络请求** | [Axios](https://axios-http.com/) | 统一封装请求拦截、响应拦截、错误统一提示与全局 Loading |
| **样式工具** | [WindiCSS](https://windicss.org/) / [Sass](https://sass-lang.com/) | 实用优先的高效 CSS 处理方案 |
| **工具库** | [@vueuse/core](https://vueuse.org/) | Vue Composition API 常用工具集 |
| **滑动验证码** | [vue3-puzzle-vcode](https://github.com/Kevin988/vue3-puzzle-vcode) | 交互式拼图滑块验证码 |
| **加载进度条** | [NProgress](https://ricostacruz.com/nprogress/) | 页面切换全局顶部加载进度条 |

---

## 🚀 已实现功能（RBAC 权限管理体系）

### 1. 认证与登录 (Authentication)
- [x] 账号密码登录与表单校验
- [x] 图形拼图滑块验证码校验防刷机制
- [x] Token 鉴权机制与 Pinia 状态持久化
- [x] 退出登录与用户状态清理

### 2. 用户管理 (User Management)
- [x] 用户列表分页查询与多维度条件检索（用户名、昵称等）
- [x] 用户的增、删、改、查
- [x] 用户状态快速启用 / 禁用切换
- [x] 用户角色分配与绑定

### 3. 角色管理 (Role Management)
- [x] 角色列表分页与模糊搜索
- [x] 角色增删改查
- [x] 角色权限分配（基于树形结构的菜单与按钮权限点勾选）

### 4. 菜单与权限管理 (Menu Management)
- [x] 支持 **目录 / 菜单 / 按钮** 三级权限模型
- [x] 组件路径配置、权限标识（如 `sys:user:edit`）、图标及排序规则维护
- [x] 树形表格多级展示与节点增删改

### 5. 权限控制系统 (Access Control)
- [x] **页面路由拦截**：全局前置守卫 `beforeEach` 拦截未登录状态；登录后拉取权限并利用 `import.meta.glob` 递归动态挂载路由（`router.addRoute`）
- [x] **侧边栏动态菜单**：根据后端返回的菜单结构自动过滤并渲染左侧导航菜单
- [x] **按钮级权限指令**：封装全局自定义指令 `v-permission="['sys:user:add']"`，自动销毁无权操作的 DOM 节点
- [x] **标签页导航 (TagList)**：支持多页面标签展示、激活切换、关闭当前/其他页面

---

## 📁 目录结构

```text
wild-oa-frontend/
├── public/                 # 静态公共资源
├── src/
│   ├── api/                # 接口请求模块（按业务划分 auth/user/role/menu 等）
│   ├── assets/             # 图片、静态资源
│   ├── components/         # 全局通用组件
│   ├── directives/         # 自定义指令（如 v-permission 按钮权限控制）
│   ├── layouts/            # 基础后台布局框架（Header、Menu、TagList、Footer）
│   ├── router/             # 路由配置与动态路由注册逻辑
│   ├── store/              # Pinia 状态管理库（用户信息、菜单缓存等）
│   ├── utils/              # 通用工具函数（Axios 封装、全局 Loading、通知提示等）
│   ├── views/              # 页面视图组件
│   │   ├── system/         # 系统管理（UserManage, RoleManage, MenuManage）
│   │   ├── Login.vue       # 登录页
│   │   ├── Index.vue       # 首页仪表盘
│   │   ├── About.vue       # 关于页
│   │   └── 404.vue         # 404 缺省页
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   └── permission.js       # 全局路由守卫与权限拦截控制
├── index.html              # 入口 HTML
├── package.json            # 依赖与脚本定义
├── vite.config.js          # Vite 配置文件（含代理与别名设置）
└── README.md               # 项目说明文档
```

---

## 💻 快速开始

### 1. 环境准备
确保本机已安装 [Node.js](https://nodejs.org/) (建议版本 `>= 18.x`) 与包管理器（`npm`、`yarn` 或 `pnpm`）。

### 2. 安装依赖
```bash
# 克隆仓库
git clone <your-repository-url>

# 进入项目目录
cd wild-oa-frontend

# 安装项目依赖
npm install
```

### 3. 开发环境运行
```bash
npm run dev
```
启动成功后，浏览器访问控制台提示的地址（默认 `http://localhost:3270`）。

> **接口代理配置**：可在 `vite.config.js` 中的 `server.proxy` 配置后端 API 服务的联调地址（默认代理至 `http://localhost:8263/api`）。

### 4. 项目打包构建
```bash
npm run build
```
构建产物将输出到 `dist` 目录，可直接部署至 Nginx 或各类 Web 静态托管服务。

---

## 🗺️ 后续开发计划 (Roadmap)

- [ ] **流程审批中心**：请假、出差、报销等常用 OA 流程发起与审批流
- [ ] **组织与部门架构**：部门层级管理、岗位分配与员工关联
- [ ] **公告与通知中心**：系统公告发布、未读消息通知与弹窗推送
- [ ] **日程与考勤打卡**：员工考勤统计、打卡记录、工作日程日历
- [ ] **数据大屏与报表**：OA 运营数据统计、图表分析看板

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

