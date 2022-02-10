<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="角色名称">
        <el-select v-model="listQuery.role_id" placeholder="请选择" @change="onChangeRole">
          <el-option v-for="item in roleOptionList" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary"  @click="createData">添加</el-button>
      </el-form-item>
    </el-form>
    <div><ul id="treeDemo" class="ztree"></ul></div>
  </div>
</template>
<script>
  import "@/libs/zTree/js/jquery-1.4.4.min.js";
  import "@/libs/zTree/js/jquery.ztree.core.min.js";
  import "@/libs/zTree/js/jquery.ztree.excheck.min.js";
  import "@/libs/zTree/css/zTreeStyle/zTreeStyle.css";
  import { fetchList, createInfo } from '@/api/admin/role_user'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Sticky from '@/components/Sticky'

  export default {
    name: 'role_node',
    components: { Pagination,Sticky},
    directives: { waves },
    data(){
      return {
        listQuery: {
          role_id: "",
        },
        roleOptionList: [],
        zNodes:[],
        treeObj:{},
        setting:{
          check: {
            enable: true
          },
          data: {
            key: {
              name:'name',
            },
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: this.onClick
          }
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      onChangeRole(){
        this.getList();
      },
      ztreeInit(){
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      },
      expandAll(){
        this.treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        this.treeObj.expandAll(true);
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.roleOptionList = response.data.roleOptionList;
          this.zNodes = response.data.tree;
          this.ztreeInit();
          this.expandAll();
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      createData() {
        if(this.listQuery.role_id == "") {
          this.$message({
            message: '请选择角色！',
            type: 'error'
          });
          return false;
        }

        var uids = [];
        var nodes = $.fn.zTree.getZTreeObj("treeDemo").getCheckedNodes(true);
        for(var i = 0; i < nodes.length; i++) {
          uids.push(nodes[i].id)
        }
        if(uids.length  == 0) {
          this.$message({
            message: '请选择用户！',
            type: 'error'
          });
          return false;
        }
        var parmasObj = new URLSearchParams();
        parmasObj.append("role_id", this.listQuery.role_id)
        parmasObj.append("uids_str", uids.join(","))

        createInfo(parmasObj).then( () => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        });

      },
    },
    mounted() {
    }
  };
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
  .card-header{
    height: 49px;
    text-indent: 20px;
    line-height: 52px;
    font-size: 14px;
  }
  .components-container div {
    margin: 10px;
  }
  .pagination-container {
    padding: 0px;
  }

  .time-container {
    display: inline-block;
  }
  .icon i { font-size: 26px;cursor:pointer}
</style>
