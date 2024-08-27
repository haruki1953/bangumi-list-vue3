<script setup lang="ts">
import { adConfig } from '@/config'
import { useDark } from '@vueuse/core'

const openLink = (url: string) => {
  window.open(url, '_blank')
}
const isDark = useDark({ disableTransition: false })
</script>
<template>
  <div class="footer-bar">
    <div
      class="ad-img"
      @click="openLink(adConfig.link)"
      :style="{ 'background-image': `url(${adConfig.image})` }"
      :class="{ dark: isDark }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.footer-bar {
  margin: 20px 0;
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
</style>
