<template>
  <el-row id="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div class="font-bold text-5xl text-light-50 text-shadow-lg mb-4">欢迎小可爱</div>
      <div>Hi~ o(*￣▽￣*)ブ</div>
    </el-col>
    <el-col :lg="8" :md="12" class="right bg-light-50 ">
      <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
      <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
        <span class="login-title"></span>
        <span>账号密码登录</span>
        <span class="login-title"></span>
      </div>
      <el-form ref="formRef" :model="formModel" :rules="rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="formModel.username" clearable placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" placeholder="请输入密码" show-password
                    type="password">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button class="w-[250px]" round type="primary" @click="submitBtn">登录</el-button>
            <Vcode :show="isShow" @close="onClose" @success="onSuccess"/>
            <span class="font-black text-xs my-3px" style="float: right;cursor: pointer">还没有账号?点击注册</span>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {Lock, User} from "@element-plus/icons-vue";
import Vcode from "vue3-puzzle-vcode";
import {userStore} from "@/store/user/index.js";
import {useRouter} from "vue-router";
import {userLogin} from "@/api/auth/index.js";
import {ElMessage} from "element-plus";

const router = useRouter();
const uStore = userStore();
//定义表单对象
const formRef = ref();
//定义表单数据模型
const formModel = reactive({
  username: 'admin',
  password: '123456'
})
//定义表单验证规则
const rules = reactive({
  username: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
    {min: 5, max: 10, message: '用户名长度必须在5-10位之间', trigger: 'blur'},
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ]
})
//弹框式验证框
const isShow = ref(false);
//展示
const onShow = () => {
  isShow.value = true;
};
//关闭
const onClose = () => {
  isShow.value = false;
};
//弹框验证 成功回调
const onSuccess = async () => {
  onClose(); // 验证成功，需要手动关闭模态框
  await handleLogin()
};
//执行登录操作
const handleLogin = async () => {
  try {
    const res = await userLogin(formModel);
    //将token存储起来
    const {token} = res.data;
    uStore.setToken(token);
    ElMessage.success("登录成功")
    //获取用户信息
    await uStore.fetchUserInfo()
    await router.push("/");
  } catch (e) {
    ElMessage.error(e)
  }
}
//登录按钮
const submitBtn = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    onShow()
  })
}
</script>
<style lang="scss" scoped>
#login-container {
  @apply bg-indigo-500 min-h-screen;
  .left, .right {
    @apply flex items-center justify-center flex-col;
    .login-title {
      @apply h-[1px] w-16 bg-gray-200;
    }
  }
}
</style>