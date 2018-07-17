<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增广告</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
    :default-sort = "{prop: 'banner_no', order: 'ascending'}"
      style="width: 100%">
      <el-table-column align="center" prop="id" label="广告id" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="排序" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column width="auto" class="img-show" align="center" label="展示图片">
        <template slot-scope="scope">
          <img :src="scope.row.img_url">
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="跳转页面">
        <template slot-scope="scope">
          <span>{{scope.row.name || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="跳转链接">
        <template slot-scope="scope">
          <span>{{scope.row.url || '无'}}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column width="150px" align="center" label="跳转参数">
        <template slot-scope="scope">
          <span>{{scope.row.params || '无'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="150px" align="center" label="是否可用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '可用' : '不可用'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" :type="scope.row.status ? 'danger' : ''" @click="handleModifyStatus(scope.row,!scope.row.status)">{{ scope.row.status == 1 ? '冻结' : '启用' }}
          </el-button>
          <!-- <el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="广告图片" prop="img_url">
          <uploadImg :imgUrl="temp.img_url" @input="uploadImg"></uploadImg>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="temp.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="temp.url"  value="请输入跳转链接"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchAdvister, createAdvister, updateAdvister,deleteAdvister } from '@/api/advister'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  components:{
    uploadImg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑广告',
        create: '新增广告'
      },
      temp:{
        id: undefined,
        page_id: '1',
        img_url:'',
        url:'',
        sort: 0,
        status: 1,
        params: 0
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: false, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: false, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: false, message: 'title is required', trigger: 'blur' }]
      },
    }
  },
  created() {
      this.getList()
  },
  methods: {
    // 上传图片的组件生成的图片
    uploadImg(url){
        this.temp.img_url = url
    },
    // 获得全部的列表
    getList() {
        this.listLoading = true
        this.listLoading = false
        fetchList(this.listQuery).then(response => {
            this.list = response.data.data.list
            this.total = response.data.data.meta.total
            this.listLoading = false
        })
    },
    // 修改当前行的状态
    handleModifyStatus( row ) {
      deleteAdvister( row ).then( res => {
          this.getList();
          this.$message({
            message: '操作成功',
            type: 'success'
          })
      } )
    },

    resetTemp() {
        this.temp = {
            id: undefined,
            page_id: '1',
            img_url:'',
            url:'',
            sort: 0,
            status: 1,
            params: 0
        }
    },

    // 新增数据初始化
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
      })
    },

    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAdvister(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 设置当前编辑窗口
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
      })
    },

    // 模拟更新数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAdvister(tempData).then(() => {
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 格式化Json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .banner-rules{
    padding: 20px 0;
  }
  .title{
    padding-bottom: 20px;
  }
  img{
    width: 100%;
  }
</style>
