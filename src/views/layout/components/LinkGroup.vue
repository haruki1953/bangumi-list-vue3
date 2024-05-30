<script setup lang="ts">
import { contactInfo } from '@/config'

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
<template>
  <div>
    <el-tooltip
      v-for="(item, key) in contactInfo"
      :key="key"
      :content="item.description"
      placement="bottom"
      effect="light"
    >
      <el-icon
        class="link-icon"
        :class="item.fontawesomeClass"
        size="20"
        @click="openLink(item.link)"
      ></el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: flex;
}
.link-icon {
  margin: 0 10px;
}
</style>
