<script setup lang="ts">
import { onMounted } from 'vue'
import { useBangumiStore } from '@/stores'
import {
  bdayBallons,
  getScrollbarWidth,
  isToday,
  sakiNotification
} from './utils'

// 等待加载数据，之后取消在 index.html 中的加载遮罩
onMounted(async () => {
  await bangumiDataAwait()
  indexMaskClose()
  // 2月14日气球动画
  if (isToday(2, 14)) {
    bdayBallons()
    sakiNotification({
      title: '小祥小祥，生日快乐 🎉🎉🎉',
      message: '气球没看够的话，可以在关于页点击查看通知再次触发'
    })
  }
})

const bangumiStore = useBangumiStore()

// 等待加载数据，最多等待3秒或10秒（第一次加载），最少等待1秒
const bangumiDataAwait = async () => {
  const maxTimeout = bangumiStore.isFirstLoad ? 10000 : 3000
  const minTimeout = 1000
  await Promise.all([
    Promise.race([
      bangumiStore.initData().catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, maxTimeout))
    ]),
    new Promise((resolve) => setTimeout(resolve, minTimeout))
  ])
}

// 关闭加载遮罩，恢复滚动条，同时防止抖动
const indexMaskClose = async () => {
  const scrollbarWidth = getScrollbarWidth()
  const maskElement = document.getElementById('index-mask')
  document.documentElement.style.overflowY = ''
  if (maskElement) {
    maskElement.style.right = `-${scrollbarWidth}px`
    maskElement.style.opacity = '0'
    await new Promise((resolve) => setTimeout(resolve, 300))
    maskElement.style.display = 'none'
  }
}
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
  <BalloonContainer></BalloonContainer>
</template>

<style scoped></style>
