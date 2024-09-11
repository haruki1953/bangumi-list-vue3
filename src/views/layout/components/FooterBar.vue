<script setup lang="ts">
import { adConfig } from '@/config'
import { useDark } from '@vueuse/core'
import { h, ref } from 'vue'

const isDark = useDark({ disableTransition: false })

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const copyCode = () => {
  const message = h('div', null, [
    h('p', null, `即将跳转至：${adConfig.name}`),
    h('p', null, [
      '链接：',
      h('a', { href: adConfig.link, target: '_blank' }, adConfig.link)
    ]),
    h('p', null, `邀请码：${adConfig.code}`)
  ])
  navigator.clipboard
    .writeText(adConfig.code)
    .then(() => {
      ElNotification({
        title: '邀请码复制成功',
        message,
        type: 'success',
        offset: 60,
        duration: 0
      })
    })
    .catch(() => {
      ElNotification({
        title: '请手动复制邀请码',
        message,
        type: 'error',
        offset: 60,
        duration: 0
      })
    })
}

const toAdweb = async () => {
  // copyCode()
  // isLoading.value = true
  // document.body.style.cursor = 'wait'
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  // isLoading.value = false
  // document.body.style.cursor = 'default'
  openLink(adConfig.link)
}

const isLoading = ref(false)
</script>
<template>
  <div class="footer-bar">
    <div
      class="ad-img"
      @click="toAdweb"
      :style="{ 'background-image': `url(${adConfig.image})` }"
      :class="{ dark: isDark, loading: isLoading }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.footer-bar {
  display: flex;
  justify-content: center;
}
.ad-img {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 6 / 1;
  border-radius: 20px;
  cursor: pointer;
  background-size: cover;
  background-position: right; /* 初始时图片右边对齐 */
  transition: background-position 0.5s; /* 过渡动画 */
}
.ad-img.dark {
  background-position: left; /* 左侧对齐时 */
}
.ad-img.loading {
  cursor: wait;
}
</style>
