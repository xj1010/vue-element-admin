<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" ref="dataForm1">
      <el-form-item label="角色名">
        <el-input v-model="listQuery.username" placeholder="角色名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="锁定" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="restForm()" >重置</el-button>

      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" type="primary"
                   @click="showAddAlert">创建角色
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      ref="multipleTable"
    >
      <el-table-column align="center" label="ID"  >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column   align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态"  >
        <template slot-scope="scope">
          <el-tag  effect="dark" :type=" scope.row.status | typeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form :model="userInfo" ref="dataForm" :rules="rules" status-icon>
        <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="userInfo.name" style="width: 250px;" autocomplete="off" maxlength="20"
                    show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="userInfo.remark" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-radio-group v-model="userInfo.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="createData('dataForm')" v-if="isAdd">添 加</el-button>
        <el-button type="primary" @click="updateData('dataForm')" v-if="!isAdd">修 改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {fetchList, updateInfo, createInfo} from '@/api/admin/role'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'roleList',
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '正常',
          2: '锁定',
        }
        return statusMap[status]
      },
      typeFilter(status) {
        const statusMap = {
          1: 'success',
          2: 'info',
        }
        return statusMap[status]
      }
    },
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        callback();
      };
      var checkRemark = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('备注不能为空'));
        }
        callback();
      };

      return {
        loading: true,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          username: "",
          status: ""
        },
        dialogFormVisible: false,
        isAdd: false,
        formLabelWidth: '120px',
        userInfo: {
          name: '',
          remark: '',
          status: 1,
        },
        rules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          remark: [
            {validator: checkRemark, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getList()
    },

    watch: {
      dialogFormVisible: function (val, oldVal) {
        if (!val) {
          this.listQuery = {
            page: 1,
            limit: 20,
            username: "",
            status: "",
          };

          this.userInfo = {
            name: '',
            remark: '',
            status: 1,
          }
        }
      },
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },

      restForm() {
        this.listQuery = {
          page: 1,
          limit: 20,
          username: "",
          status: ""
        }

        this.getList();
      },

      showAddAlert() {
        this.dialogFormVisible = true
        this.isAdd = true
      },

      onSubmit() {
        this.getList();
      },

      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createInfo(this.userInfo).then(() => {
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        });
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var updateObj = {
              "id": this.userInfo.id,
              "name": this.userInfo.name,
              "remark": this.userInfo.remark,
              "status": this.userInfo.status
            }
            updateInfo(updateObj).then(() => {
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.getList();
              this.dialogFormVisible = false;
            });
          }
        });
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.$refs['dataForm'].resetFields();
      },
      edit(userInfo) {
        this.isAdd = false;
        this.userInfo = JSON.parse(JSON.stringify(userInfo));
        this.dialogFormVisible = true;
      },
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
