<!-- 每日登录奖励配置 -->
<template>
    <div class="app-container calendar-list-container">
        <el-row class="num-input">
            <el-col span="5" align="left">
                每日登录弹窗状态


            </el-col>
            <el-col span="5" align="left">
                <el-switch
                    v-model="isOpenPop"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开启"
                    inactive-text="关闭"
                >
                </el-switch>
            </el-col>
        </el-row>
        <el-row class="num-input">
            <el-col span="5" align="left">
                每日登录奖励球票数量


            </el-col>
            <el-col span="5" align="left">
                <el-input-number v-model="giveNums"></el-input-number>
            </el-col>
        </el-row>
        <el-row class="num-input">
            <el-col span="10">
                <el-button type="primary">确认修改</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {fetchList, fetchPv, createArticle, updateArticle} from '@/api/article'
    import waves from '@/directive/waves' // 水波纹指令
    import {parseTime} from '@/utils'


    export default {
        name: 'complexTable',
        directives: {
            waves
        },
        data() {
            return {
                isOpenPop: false,
                giveNums: 1
            }
        },
        created() {

        },
        methods: {}
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .num-input {
        padding: 20px 0;
        text-align: center;
    }
</style>
