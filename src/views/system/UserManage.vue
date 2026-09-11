<template>
  <div id="user_manage_div">
    <div class="tools_div">
      <el-row :gutter="4">
        <el-col :span="6">
          <el-input v-model="searchModel.username" clearable placeholder="请输入用户名"/>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchModel.nickname" clearable placeholder="请输入昵称"/>
        </el-col>
        <el-col :span="6">
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" type="default" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table_div">
      <el-table :data="pageState.records" border>
        <el-table-column align="center" label="序号" type="index" width="80"/>
        <el-table-column label="用户名" prop="username" width="80"/>
        <el-table-column label="昵称" prop="nickname" width="120"/>
        <el-table-column align="center" label="头像" prop="nickname" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar || systemAvatar"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" prop="gender" width="80">
          <template #default="scope">
            <span v-if="scope.row.gender === 1">男</span>
            <span v-else-if="scope.row.gender === 2">女</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" show-overflow-tooltip width="80"/>
        <el-table-column label="手机号" prop="phone" width="80"/>
        <el-table-column label="描述" prop="description" show-overflow-tooltip width="80"/>
        <el-table-column label="状态" prop="status" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" style="cursor: pointer;">{{
                scope.row.status === 1 ? "正常" : "禁用"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="120"/>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip width="120"/>
        <el-table-column align="center" fixed="right" label="操作" width="320">
          <template #default="scope">
            <el-button :icon="Edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button :icon="Pointer" type="success" @click="handleAssign(scope.row)">分配角色</el-button>
            <el-button :icon="Delete" type="danger" @click="handleDeleteConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      编辑用户弹窗组件-->
      <el-dialog v-model="editDialogState.visible" :title="editDialogState.title" :width="editDialogState.width">
        <el-form ref="formRef" :model="formModel" label-position="right" label-width="100px">
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="formModel.username" clearable disabled placeholder="请输入用户名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="formModel.nickname" clearable placeholder="请输入昵称"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="formModel.phone" clearable placeholder="请输入手机号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="formModel.email" clearable placeholder="请输入邮箱"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formModel.gender">
                  <el-radio :value="1">男</el-radio>
                  <el-radio :value="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formModel.status">
                  <el-radio :value="1">正常</el-radio>
                  <el-radio :value="2">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="描述" prop="description">
                <el-input v-model="formModel.description" clearable placeholder="请输入描述" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="handleEditSubmit">确定</el-button>
          <el-button @click="editDialogState.visible = false">取消</el-button>
        </template>
      </el-dialog>
      <!--      分配角色弹框组件-->
      <el-dialog v-model="assignDialogState.visible" :width="assignDialogState.width">
        <template #header>
    <span class="text-lg font-semibold text-gray-800">
      {{ assignDialogState.title }}
    </span>
        </template>
        <el-form :model="formModel" class="pr-4 mt-2" label-position="right" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="formModel.username" class="!w-full" disabled>
              <template #prefix>
                <el-icon>
                  <User/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 分配角色 -->
          <el-form-item label="分配角色">
            <div class="bg-gray-50/80 p-3 rounded-md border border-gray-100 w-full min-h-[80px]">
              <!-- 自动换行，增加横纵间距 -->
              <el-checkbox-group v-model="checkedRoleIds" class="flex flex-wrap gap-y-2 gap-x-3">
                <template v-for="role in roleList" :key="role.id">
                  <el-checkbox
                      :label="role.roleName"
                      :value="role.id"
                      border
                      class="!mr-0 bg-white"
                  />
                </template>
              </el-checkbox-group>
              <!-- 空状态提示（可选），当角色列表未加载出来时显示 -->
              <el-empty v-if="roleList.length === 0" :image-size="40" description="暂无可选角色"/>
            </div>
          </el-form-item>

        </el-form>
        <template #footer>
          <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
          <el-button @click="assignDialogState.visible = false">取消</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="pagination_div">
      <el-pagination
          v-model:current-page="pageState.pageNum"
          v-model:page-size="pageState.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="pageState.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadTableData"
          @current-change="loadTableData"
      />
    </div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import {Delete, Edit, Pointer, Refresh, Search, User} from "@element-plus/icons-vue";
import {assignRole, deleteUser, editUser, getUserList, getUserRoleAssignInfo} from "@/api/user/index.js";
import {ElMessage, ElMessageBox} from "element-plus";
import systemAvatar from "@/assets/avatar.png"

//搜索框model
const searchModel = reactive({
  username: "",
  nickname: "",
})
//分页状态
const pageState = reactive({
  records: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
})
//分配角色对象
const assignRoleModel = reactive({
  userId: "",
  roleIds: []
})
//编辑用户弹窗状态
const editDialogState = reactive({
  visible: false,
  title: "",
  width: "650px",
  type: ""
})
//分配角色弹窗状态
const assignDialogState = reactive({
  visible: false,
  title: "",
  width: "650px",
  type: ""
})
//表单对象
const formModel = reactive({
  id: "",
  username: "",
  nickname: "",
  phone: "",
  email: "",
  gender: "",
  status: "",
  description: "",
});
//表单引用
const formRef = ref(null)
//角色列表
const roleList = ref([])
//选择的角色id集合
const checkedRoleIds = ref([])
//查询
const handleSearch = () => {
  pageState.pageNum = 1
  loadTableData()
}
//重置
const handleReset = () => {
  searchModel.username = ""
  searchModel.nickname = ""
  handleSearch()
}
//编辑
const handleEdit = (row) => {
  editDialogState.visible = true
  editDialogState.title = "编辑用户"
  editDialogState.type = "edit"
  nextTick(() => {
    Object.assign(formModel, row)
  })
}
//分配角色
const handleAssign = async (row) => {
  try {
    Object.assign(formModel, row)
    const queryParam = {
      userId: row.id
    }
    const {data: {allRoleList, checkedRoleIdList}} = await getUserRoleAssignInfo(queryParam)
    roleList.value = allRoleList
    checkedRoleIds.value = checkedRoleIdList
    assignDialogState.visible = true
    assignDialogState.title = "分配角色"
    assignDialogState.type = "assign"
  } catch (e) {
    ElMessage.error(e.message)
  }
}

// 处理删除
const handleDeleteConfirm = async (row) => {
  // 1. 先弹窗确认（若用户点击取消，会直接抛出 'cancel' 异常并被 catch 捕获）
  try {
    await ElMessageBox.confirm("是否删除该用户?", "提示", {type: 'warning'})
  } catch (error) {
    if (error === 'cancel') {
      return ElMessage.info('已取消')
    }
    return
  }

  // 2. 确认删除后，调用后端删除接口
  try {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    await loadTableData() // 删除后刷新表格数据
  } catch (e) {
    ElMessage.error(e.message)
  }
}
//处理编辑用户提交
const handleEditSubmit = async () => {
  try {
    await editUser(formModel)
    ElMessage.success('操作成功')
    editDialogState.visible = false
    await loadTableData()
  } catch (e) {
    ElMessage.error(e.message)
  }
}
//处理分配角色提交
const handleAssignSubmit = async () => {
  try {
    assignRoleModel.userId = formModel.id
    assignRoleModel.roleIds = checkedRoleIds.value
    await assignRole(assignRoleModel)
    ElMessage.success('操作成功')
    assignDialogState.visible = false
    await loadTableData()
  } catch (e) {
    ElMessage.error(e.message)
  }
}
//加载数据
const loadTableData = async () => {
  const queryParams = {
    pageNum: pageState.pageNum,
    pageSize: pageState.pageSize,
    ...searchModel
  }
  try {
    const {data} = await getUserList(queryParams)
    pageState.records = data.records
    pageState.total = data.total
  } catch (e) {
    ElMessage.error(e.message)
  }
}
onMounted(() => {
  loadTableData()
})
</script>
<style lang="scss" scoped>
#user_manage_div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table_div {
  margin-top: 15px;
  flex: 1;
  overflow: hidden;
}

.pagination_div {
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>