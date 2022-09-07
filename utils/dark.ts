import { isDark } from '@slidev/client/logic/dark'

export const DARK_COLOR = 18
export const LIGHT_COLOR = 255

export function calcTextColor() {
  return isDark.value ? LIGHT_COLOR : DARK_COLOR
}
