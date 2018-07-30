import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: '图形数据',
      meta: { title: '图形数据', icon: 'dashboard', noCache: true }
    }]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: _import('documentation/index'),
  //     name: '操作文档',
  //     meta: { title: '操作文档', icon: 'documentation', noCache: true }
  //   }]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
      path: '/business',
      component: Layout,
      redirect: 'noredirect',
      name: '业务配置',
      meta: {
        title: '业务配置',
        icon: 'component'
      },
      children: [
          // { path: 'system', component: _import('business/system'), name: '每日登录配置', meta: { title: '每日登录配置' }},
          { path: 'userMember', component: _import('business/userMember'), name: '用户会员等级配置', meta: { title: '用户会员等级配置' }},
          { path: 'analystsMember', component: _import('business/analystsMember'), name: '分析师等级配置', meta: { title: '分析师等级配置' }},
          { path: 'chargeConf', component: _import('business/chargeConf'), name: '用户充值配置', meta: { title: '用户充值配置' }},
          // { path: 'entry', component: _import('business/entry'), name: '启动页配置', meta: { title: '启动页配置' }},
          { path: 'banner', component: _import('business/banner'), name: '首页轮播图配置', meta: { title: '首页轮播图配置' }},
          { path: 'marquee', component: _import('business/marquee'), name: '球稳头条配置', meta: { title: '球稳头条配置' }},
          // { path: 'advertising', component: _import('business/advertising'), name: '广告位配置', meta: { title: '广告位配置' }},
          { path: 'adList', component: _import('business/adList'), name: '广告列表', meta: { title: '广告列表' }},
          { path: 'push', component: _import('business/push'), name: '推送配置', meta: { title: '推送配置' }},
          { path: 'systemNotice', component: _import('business/systemNotice'), name: '系统通知', meta: { title: '系统通知' }}
      ]
    },
    {
      path: '/information',
      component: Layout,
      redirect: 'noredirect',
      name: '情报专区',
      meta: {
        title: '情报专区',
        icon: 'icon'
      },
      children: [
        { path: 'best', component: _import('information/best'), name: '精推情报', meta: { title: '精推情报' }},
        { path: 'list', component: _import('information/list'), name: '比赛列表', meta: { title: '比赛列表' }},
      ]
    },
    // {
    //   path: '/rank',
    //   component: Layout,
    //   redirect: 'noredirect',
    //   name: '首页排行榜',
    //   meta: {
    //     title: '首页排行榜',
    //     icon: 'icon'
    //   },
    //   children: [
    //     { path: 'fengyun', component: _import('rank/fengyun'), name: '风云榜', meta: { title: '风云榜' }},
    //     { path: 'mingzhong', component: _import('rank/mingzhong'), name: '命中榜', meta: { title: '命中榜' }},
    //   ]
    // },
    {
      path: '/users',
      component: Layout,
      redirect: 'noredirect',
      name: '用户管理',
      meta: {
        title: '用户管理',
        icon: 'peoples'
      },
      children: [
        { path: 'userList', component: _import('users/userList'), name: '用户列表', meta: { title: '用户列表' }},
        { path: 'analysts', component: _import('users/analysts'), name: '分析师列表', meta: { title: '分析师列表' }},
        { path: 'analystApplication', component: _import('users/analystApplication'), name: '分析师申请', meta: { title: '分析师申请' }},
      ]
    },
    {
      path: '/trading',
      component: Layout,
      redirect: 'noredirect',
      name: '交易管理',
      meta: {
        title: '交易管理',
        icon: 'money'
      },
      children: [
        { path: 'income', component: _import('trading/income'), name: '收入统计', meta: { title: '收入统计' }},
        { path: 'orders', component: _import('trading/orders'), name: '订单信息', meta: { title: '订单信息' }},
        // { path: 'recharge', component: _import('trading/recharge'), name: '充值记录', meta: { title: '充值记录' }},
        // { path: 'purchaseRecords', component: _import('trading/purchaseRecords'), name: '购买记录', meta: { title: '购买记录' }},
        // { path: 'analystBilling', component: _import('trading/analystBilling'), name: '分析师发单记录', meta: { title: '分析师发单记录' }},
        // { path: 'analystShare', component: _import('trading/analystShare'), name: '分析师分成记录', meta: { title: '分析师分成记录' }},
        // { path: 'analystIntegration', component: _import('trading/analystIntegration'), name: '分析师积分记录', meta: { title: '分析师积分记录' }},
      ]
    },

    {
      path: '/video',
      component: Layout,
      redirect: 'noredirect',
      name: '视频模块',
      meta: {
        title: '视频模块',
        icon: 'icon'
      },
      children: [
        { path: 'videoCategory', component: _import('video/videoCategory'), name: '视频分类', meta: { title: '视频分类' }},
        { path: 'videoList/:id', component: _import('video/videoList'), name: '视频列表', meta: { title: '视频列表' }, hidden: true },
        { path: 'videoCateList/:id', component: _import('video/videoCateList'), name: '分类视频列表', meta: { title: '分类视频列表' }, hidden: true },
        { path: 'uploadVideoList', component: _import('video/uploadVideoList'), name: '上传视频', meta: { title: '上传视频' }}
      ]
    },
    {
      path: '/recommend',
      component: Layout,
      redirect: 'noredirect',
      name: '赛事推荐',
      meta: {
        title: '赛事推荐',
        icon: 'icon'
      },
      children: [
        { path: 'matchList', component: _import('recommend/matchList'), name: '比赛列表', meta: { title: '比赛列表',icon: 'icon' }},
        { path: 'recommendlist', component: _import('recommend/recommendList'), name: '推荐列表', meta: { title: '推荐列表',icon: 'icon' }},
      ]
    },

  { path: '*', redirect: '/404', hidden: true }
]
