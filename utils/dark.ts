import { useDark } from '@vueuse/core'

export const isDark = useDark()

export function calcTextColor() {
  return isDark.value ? 255 : 0
}