<script setup lang="ts"></script>
<template>
  <div class="decoration-box">
    <div
      class="dot-box"
      style="background-color: var(--el-color-primary)"
    ></div>
    <div class="dot-box" style="background-color: var(--el-color-info)"></div>
    <div
      class="dot-box"
      style="background-color: var(--el-color-warning)"
    ></div>
    <div class="dot-box" style="background-color: var(--el-color-danger)"></div>
    <div
      class="dot-box"
      style="background-color: var(--el-color-success)"
    ></div>
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
}
</style>
