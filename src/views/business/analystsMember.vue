<!-- 分析师等级配置 -->
<!-- 用户会员等级配置 -->

<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="等级称号">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="等级图标">
        <template slot-scope="scope">
          <img width="100%" :src="scope.row.icon">
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="1月价格">
        <template slot-scope="scope">
          <span>{{scope.row.monthPrize}}元</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="3月价格">
        <template slot-scope="scope">
          <span>{{scope.row.monthPrize}}元</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="1年价格">
        <template slot-scope="scope">
          <span>{{scope.row.monthPrize}}元</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="免费发单数">
        <template slot-scope="scope">
          <span>{{scope.row.freeNums}}单</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑分析师等级特权" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="等级称号" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
         <el-form-item label="等级图标" prop="icon">
          <uploadImg :imgUrl="temp.icon" @input="uploadImg"></uploadImg>
        </el-form-item>
        <el-form-item label="1月价格（元）" prop="monthPrize">
          <el-input-number v-model="temp.monthPrize"></el-input-number>
        </el-form-item>
        <el-form-item label="3月价格（元）" prop="monthPrize">
          <el-input-number v-model="temp.monthPrize"></el-input-number>
        </el-form-item>
        <el-form-item label="1年价格（元）" prop="monthPrize">
          <el-input-number v-model="temp.monthPrize"></el-input-number>
        </el-form-item>
        <el-form-item label="免费发单数（单）" prop="freeNums">
          <el-input-number v-model="temp.freeNums"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: false, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: false, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 上传图片的组件生成的图片
    uploadImg(url){
      this.temp.icon = url
    },
    getList() {
      this.listLoading = true
      this.list = [
      	{
      		id:1,
      		title:'V1等级',
           icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:0,
      		yearPrize:0,
      		freeNums:1,
      	},{
      		id:2,
      		title:'V2等级',
           icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:88,
      		yearPrize:1888,
      		freeNums:3,
      	},{
			id:3,
      		title:'V3等级',
           icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:188,
      		yearPrize:2888,
      		freeNums:6,
      	},{
			id:4,
      		title:'V4等级',
           icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:288,
      		yearPrize:3888,
      		freeNums:10,
      	},{
			    id:5,
      		title:'V5等级',
           icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:388,
      		yearPrize:4888,
      		freeNums:15,
      	}
      ]
      this.listLoading = false

      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
      })
    },
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
	.tip{
		padding: 20px 0;
	}
</style>
