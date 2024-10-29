import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { webName } from '@/config'
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import BangumiList from '@/views/list/BangumiList.vue'
import AboutPage from '@/views/about/AboutPage.vue'
import UtilsPage from '@/views/utils/UtilsPage.vue'
import HomePage from '@/views/home/HomePage.vue'
import CurrentQuarterBangumi from '@/views/home/views/CurrentQuarterBangumi.vue'
import PreviousFirstQuarterBangumi from '@/views/home/views/PreviousFirstQuarterBangumi.vue'
import PreviousSecondQuarterBangumi from '@/views/home/views/PreviousSecondQuarterBangumi.vue'
import PreviousThirdQuarterBangumi from '@/views/home/views/PreviousThirdQuarterBangumi.vue'
import ReleaseOldBangumi from '@/views/home/views/ReleaseOldBangumi.vue'
import PersonalRecommendationBangumi from '@/views/home/views/PersonalRecommendationBangumi.vue'
import FavoriteBangumi from '@/views/home/views/FavoriteBangumi.vue'
import HistoryBangumi from '@/views/home/views/HistoryBangumi.vue'
import UpdateBangumi from '@/views/home/views/UpdateBangumi.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutContainer,
      children: [
        {
          path: '',
          component: HomePage,
          meta: { title: `` },
          children: [
            {
              path: '',
              component: CurrentQuarterBangumi,
              meta: { title: `` }
            },
            {
              path: '/previous-first-quarter',
              component: PreviousFirstQuarterBangumi,
              meta: { title: `` }
            },
            {
              path: '/previous-second-quarter',
              component: PreviousSecondQuarterBangumi,
              meta: { title: `` }
            },
            {
              path: '/previous-third-quarter',
              component: PreviousThirdQuarterBangumi,
              meta: { title: `` }
            },
            {
              path: '/release-old',
              component: ReleaseOldBangumi,
              meta: { title: `旧番上架` }
            },
            {
              path: '/personal-recommendation',
              component: PersonalRecommendationBangumi,
              meta: { title: `私心推荐` }
            },
            {
              path: '/update',
              component: UpdateBangumi,
              meta: { title: `番剧更新` }
            },
            {
              path: '/favorite',
              component: FavoriteBangumi,
              meta: { title: `番剧收藏` }
            },
            {
              path: '/history',
              component: HistoryBangumi,
              meta: { title: `浏览记录` }
            }
          ]
        },
        {
          path: '/list',
          component: BangumiList,
          meta: { title: `全部番剧` }
        },
        {
          path: '/about',
          component: AboutPage,
          meta: { title: `关于` }
        },
        {
          path: '/utils',
          component: UtilsPage,
          meta: { title: `小工具` }
        }
      ]
    }
  ],
  // 路由滚动行为定制
  scrollBehavior: async (to, from, savedPosition) => {
    // console.log(to, from)
    // console.log(to.path, from.path)

    if (to.path === from.path) {
      return
    }

    // 在首页里跳转不回到顶部。算了，好像也无所谓。
    // 反而会导致在收藏等页面通过顶部菜单回到首页时，滚动不回到顶部，体验不好
    // if (homePaths.includes(to.path) && homePaths.includes(from.path)) {
    //   return
    // }

    // 默认回到顶部
    return { top: 0 }
  }
})

// 路由加载标识（本项目不是异步导入，应该用处不大）
export const isLoading = ref(false)

// 路由访问拦截
router.beforeEach((to) => {
  // 路由加载标识
  isLoading.value = true

  // 根据路由设置页面标题
  if (to.meta.title) {
    document.title = (to.meta.title as string) + ' | ' + webName
  } else {
    document.title = webName
  }

  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    // return '/'
    // 这种方式可能更好，强制再次刷新
    window.location.href = '/'
  }
})

router.afterEach(() => {
  isLoading.value = false
})

export default router
