import { getScrollbarWidth } from '../other'

export const optimizationScrollOnOverlayShow = () => {
  // 禁用滚动，同时防止抖动
  const scrollbarWidth = getScrollbarWidth()
  document.documentElement.style.overflowY = 'hidden'
  document.documentElement.style.marginRight = `${scrollbarWidth}px`
  // 菜单栏
  const menuBar = document.querySelector(
    '.menu-bar .el-menu'
  ) as HTMLElement | null
  if (menuBar) {
    menuBar.style.paddingRight = `${scrollbarWidth}px`
  }
  // 返回顶部按钮
  const backtopBtn = document.querySelector(
    '.back-top-btn-box'
  ) as HTMLElement | null
  if (backtopBtn) {
    backtopBtn.style.display = 'none'
  }
}

export const optimizationScrollOnOverlayClose = () => {
  // 恢复滚动，同时防止抖动
  document.documentElement.style.overflowY = 'scroll'
  document.documentElement.style.marginRight = `0`
  // 菜单栏
  const menuBar = document.querySelector(
    '.menu-bar .el-menu'
  ) as HTMLElement | null
  if (menuBar) {
    menuBar.style.paddingRight = `0`
  }
  // 返回顶部按钮
  const backtopBtn = document.querySelector(
    '.back-top-btn-box'
  ) as HTMLElement | null
  if (backtopBtn) {
    backtopBtn.style.display = 'block'
  }
}
