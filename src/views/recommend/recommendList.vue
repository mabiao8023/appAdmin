<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <!-- <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.league_id" placeholder="联赛筛选">
              <el-option v-for="item in leagueList" :key="item" :label="item.league_name" :value="item.id">
              </el-option>
            </el-select> -->
            <!-- <el-date-picker
              v-model="listQuery.date"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker> -->
            <!--      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="推荐id" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.rec_id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分析师id" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.analyst_id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="比赛日期" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.match_time}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联赛" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.league_name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="主队" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.home}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="客队" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.away}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推荐赔率" width="220">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.option[0].id == scope.row.option_id ? 'danger' : 'info'">
                        主胜{{scope.row.option[0].odds_rate}}

                    </el-tag>
                    <el-tag type="info">{{scope.row.extra.current_handicap}}</el-tag>
                    <el-tag :type="scope.row.option[1].id == scope.row.option_id ? 'danger' : 'info'">
                        客胜{{scope.row.option[1].odds_rate}}

                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推荐标题" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.rec_title}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推荐描述" width="auto">
                <template slot-scope="scope">
                    <span>{{scope.row.rec_desc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推荐结果" width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.result == 0" type="info">暂无结果</el-tag>
                    <el-tag v-if="scope.row.result == 1" type="danger">中</el-tag>
                    <el-tag v-if="scope.row.result == 3" type="danger">走</el-tag>
                    <el-tag v-if="scope.row.result == 2" type="info">失</el-tag>
                </template>
            </el-table-column>
            <!--  <el-table-column align="center" label="操作" width="auto" class-name="small-padding fixed-width">
               <template slot-scope="scope">
                 <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                 <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">发布
                 </el-button>
                 <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">冻结
                 </el-button>
                 <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
                 </el-button>
               </template>
             </el-table-column> -->
        </el-table>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="分析师id" prop="type">
                    <el-input v-model="temp.user_id"></el-input>
                </el-form-item>
                <el-form-item label="分析师id" prop="type">
                    <el-input v-model="temp.user_id"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="timestamp">
                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="temp.title"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {fetchReList} from '@/api/matchRecommend'
    import waves from '@/directive/waves' // 水波纹指令
    import {parseTime} from '@/utils'

    const calendarTypeOptions = [
        {key: 'CN', display_name: 'China'},
        {key: 'US', display_name: 'USA'},
        {key: 'JP', display_name: 'Japan'},
        {key: 'EU', display_name: 'Eurozone'}
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
                    date: '2018-05-20',
                    league_id: '',
                    type: undefined,
                    sort: '+id'
                },
                importanceOptions: [1, 2, 3],
                calendarTypeOptions,
                sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
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
                    type: [{required: true, message: 'type is required', trigger: 'change'}],
                    timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
                    title: [{required: true, message: 'title is required', trigger: 'blur'}]
                },
                downloadLoading: false,
                leagueList: [],
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
                this.listLoading = true;

                fetchReList(this.listQuery).then(response => {
                    this.list = response.data.list
                    // this.leagueList = response.data.data.league_list
                    this.total = response.data.meta.total
                    this.listLoading = false
                })
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
