<script setup lang="ts">
import { adConfig } from '@/config'
import { useDark } from '@vueuse/core'
import { ref } from 'vue'

const isDark = useDark({ disableTransition: false })

const isLoading = ref(false)
</script>
<template>
  <div class="footer-bar">
    <a
      class="ad-img"
      :style="{ 'background-image': `url(${adConfig.image})` }"
      :class="{ dark: isDark, loading: isLoading }"
      :href="adConfig.link"
      target="_blank"
      rel="noopener noreferrer"
    ></a>
  </div>
</template>

<style lang="scss" scoped>
.footer-bar {
  display: flex;
  justify-content: center;
}
.ad-img {
  display: block;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 6 / 1;
  border-radius: 20px;
  cursor: pointer;
  background-size: cover;
  background-position: right; /* 初始时图片右边对齐 */
  transition: background-position 0.5s; /* 过渡动画 */
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 使用父元素的颜色 */
  // user-select: none;
}
.ad-img.dark {
  background-position: left; /* 左侧对齐时 */
}
.ad-img.loading {
  cursor: wait;
}
</style>
