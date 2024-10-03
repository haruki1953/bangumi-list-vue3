import { createRouter, createWebHashHistory } from 'vue-router'
import { webName } from '@/config'
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import HomePage from '@/views/home/HomePage.vue'
import BangumiList from '@/views/list/BangumiList.vue'
import AboutPage from '@/views/about/AboutPage.vue'
import FavPage from '@/views/favorite/FavPage.vue'
import { ref } from 'vue'
import UtilsPage from '@/views/utils/UtilsPage.vue'

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
          meta: { title: `` }
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
          path: '/favorite',
          component: FavPage,
          meta: { title: `收藏` }
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
