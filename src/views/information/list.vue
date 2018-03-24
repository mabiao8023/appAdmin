<!-- 比赛情报列表 -->
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

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

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%"
		@selection-change="handleSelectionChange"
      >
      <el-table-column
	      type="selection"
	      width="55">
	    </el-table-column>
      <el-table-column align="center" label="球队id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.match_id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主队" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.home_flag" width="40px" alt="">
          <div>{{scope.row.home}}</div>
        </template>
      </el-table-column>
       <el-table-column align="center" label="客队" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.away_flag" width="40px" alt="">
          <div>{{scope.row.away}}</div>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="比赛时间">
        <template slot-scope="scope">
          <span>{{scope.row.match_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联赛" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.league_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐方案数" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.orders}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="情报" width="auto">
        <template slot-scope="scope">
          <el-row>
          	<el-col :span="12">
          		<el-button type="danger" @click.stop.prevent="handleShowInformation(scope.row.home_id)">主队情报</el-button>
          	</el-col>	
          	<el-col :span="12">
          		<el-button type="warning" @click.stop.prevent="handleShowInformation(scope.row.away_id)">客队情报</el-button>
          	</el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="150px" :label="$t('table.title')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-button type="primary" @click.stop.prevent="choiceInformation">选为精推情报</el-button>	
      <el-pagination align="right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog title="球队情报信息" :visible.sync="dialogPvVisible">
      这是一些情报信息
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
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
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: [], /* 选中的精推情报列表 */
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
  	/* 选择为精选情报 */
  	choiceInformation (){
  		if ( this.multipleSelection.length ){
  			this.$message({
		        message: '操作成功',
		        type: 'success'
		    })
  		}else{
  			this.$message({
		        message: '请勾选精选情报',
		        type: 'warning'
		    })
  		}
  	},
  	/* 选中的赛事情报信息 */
  	handleSelectionChange( val ){
  		console.log( val ); 
  		this.multipleSelection = val;	
  	},

    getList() {
      this.listLoading = true

      this.list = [{
      	match_id:1,
      	home_id:3,
      	home:'中国',
      	home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
      	away:'韩国',
      	away_id:3,
      	away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
      	match_time:1521904512,
      	orders:1111,
      	league_name:'世界杯'
      },
      {
      	match_id:1,
      	home_id:3,
      	home:'中国',
      	home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
      	away:'韩国',
      	away_id:3,
      	away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
      	match_time:1521904512,
      	orders:1111,
      	league_name:'世界杯'
      },
      {
      	match_id:1,
      	home_id:3,
      	home:'中国',
      	home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
      	away:'韩国',
      	away_id:3,
      	away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
      	match_time:1521904512,
      	orders:1111,
      	league_name:'世界杯'
      }];
        this.total = 10
        this.listLoading = false
      /*fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })*/
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
    /* 显示当前球队不同的情报 */
    handleShowInformation(id) {
    	this.dialogPvVisible = true
    	/* 显示球队情报信息 */
      /*fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })*/
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
