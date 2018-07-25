<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入订单号" v-model="order_id">
            </el-input>
            <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.payStatus" placeholder="请选择支付状态">
                <el-option v-for="item in payStatus" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="订单id" width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.order_id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="260px" align="center" label="订单类型">
                <template slot-scope="scope">
                    <span>{{scope.row.info}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" label="支付方式">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_type}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="160px" label="支付金额">
                <template slot-scope="scope">
                    <span>{{scope.row.total_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="160px" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time}}</span>
                </template>
            </el-table-column>

            <el-table-column width="160px" align="center" label="支付时间">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_time}}</span>
                </template>
            </el-table-column>
            <el-table-column width="auto" align="center" label="支付状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '已支付' : '未支付'}}</el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="操作" width="200px" class-name="small-padding fixed-width">-->
                <!--<template slot-scope="scope" v-if="scope.row.status == 0">-->
                    <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">同意</el-button>-->
                    <!--<el-button v-if="scope.row.status!='published'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'published')">拒绝-->
          <!--</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { fetchList } from '@/api/orders'
    import waves from '@/directive/waves' // 水波纹指令
    import { parseTime } from '@/utils'

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
                    payStatus: '全部',
                },
                payStatus: ['全部','已支付','未支付'],
                order_id: '',
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
                downloadLoading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = false;
                this.order_id && (this.listQuery.order_id = this.order_id)
                if(this.listQuery.payStatus !== '全部'){
                    this.listQuery.status = this.listQuery.payStatus == '已支付' ? 1 : 0;
                }
                fetchList(this.listQuery).then(response => {
                    this.list = response.data.list
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
                refuseApplication( row ).then( res => {
                    this.getList();
                    this.$message({
                        message: '已拒绝',
                        type: 'success'
                    })
                } )
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
            // 通过申请
            handleUpdate(row) {
                this.temp = Object.assign({}, row)
                const tempData = Object.assign({}, this.temp)
                passApplication(tempData).then(() => {
                    this.getList()
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '同意申请',
                        type: 'success',
                        duration: 2000
                    })
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
