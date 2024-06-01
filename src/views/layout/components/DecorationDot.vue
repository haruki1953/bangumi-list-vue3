<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { ref } from 'vue'

const bangumiStore = useBangumiStore()
</script>
<template>
  <div
    class="decoration-box"
    :class="{ 'dot-ani': bangumiStore.isLoadingData }"
  >
    <div class="dot-box sakiko"></div>
    <div class="dot-box umiri"></div>
    <div class="dot-box uika"></div>
    <div class="dot-box nyamu"></div>
    <div class="dot-box mutsumi"></div>
  </div>
</template>

<style lang="scss" scoped>
.decoration-box {
  display: flex;
}
$dot-size: 12px;
.dot-box {
  width: $dot-size;
  height: $dot-size;
  border-radius: calc($dot-size / 2);
  margin: 0 5px;
  transition: transform 0.5s;
  transform: scale(1);
  animation-name: dot;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
.sakiko {
  background-color: var(--el-color-primary);
  animation-delay: 0;
}
.umiri {
  background-color: var(--el-color-info);
  animation-delay: 0.24s;
}
.uika {
  background-color: var(--el-color-warning);
  animation-delay: 0.48s;
}
.nyamu {
  background-color: var(--el-color-danger);
  animation-delay: 0.72s;
}
.mutsumi {
  background-color: var(--el-color-success);
  animation-delay: 0.96s;
}

.dot-ani .dot-box {
  animation-name: dotScale;
  animation-duration: 1.5s;
  // 播放次数无限
  animation-iteration-count: infinite;
}

@keyframes dotScale {
  /* 开始状态 */
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.5);
  }
  50% {
    transform: scale(1);
  }
  /* 结束状态 */
  100% {
    transform: scale(1);
  }
}
@keyframes dot {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
