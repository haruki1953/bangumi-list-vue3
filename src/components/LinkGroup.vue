<script setup lang="ts">
import { contactInfo } from '@/config'

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
<template>
  <div class="link-group">
    <el-tooltip
      v-for="(item, key) in contactInfo"
      :key="key"
      :content="item.description"
      placement="bottom"
      effect="light"
    >
      <a
        class="link-icon"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <el-icon :class="item.fontawesomeClass" size="20"></el-icon>
      </a>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.link-group {
  display: flex;
}
.link-icon {
  display: flex;
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 使用父元素的颜色 */
  margin: 0 10px;
  .el-icon {
  }
}
</style>
