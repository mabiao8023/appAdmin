<!-- 每日登录奖励配置 -->
<template>
  <div class="app-container calendar-list-container">
      <el-row class="num-input">
          会员每日登录可奖励球票，每日登录奖励球票
      </el-row> 
      <el-row class="num-input">
        <el-input-number></el-input-number>
      </el-row>
      <el-row class="num-input">
        <el-button type="primary">提交修改</el-button>
        <el-button>取消</el-button>
      </el-row>  
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'



export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
    }
  },
  created() {
  
  },
  methods: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .num-input{
    padding: 40px 0;
    text-align: center;
  }
</style>
