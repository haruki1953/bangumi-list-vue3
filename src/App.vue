<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 取消 index.html 中的加载条 #index-loading
  const loadingElement = document.getElementById('index-loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
