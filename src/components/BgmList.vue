<script setup lang="ts">
import type { BgmData } from '@/types/bangumi'
import { ref, computed } from 'vue'
import { useBangumiStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    dataList: BgmData[]
    // 默认排序
    sort: 'week' | 'score' | 'date'
    asc: boolean
    group: boolean
  }>(),
  {
    sort: 'score',
    asc: false,
    group: false
  }
)

// 控制排序的变量
const sortValue = ref<'week' | 'score' | 'date'>(props.sort)
const isAsc = ref(props.asc) // 是否升序，一般是倒序
const isGroup = ref(props.group)

const changeSort = (sort: 'week' | 'score' | 'date') => {
  sortValue.value = sort
}
const toggleIsAsc = () => {
  isAsc.value = !isAsc.value
}
const toggleIsGroup = () => {
  isGroup.value = !isGroup.value
}

const bangumiStore = useBangumiStore()
const bgmDataList = computed(() => {
  // return bangumiStore.groupByWeekday(props.dataList, isAsc.value)
  switch (sortValue.value) {
    case 'week':
      return bangumiStore.sortByWeekday(props.dataList, isAsc.value)
    case 'score':
      return bangumiStore.sortByScore(props.dataList, isAsc.value)
    case 'date':
      return bangumiStore.sortByDate(props.dataList, isAsc.value)
    default:
      return bangumiStore.sortByScore(props.dataList, isAsc.value)
  }
})
const bgmGroupList = computed(() => {
  return bangumiStore.groupByWeekday(props.dataList, isAsc.value)
})
</script>
<template>
  <div>
    <div class="sort-switch">
      <el-switch
        :modelValue="isAsc"
        inline-prompt
        active-text="升序"
        inactive-text="降序"
        style="--el-switch-off-color: var(--el-color-success)"
        @mousedown="toggleIsAsc()"
      />
      <el-switch
        :modelValue="isGroup"
        inline-prompt
        active-text="分组"
        inactive-text="分组"
        @mousedown="toggleIsGroup()"
      />
      <el-divider direction="vertical" />
      <el-switch
        :modelValue="sortValue === 'week'"
        inline-prompt
        active-text="星期"
        inactive-text="星期"
        style="--el-switch-on-color: var(--el-color-danger)"
        @mousedown="changeSort('week')"
      />
      <el-switch
        :modelValue="sortValue === 'date'"
        inline-prompt
        active-text="日期"
        inactive-text="日期"
        style="--el-switch-on-color: var(--el-color-info)"
        @mousedown="changeSort('date')"
      />
      <el-switch
        :modelValue="sortValue === 'score'"
        inline-prompt
        active-text="评分"
        inactive-text="评分"
        style="--el-switch-on-color: var(--el-color-warning)"
        @mousedown="changeSort('score')"
      />
    </div>
    <!-- 分组渲染 -->
    <el-row :gutter="20" :key="sortValue + isAsc + 'isGroup'" v-if="isGroup">
      <template v-for="(group, index) in bgmGroupList" :key="index">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-if="group.bgmList.length">
          <div class="lable-card">
            <div class="lable-text" v-for="text in group.lable" :key="text">
              {{ text }}
            </div>
          </div>
        </el-col>
        <el-col
          :xs="12"
          :sm="8"
          :md="6"
          :xl="4"
          v-for="item in group.bgmList"
          :key="item.id"
        >
          <BgmCard :data="item"></BgmCard>
        </el-col>
      </template>
    </el-row>
    <!-- 无分组渲染 -->
    <el-row :gutter="20" :key="sortValue + isAsc" v-else>
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :xl="4"
        v-for="item in bgmDataList"
        :key="item.id"
      >
        <BgmCard :data="item"></BgmCard>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.sort-switch {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  .el-switch {
    margin: 0 3px;
  }
}
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

// 小屏时调整字体大小
@media (max-width: 500px) {
  .lable-text {
    font-size: 30px;
  }
}
</style>
