import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'

export const useSettingStore = defineStore(
  'bangumi-setting',
  () => {
    const showBgmName = ref(true)
    const showDiscord = ref(true)

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
    return {
      showBgmName,
      showDiscord,
      toggleShowBgmName,
      toggleShowDiscord
    }
  },
  {
    persist: true // 持久化
  }
)
