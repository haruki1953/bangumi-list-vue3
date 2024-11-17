<script setup lang="ts">
import { onMounted } from 'vue'

// 取消 index.html 中的遮罩 #index-mask
// 延迟 有助于确保页面稳定显示
// 对于遮罩和加载条，可以设置不同的延时。为了性能考虑，可以不用
// onMounted(async () => {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const loadingElement = document.getElementById('index-loading')
//   if (loadingElement) {
//     loadingElement.style.opacity = '0'
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     loadingElement.style.display = 'none'
//   }
// })
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const maskElement = document.getElementById('index-mask')
  if (maskElement) {
    maskElement.style.opacity = '0'
    await new Promise((resolve) => setTimeout(resolve, 500))
    maskElement.style.display = 'none'
  }
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
