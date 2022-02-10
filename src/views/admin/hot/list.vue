<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="listQuery.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <el-select v-model="listQuery.site" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="百度" value="百度"></el-option>
          <el-option label="知乎" value="知乎"></el-option>
          <el-option label="新浪微博" value="新浪微博"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="日期" >
        <el-date-picker
          v-model="listQuery.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"  style="width:150px;" >
        </el-date-picker>
        -
        <el-date-picker
          v-model="listQuery.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期" style="width:150px;">
        </el-date-picker>

      </el-form-item>

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="restForm()" >重置</el-button>
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
      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="来源">
        <template slot-scope="scope">
          <span>{{ scope.row.site }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="热度值">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="更新时间" >
        <template slot-scope="scope">
          {{ scope.row.updated_at }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="lookAt(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>

</template>

<script>
  import {fetchList} from '@/api/admin/hot'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'HotList',
    components: {Pagination},
    data() {
      return {
        loading: true,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          title: "",
          site: "",
          startDate : "",
          endDate: "",
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
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
          title: "",
          site: "",
          startDate : "",
          endDate: "",
        }
        this.getList();
      },

      lookAt(row){
        window.open(row.link, "_blank");
      },
      onSubmit() {
        this.getList();
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
