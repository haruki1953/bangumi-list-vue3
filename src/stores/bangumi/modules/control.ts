import { axiosConfig, codeConfig } from '@/config'
import type { BangumiStoreDataDependencies, ConfigNotifInfo } from '@/types'

export const useControlModule = (
  dependencies: BangumiStoreDataDependencies
) => {
  const {
    bgmDatas,
    bgmFiles,
    // isLoadingData,
    isFirstLoad,
    version,
    codeVersion,
    notifInfo,
    contact,
    friend,
    // aboutList
    bgmLastUpdate
  } = dependencies

  // 清除数据
  const removeData = () => {
    bgmDatas.value = []
    bgmFiles.value = []
    isFirstLoad.value = true
    notifInfo.value = null
    contact.value = []
    friend.value = []
    bgmLastUpdate.value = null
  }

  // 检查版本 版本不一致则清除数据并同步版本
  const checkVersion = (newVersion: string) => {
    if (version.value !== newVersion) {
      version.value = newVersion
      // 清除数据
      removeData()
    }
  }

  // 检查通知
  const checkNotif = (newNotif: ConfigNotifInfo) => {
    // 不一致（或没有）则保存，并为其加上 isRead: false
    if (!notifInfo.value || notifInfo.value.id !== newNotif.id) {
      notifInfo.value = {
        id: newNotif.id,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        isRead: false
      }
    }
  }

  // 显示通知 checkRead 为是否检查已读
  const showNotif = (checkRead: boolean) => {
    // 没有通知直接返回
    if (!notifInfo.value) return
    if (checkRead) {
      // 已读则返回
      if (notifInfo.value.isRead) return
    }
    // 标记已读的回调函数，关闭时标记已读
    const markRead = () => {
      if (!notifInfo.value) return
      notifInfo.value.isRead = true
    }
    // 显示通知
    ElNotification({
      title: notifInfo.value.title,
      message: notifInfo.value.message,
      type: notifInfo.value.type,
      onClose: markRead,
      offset: 60 // 偏移菜单栏的高
    })
  }

  // 检查代码版本
  const checkCodeVersion = async () => {
    if (codeVersion.value !== codeConfig.version) {
      codeVersion.value = codeConfig.version
      // 第一次加载就不需要再刷新了
      if (isFirstLoad.value) {
        return
      }
      // 清除数据
      removeData()
      // 刷新页面
      window.location.reload()
      // 阻塞一下，在刷新时不要继续执行
      await new Promise((resolve) => setTimeout(resolve, axiosConfig.timeout))
    }
  }

  return {
    removeData,
    showNotif,
    checkVersion,
    checkNotif,
    checkCodeVersion
  }
}
