<script setup lang="ts">
import type { IconMenuItem } from '@/types'
import { computed } from 'vue'
import {
  Drizzling,
  PartlyCloudy,
  Sunny,
  Moon,
  Ship,
  IceCream,
  Star,
  Clock,
  Calendar
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useBangumiStore } from '@/stores'

const router = useRouter()
const bangumiStore = useBangumiStore()

const getIconByQuarter = (quarter: '一月' | '四月' | '七月' | '十月') => {
  if (quarter === '一月') {
    return Drizzling
  } else if (quarter === '四月') {
    return PartlyCloudy
  } else if (quarter === '七月') {
    return Sunny
  } else {
    return Moon
  }
}

const menu = computed((): IconMenuItem[] => {
  const {
    currentQuarter,
    previousFirstQuarter,
    previousSecondQuarter,
    previousThirdQuarter
  } = bangumiStore.quarterPreviousInfo
  return [
    ...(() => {
      const optionalItem: IconMenuItem[] = []
      if (
        bangumiStore.updateBgmDataList.length &&
        bangumiStore.updateIsEnable
      ) {
        optionalItem.push({
          index: '/update',
          title: '番剧更新',
          // icon: Finished,
          icon: Calendar,
          actionColor: 'info',
          onClick() {
            router.push('/update')
          }
        })
      }
      return optionalItem
    })(),
    {
      index: '/',
      title: `${currentQuarter.year}${currentQuarter.quarter}`,
      icon: getIconByQuarter(currentQuarter.quarter),
      actionColor: currentQuarter.color,
      onClick() {
        router.push('/')
      }
    },
    {
      index: '/previous-first-quarter',
      title: `${previousFirstQuarter.year}${previousFirstQuarter.quarter}`,
      icon: getIconByQuarter(previousFirstQuarter.quarter),
      actionColor: previousFirstQuarter.color,
      onClick() {
        router.push('/previous-first-quarter')
      }
    },
    {
      index: '/previous-second-quarter',
      title: `${previousSecondQuarter.year}${previousSecondQuarter.quarter}`,
      icon: getIconByQuarter(previousSecondQuarter.quarter),
      actionColor: previousSecondQuarter.color,
      onClick() {
        router.push('/previous-second-quarter')
      }
    },
    {
      index: '/previous-third-quarter',
      title: `${previousThirdQuarter.year}${previousThirdQuarter.quarter}`,
      icon: getIconByQuarter(previousThirdQuarter.quarter),
      actionColor: previousThirdQuarter.color,
      onClick() {
        router.push('/previous-third-quarter')
      }
    },
    ...(() => {
      const optionalItem: IconMenuItem[] = []
      if (bangumiStore.releaseOldBangumiDatas.length) {
        optionalItem.push({
          index: '/release-old',
          title: '旧番上架',
          icon: Ship,
          actionColor: 'info',
          onClick() {
            router.push('/release-old')
          }
        })
      }
      if (bangumiStore.personalRecommendationBangumiDatas.length) {
        optionalItem.push({
          index: '/personal-recommendation',
          title: '私心推荐',
          icon: IceCream,
          actionColor: 'danger',
          onClick() {
            router.push('/personal-recommendation')
          }
        })
      }
      return optionalItem
    })(),
    {
      index: '/favorite',
      title: '番剧收藏',
      icon: Star,
      actionColor: 'warning',
      onClick() {
        router.push('/favorite')
      }
    },
    {
      index: '/history',
      title: '浏览记录',
      icon: Clock,
      actionColor: 'info',
      onClick() {
        router.push('/history')
      }
    }
  ]
})
</script>
<template>
  <div>
    <div class="top-menu-box">
      <IconMenuBox :menu="menu" :modelValue="$route.path"></IconMenuBox>
    </div>
    <router-view></router-view>
    <!-- <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view> -->
  </div>
</template>

<style lang="scss" scoped>
.top-menu-box {
  max-width: 920px;
  margin: -5px auto 15px auto;
}
</style>
