import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/m-recommend/recommend'
import Singer from 'components/m-singer/singer'
import Rank from 'components/m-rank/rank'
import Search from 'components/m-search/search'
import Singerdetail from "components/m-singerdetail/singerdetail";
Vue.use(Router)

export default new Router({
  mode  : 'history',
  routes: [{
      path    : '/',
      redirect: '/recommend'
    },
    {
      path     : '/recommend',
      name     : 'recommend',
      component: Recommend
    },
    {
      path     : '/singer',
      name     : 'singer',
      component: Singer,
      children : [{
        path     : ':id',
        component: Singerdetail
      }]
    },
    {
      path     : '/rank',
      name     : 'rank',
      component: Rank
    },
    {
      path     : '/search',
      name     : 'search',
      component: Search
    }
  ]
})
