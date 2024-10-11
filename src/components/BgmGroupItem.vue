<script setup lang="ts">
import { bangumiSortByScoreService } from '@/services'
import type { BgmGroup } from '@/types/bangumi'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    group: BgmGroup
    showLable?: boolean
    sortScore?: boolean
  }>(),
  {
    showLable: false,
    sortScore: false
  }
)

const isSortScore = ref(false)

const bgmList = computed(() => {
  if (isSortScore.value) {
    return bangumiSortByScoreService(props.group.bgmList, false)
  } else {
    return props.group.bgmList
  }
})
</script>
<template>
  <el-col
    :xs="12"
    :sm="8"
    :md="6"
    :xl="4"
    v-if="group.bgmList.length && showLable"
  >
    <div class="lable-card">
      <div class="lable-text" v-for="text in group.lable" :key="text">
        {{ text }}
      </div>
      <div v-if="sortScore">
        <el-button
          type="warning"
          size="small"
          round
          @click="isSortScore = true"
          class="sort-button"
        >
          按评分排序
        </el-button>
      </div>
    </div>
  </el-col>
  <el-col
    :xs="12"
    :sm="8"
    :md="6"
    :xl="4"
    v-for="item in bgmList"
    :key="'srot-score' + isSortScore + item.id"
  >
    <BgmCard :data="item"></BgmCard>
  </el-col>
</template>

<style lang="scss" scoped>
.lable-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1.35;
}
.lable-text {
  font-size: 40px;
  font-weight: bold;
  // color: var(--el-color-primary-dark-2);
  transition: color 0.5s;
}
.sort-button {
  margin-top: 20px;
}

// 小屏时调整字体大小
@media (max-width: 500px) {
  .lable-text {
    font-size: 30px;
  }
}
</style>
