import { type Component } from 'vue'

export interface ReplaceConfig {
  pattern: RegExp
  replacement: string
}

export type IconMenuItem = {
  index: string
  title: string
  icon: Component
  size?: number
  actionColor?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  onSelect?: () => void
  onClick?: () => void
}
