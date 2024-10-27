import { bgmDataIsUpdateInfo } from '@/config'
import type {
  BangumiStoreDataDependencies,
  BgmData,
  BgmUpdateInfo
} from '@/types'
import { computed, ref } from 'vue'

export const useUpdateModule = (dependencies: BangumiStoreDataDependencies) => {
  const {
    // bgmDatas,
    // bgmFiles,
    // isLoadingData,
    // isFirstLoad,
    // version,
    // codeVersion,
    // notifInfo,
    // contact,
    // friend,
    // aboutList,
    // currentQuarterKey,
    // releaseOldBangumi,
    // personalRecommendationBangumi,
    // bgmLastUpdate,
    bgmUpdateList,
    bgmUpdateReadHash
  } = dependencies

  // 是否启用番剧更新提示
  const updateIsEnable = ref(true)
  const updateSetEnable = (val: boolean) => {
    updateIsEnable.value = val
  }
  // 番剧更新提示持久保留
  const updateIsPersistent = ref(false)
  const updateSetPersistent = (val: boolean) => {
    updateIsPersistent.value = val
  }
  // 番剧更新提示显示个数
  const updateLimitShowNumber = ref(12)
  const updateSetShowNumber = (val: number) => {
    updateLimitShowNumber.value = val
  }

  // 清空已读更新提示记录
  const updateClearReadHash = () => {
    bgmUpdateReadHash.value = []
  }

  // 限制番剧更新提示显示个数
  // 注意 updateInfoGetByBgm 不用这个，它是用作获取信息而不是显示提示
  const bgmUpdateListLimited = computed(() => {
    return bgmUpdateList.value.slice(0, updateLimitShowNumber.value)
  })

  // 通过 bgmData 获取更新信息
  const updateInfoGetByBgm = (bgmData: BgmData) => {
    return bgmUpdateList.value.find((i) => bgmDataIsUpdateInfo(bgmData, i))
  }

  // 通过 bgmData 获取更新信息数组
  const updateInfoFilterByBgm = (bgmData: BgmData) => {
    return bgmUpdateListLimited.value.filter((i) =>
      bgmDataIsUpdateInfo(bgmData, i)
    )
  }

  // 从更新信息中获取未读的
  const updateListFilterNotReaded = (updateInfoList: BgmUpdateInfo[]) => {
    const notReadedList = updateInfoList.filter(
      (i) => !bgmUpdateReadHash.value.includes(i.fileHash)
    )
    return notReadedList
  }

  // 番剧是否更新
  const updateIsBgmUpdate = (bgmData: BgmData) => {
    // 未启用返回false
    if (!updateIsEnable.value) {
      return false
    }
    // 无更新返回false
    const sameUpdateList = updateInfoFilterByBgm(bgmData)
    if (sameUpdateList.length === 0) {
      return false
    }
    // 有更新且已设置持久显示返回true
    if (updateIsPersistent.value) {
      return true
    }

    // 未设置持久显示，判断是否未读
    const notReadedList = updateListFilterNotReaded(sameUpdateList)
    if (notReadedList.length === 0) {
      return false
    }
    return true
  }

  // 设置番剧更新已读
  const updateSetBgmRead = (bgmData: BgmData) => {
    // 未启用或已设置持久显示则返回
    if (!updateIsEnable.value || updateIsPersistent.value) {
      return
    }
    const sameUpdateList = updateInfoFilterByBgm(bgmData)
    const notReadedList = updateListFilterNotReaded(sameUpdateList)
    // 将未读Hash加入
    bgmUpdateReadHash.value.push(...notReadedList.map((i) => i.fileHash))
  }

  return {
    updateIsEnable,
    updateSetEnable,
    updateIsPersistent,
    updateSetPersistent,
    updateLimitShowNumber,
    updateSetShowNumber,
    updateClearReadHash,
    updateInfoGetByBgm,
    updateIsBgmUpdate,
    updateSetBgmRead
  }
}
