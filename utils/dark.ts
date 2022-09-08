import { isDark } from '@slidev/client/logic/dark'

const DARK_COLOR = 18
const LIGHT_COLOR = 255

function calcTextColor() {
  return isDark.value ? LIGHT_COLOR : DARK_COLOR
}

export {
  isDark,
  DARK_COLOR,
  LIGHT_COLOR,
  calcTextColor
}
