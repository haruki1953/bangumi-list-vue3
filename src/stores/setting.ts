import { sakiMessage } from '@/utils'
import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'

export const useSettingStore = defineStore(
  'bangumi-setting',
  () => {
    const showBgmName = ref(true)
    const showDiscord = ref(true)
    const limitSimilarBgms = ref(true)
    const showSimilarBgms = ref(true)
    const isHomeShowSameAlistPathBgm = ref(true)

    const toggleShowBgmName = () => {
      showBgmName.value = !showBgmName.value
      sakiMessage({
        type: 'success',
        message: showBgmName.value ? '番剧名显示' : '番剧名隐藏'
      })
    }
    const toggleShowDiscord = async () => {
      showDiscord.value = !showDiscord.value
      sakiMessage({
        type: 'success',
        message: showDiscord.value ? 'Discord显示' : 'Discord隐藏'
      })
      await nextTick() // 确保更新
      window.location.reload()
    }
    const toggleShowSimilarBgms = () => {
      showSimilarBgms.value = !showSimilarBgms.value
      sakiMessage({
        type: 'success',
        message: showSimilarBgms.value ? '相似番剧显示' : '相似番剧隐藏'
      })
    }
    const toggleLimitSimilarBgms = () => {
      limitSimilarBgms.value = !limitSimilarBgms.value
      sakiMessage({
        type: 'success',
        message: limitSimilarBgms.value ? '数量控制开启' : '数量控制关闭'
      })
    }
    const toggleIsHomeShowSameAlistPathBgm = () => {
      isHomeShowSameAlistPathBgm.value = !isHomeShowSameAlistPathBgm.value
      sakiMessage({
        type: 'success',
        message: isHomeShowSameAlistPathBgm.value ? '已显示' : '已隐藏'
      })
    }

    return {
      showBgmName,
      showDiscord,
      limitSimilarBgms,
      showSimilarBgms,
      isHomeShowSameAlistPathBgm,
      toggleShowBgmName,
      toggleShowDiscord,
      toggleShowSimilarBgms,
      toggleLimitSimilarBgms,
      toggleIsHomeShowSameAlistPathBgm
    }
  },
  {
    persist: true // 持久化
  }
)
