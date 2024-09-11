<script lang="ts" setup>
import SubtitleCut from './components/SubtitleCut.vue'
import XImgCut from './components/XImgCut.vue'
</script>
<template>
  <div class="utils-page">
    <div><XImgCut></XImgCut></div>
    <div><SubtitleCut></SubtitleCut></div>
  </div>
</template>
<style lang="scss" scoped>
.utils-page {
  max-width: 1030px;
  margin: 0 auto;
  > div {
    margin-bottom: 50px;
  }
}
</style>
