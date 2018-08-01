<style lang="scss">
    .container {
        padding: 30px;
    }
</style>
<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="比赛信息">
                <span>{{parseTime(match.match_time) }}（{{ match.league_name }}）</span>
            </el-form-item>
            <el-form-item label="比赛球队">
                <el-button-group>
                    <el-button>{{match.home}}</el-button>
                    <el-button>VS</el-button>
                    <el-button>{{match.away}}</el-button>
                </el-button-group>
            </el-form-item>
            <el-form-item label="初始赔率">
                <el-button-group>
                    <el-button>{{match.extra.first_home}}</el-button>
                    <el-button>{{match.extra.first_handicap}}</el-button>
                    <el-button>{{match.extra.first_away}}</el-button>
                </el-button-group>
            </el-form-item>
            <el-form-item label="当前赔率">
                <el-radio-group v-model="radio3">
                    <el-radio-button :label="match.option[0].odds_rate"></el-radio-button>
                    <el-radio-button :label="match.extra.current_handicap" disabled></el-radio-button>
                    <el-radio-button :label="match.option[1].odds_rate"></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="主队情报"
                          align="center">
                <el-table
                    :data="match.home_info"
                    border
                    style="width:100%">
                    <el-table-column
                        prop="info"
                        label="情报id"
                        width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="info"
                        label="情报内容"
                        width="auto">
                        <template slot-scope="scope">
                            <span>{{ scope.row.desc }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作"
                        width="200"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-plus">添加到推荐描述</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item label="客队情报"
                          align="center">
                <el-table
                    :data="match.away_info"
                    border
                    style="width:100%">
                    <el-table-column
                        prop="info"
                        label="情报id"
                        width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="info"
                        label="情报内容"
                        width="auto">
                        <template slot-scope="scope">
                            <span>{{ scope.row.desc }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作"
                        width="200"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-plus">添加到推荐描述</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="推荐标题">
                <el-input placeholder="请输入推荐标题" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="推荐理由">
                <el-input type="textarea" placeholder="请输入推荐理由" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">发起推荐</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {fetchMatchDetail} from '@/api/matchRecommend'
    import {parseTime} from '@/utils'
    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                id: undefined,
                odd_id: undefined,
                analyst_id: 1,
                match: {

                },
                radio3:''
            }
        },
        methods: {
            parseTime,
            onSubmit() {
                console.log('submit!');
            },
            getOddDetail(){
                fetchMatchDetail({
                    odd_id: this.odd_id,
                    analyst_id: 1
                }).then(res => {
                    this.match = res.data
                })
            }
        },
        created(){
            this.odd_id = this.$route.params.id
            this.getOddDetail()
        }
    }
</script>
