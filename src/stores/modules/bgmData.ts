import { defineStore } from 'pinia'
import { ref } from 'vue'

// 番剧数据模块
export const useUserStore = defineStore(
  'bangumi-bgmData',
  () => {
    const bgmList = ref([]) // 番剧数据

    return { bgmList }
  },
  {
    persist: true // 持久化
  }
)
