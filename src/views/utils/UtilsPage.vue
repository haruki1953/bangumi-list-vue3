<script lang="ts" setup>
import SubtitleCut from './views/SubtitleCut.vue'
import XImgCut from './views/XImgCut.vue'
</script>
<template>
  <div class="utils-page">
    <XImgCut></XImgCut>
    <el-divider />
    <SubtitleCut></SubtitleCut>
    <el-divider />
  </div>
</template>
<style lang="scss" scoped>
.utils-page {
  max-width: 1030px;
  margin: 0 auto;
  .el-divider {
    margin: 50px 0;
    transition: all 0.5s;
  }
}
</style>
