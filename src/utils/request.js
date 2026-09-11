import axios from "axios";
import {userStore} from "@/store/user/index.js";
//创建axios配置
const config = {
    baseURL: "/api",
    timeout: 5000,
};
//创建axios实例
const request = axios.create(config);
//请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = userStore().getToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
//响应拦截器
request.interceptors.response.use(
    (response) => {
        const {code, msg} = response.data;
        if (code !== 200) {
            return Promise.reject(msg);
        }
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);
//默认导出
export default request;
