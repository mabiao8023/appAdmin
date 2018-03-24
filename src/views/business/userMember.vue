<!-- 用户会员等级配置 -->

<template>
  <div class="app-container calendar-list-container">
   <!--  <div class="filter-container">
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
     </el-input>
     <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
       <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
       </el-option>
     </el-select>
     <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
       <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
       </el-option>
     </el-select>
     <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
       <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
       </el-option>
     </el-select>
     <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
     <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
     <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
     <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>
   </div>
    -->
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
      <el-table-column min-width="100px" align="center" label="包月价格">
        <template slot-scope="scope">
          <span>{{scope.row.monthPrize}}元</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="包年价格">
        <template slot-scope="scope">
          <span>{{scope.row.yearPrize}}元</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="免费查看单数">
        <template slot-scope="scope">
          <span>{{scope.row.freeNums}}单</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="课程购买折扣">
        <template slot-scope="scope">
          <span>{{scope.row.classDiscount}}折</span>
        </template>
      </el-table-column>   
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!--  <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog title="编辑用户会员特权" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="等级称号" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="包月价格（元）" prop="monthPrize">
          <el-input-number v-model="temp.monthPrize"></el-input-number>
        </el-form-item>
        <el-form-item label="包年价格（元）" prop="yearPrize">
          <el-input-number v-model="temp.yearPrize"></el-input-number>
        </el-form-item>
        <el-form-item label="免费查看单数（单）" prop="freeNums">
          <el-input-number v-model="temp.freeNums"></el-input-number>
        </el-form-item>
        <el-form-item label="课程购买折扣（折）" prop="classDiscount">
          <el-input-number v-model="temp.classDiscount"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

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
    getList() {
      this.listLoading = true
      this.list = [
      	{
      		id:1,
      		title:'大众会员',
          icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:0,
      		yearPrize:0,
      		freeNums:1,
      		classDiscount:10,
      	},{
      		id:2,
      		title:'黄金会员',
          icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:88,
      		yearPrize:1888,
      		freeNums:3,
      		classDiscount:9.5,	
      	},{
			id:3,
      		title:'铂金会员',
          icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:188,
      		yearPrize:2888,
      		freeNums:6,
      		classDiscount:9,	
      	},{
			id:4,
      		title:'钻石会员',
          icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:288,
      		yearPrize:3888,
      		freeNums:10,
      		classDiscount:8.5,	
      	},{
			id:5,
      		title:'至尊会员',
          icon:'https://bpic.588ku.com/element_pic/16/11/24/b0ac4be1899c36a634973f9a0276e599.jpg!/fw/254/quality/90/unsharp/true/compress/true',
      		monthPrize:388,
      		yearPrize:4888,
      		freeNums:15,
      		classDiscount:8,	
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
