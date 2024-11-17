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
  // 消息提示
  const messages = document.querySelectorAll('.el-message')
  messages.forEach((message) => {
    if (!(message instanceof HTMLElement)) {
      return
    }
    if (message.style.left !== '') {
      // 已设置，说明是在禁止滚动时弹出的，恢复为空
      message.style.left = ''
    } else {
      // 未设置，应向左偏移
      message.style.left = `calc(50% - ${scrollbarWidth / 2}px)`
    }
  })
  // 通知 设置right时会有过渡 效果不好
  // 已在 src\styles\main.scss 去除right过渡
  const notifications = document.querySelectorAll('.el-notification.right')
  notifications.forEach((notification) => {
    if (!(notification instanceof HTMLElement)) {
      return
    }
    if (notification.style.right !== '') {
      // 已设置，说明是在禁止滚动时弹出的，恢复为空
      notification.style.right = ''
    } else {
      // 未设置，应向左偏移
      notification.style.right = `calc(16px + ${scrollbarWidth}px)`
    }
  })
}

export const optimizationScrollOnOverlayClose = () => {
  // 恢复滚动，同时防止抖动
  const scrollbarWidth = getScrollbarWidth()
  // document.documentElement.style.overflowY = 'scroll'
  document.documentElement.style.overflowY = ''
  // document.documentElement.style.marginRight = `0`
  document.documentElement.style.marginRight = ''
  // 菜单栏
  const menuBar = document.querySelector(
    '.menu-bar .el-menu'
  ) as HTMLElement | null
  if (menuBar) {
    // menuBar.style.paddingRight = `0`
    menuBar.style.paddingRight = ''
  }
  // 返回顶部按钮
  const backtopBtn = document.querySelector(
    '.back-top-btn-box'
  ) as HTMLElement | null
  if (backtopBtn) {
    // backtopBtn.style.display = 'block'
    backtopBtn.style.display = ''
  }
  // 消息提示
  const messages = document.querySelectorAll('.el-message')
  messages.forEach((message) => {
    if (!(message instanceof HTMLElement)) {
      return
    }
    console.log(message.style.left, typeof message.style.left)
    if (message.style.left === '') {
      // 未设置，说明是在禁止滚动时弹出的，应向右偏移
      message.style.left = `calc(50% + ${scrollbarWidth / 2}px)`
    } else {
      // 已设置，恢复为空
      message.style.left = ''
    }
  })
  // 通知
  const notifications = document.querySelectorAll('.el-notification.right')
  notifications.forEach((notification) => {
    if (!(notification instanceof HTMLElement)) {
      return
    }
    if (notification.style.right === '') {
      // 未设置，说明是在禁止滚动时弹出的，应向右偏移
      notification.style.right = `calc(16px - ${scrollbarWidth}px)`
    } else {
      // 已设置，恢复为空
      notification.style.right = ''
    }
  })
}
