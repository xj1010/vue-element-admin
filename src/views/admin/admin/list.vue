<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="listQuery.username" placeholder="用户名"></el-input>
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
                   @click="showAddAlert">创建用户
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag effect="dark"  :type=" scope.row.status | typeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="最后登入时间" width="110">
        <template slot-scope="scope">
          {{ scope.row.updated_at }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="登入次数" width="110">
        <template slot-scope="scope">
          {{ scope.row.login_num }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="创建时间" width="110">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form :model="userInfo" ref="dataForm" :rules="rules" status-icon>
        <el-form-item label="用户名称:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="userInfo.name" style="width: 250px;" autocomplete="off" maxlength="20"
                    show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="userInfo.email" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="userInfo.mobile" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userInfo.password"   autocomplete="off" style="width: 250px;"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input v-model="userInfo.confirmPassword" autocomplete="off" style="width: 250px;"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="userInfo.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">锁定</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.userInfo.image_url" :src="this.userInfo.image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

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
  import {fetchList, updateInfo, createInfo} from '@/api/admin/admin'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ArticleList',
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
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }

        if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)) {
          return callback(new Error('邮箱非法'));
        }
        callback();
      };

      var getCookie = (cname) => {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        console.log("获取cookie,现在循环")
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          console.log(c)
          while (c.charAt(0) == ' ') c = c.substring(1);
          if (c.indexOf(name) != -1){
            return c.substring(name.length, c.length);
          }
        }
        return "";
      };
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }

        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
          return callback(new Error('手机号非法'));
        }
        callback();
      };

      var validatePass = (rule, value, callback) => {
        if (this.userInfo.password == "" && this.userInfo.confirmPassword == "" && !this.isAdd) {
          callback();
          return true;
        }
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(this.userInfo.password.length<6){
          callback(new Error('密码长度不能小于6位数'));
        } else {
          if (this.confirmPassword !== '') {
            this.$refs.dataForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (this.userInfo.password == "" && this.userInfo.confirmPassword == "" && !this.isAdd) {
          callback();
          return true;
        }
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userInfo.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        action : process.env.NODE_ENV == 'development' ? process.env.VUE_APP_BASE_API+'/upload/file' : 'http://api.web.com/upload/file?token=' + getCookie('Admin-Token'),
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
          email: '',
          mobile: '',
          password: '',
          status: 1,
          confirmPassword: '',
          image_url: '',
          image_path: '',
        },
        rules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {validator: checkMobile, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPassword: [
            {validator: validatePass2, trigger: 'blur'}
          ]

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
            pid : 0,
          };
          this.userInfo = {
            name: '',
            email: '',
            mobile: '',
            password: '',
            status: 1,
            confirmPassword: '',
            image_url : '',
            image_path: '',
          }
        }
      },
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if(res.code == 1000) {
          this.userInfo.image_url = res.data.imageUrl;
          this.userInfo.image_path = res.data.filePath;
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          });
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPng) {
          this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPng) && isLt2M ;
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          console.log(this.list);
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
              "email": this.userInfo.email,
              "mobile": this.userInfo.mobile,
              "password": this.userInfo.password,
              "confirmPassword": this.userInfo.confirmPassword,
              "status": this.userInfo.status,
              "image_path" : this.userInfo.image_path
            }
            console.log(updateObj);
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
        this.userInfo.password = '';
        this.userInfo.confirmPassword = '';
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
