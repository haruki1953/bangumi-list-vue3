import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'

export const useSettingStore = defineStore(
  'bangumi-setting',
  () => {
    const showBgmName = ref(true)
    const showDiscord = ref(true)
    const limitSimilarBgms = ref(true)
    const showSimilarBgms = ref(true)

    const toggleShowBgmName = () => {
      showBgmName.value = !showBgmName.value
      ElMessage({
        type: 'success',
        offset: 66,
        message: showBgmName.value ? '番剧名显示' : '番剧名隐藏'
      })
    }
    const toggleShowDiscord = async () => {
      showDiscord.value = !showDiscord.value
      ElMessage({
        type: 'success',
        offset: 66,
        message: showDiscord.value ? 'Discord显示' : 'Discord隐藏'
      })
      await nextTick() // 确保更新
      window.location.reload()
    }
    const toggleShowSimilarBgms = () => {
      showSimilarBgms.value = !showSimilarBgms.value
      ElMessage({
        type: 'success',
        offset: 66,
        message: showSimilarBgms.value ? '相似番剧显示' : '相似番剧隐藏'
      })
    }
    const toggleLimitSimilarBgms = () => {
      limitSimilarBgms.value = !limitSimilarBgms.value
      ElMessage({
        type: 'success',
        offset: 66,
        message: limitSimilarBgms.value ? '数量控制开启' : '数量控制关闭'
      })
    }

    return {
      showBgmName,
      showDiscord,
      limitSimilarBgms,
      showSimilarBgms,
      toggleShowBgmName,
      toggleShowDiscord,
      toggleShowSimilarBgms,
      toggleLimitSimilarBgms
    }
  },
  {
    persist: true // 持久化
  }
)
