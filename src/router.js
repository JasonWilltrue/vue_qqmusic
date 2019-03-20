import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/m-recommend/recommend'
// import Singer from 'components/m-singer/singer'
// import Rank from 'components/m-rank/rank'
// import Search from 'components/m-search/search'
// import SingerDetail from "components/m-singerdetail/singerdetail"
// import SongList from "components/m-songlistdetail/songlistdetail"
// import RankDetail from 'components/m-ranklistdetail/ranklistdetail'
// import User from 'components/m-user/user'
Vue.use(Router)

// 使用路由懒加载
const Recommend = (resolve) => {
  import('components/m-recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('components/m-singer/singer').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('components/m-rank/rank').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('components/m-search/search').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('components/m-singerdetail/singerdetail').then((module) => {
    resolve(module)
  })
}
const SongList = (resolve) => {
  import('components/m-songlistdetail/songlistdetail').then((module) => {
    resolve(module)
  })
}
const RankDetail = (resolve) => {
  import('components/m-ranklistdetail/ranklistdetail').then((module) => {
    resolve(module)
  })
}
const User = (resolve) => {
  import('components/m-user/user').then((module) => {
    resolve(module)
  })
}

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
      path     : '/user',
      name     : 'user',
      component: User
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
      component: Rank,
      children : [{
         path     : ':id',
         component: RankDetail
       }]
    },
    {
      path     : '/search',
      name     : 'search',
      component: Search,
      children : [{
        path     : ':id',
        component: SingerDetail
      }]
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
