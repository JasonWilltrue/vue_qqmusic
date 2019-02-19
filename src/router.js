import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/m-recommend/recommend'
import Singer from 'components/m-singer/singer'
import Rank from 'components/m-rank/rank'
import Search from 'components/m-search/search'
import SingerDetail from "components/m-singerdetail/singerdetail"
import SongList from "components/m-songlistdetail/songlistdetail"
Vue.use(Router)


export default new Router({
  routes: [{
      path    : '/',
      redirect: '/recommend'
    },
    {
      path     : '/recommend',
      name     : 'recommend',
      component: Recommend,
      children : [{
        path     : ':id',
        component: SongList
      }]
    },
    {
      path     : '/singer',
      name     : 'singer',
      component: Singer,
      children : [{
        path     : ':id',
        component: SingerDetail
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








// export default new Router({
//   mode  : 'history',
//   routes: [{
//       path    : '/',
//       redirect: '/recommend'
//     },
//     {
//       path     : '/recommend',
//       name     : 'recommend',
//       component: Recommend,
//       children : [
//           {
//             path     : ':id',
//             name     : 'songlist',
//             component: SongList
//           }
//       ]
//     },
//     {
//       path     : '/singer',
//       name     : 'singer',
//       component: Singer,
//       children : [{
//         path     : ':id',
//         name     : 'singerdetail',
//         component: SingerDetail
//       }]
//     },
//     {
//       path     : '/rank',
//       name     : 'rank',
//       component: Rank
//     },
//     {
//       path     : '/search',
//       name     : 'search',
//       component: Search
//     }
//   ]
// })
