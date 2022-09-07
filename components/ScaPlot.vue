<script setup lang="ts">
import p5 from 'p5'
import { ref, watch, onMounted } from 'vue';
import { useElementSize } from '@vueuse/core'
import interpolate from '../utils/interpolate';
import { calcTextColor, DARK_COLOR, LIGHT_COLOR } from '../utils/dark'
import { isDark } from '@slidev/client/logic/dark';

const props = withDefaults(defineProps<{
  title: string
  xLabel: string
  yLabel: string
  xRange: [number, number, number?]
  yRange: [number, number, number?]
  pairs: Array<{data: Array<{x: number, y: number}>, color: [number, number, number], line?: boolean}>
  toFix?: number
  showDec?: boolean
}>(), {
  toFix: 1,
  showDec: false,
})

const dom = ref<HTMLElement>()
const { width: cw, height: ch } = useElementSize(dom)
const p5Instance = ref<p5 | null>(null)

const tickRate = 0.01
const dotSize = 0.015
const halfDotSize = dotSize / 2
const buff = 0.1
let xSteps = 5
const dashes = 41
const xDis = props.xRange[1] - props.xRange[0]
if (props.xRange[2])
  xSteps = xDis / props.xRange[2]
let ySteps = 5
const yDis = props.yRange[1] - props.yRange[0]
if (props.yRange[2])
  ySteps = yDis / props.yRange[2]

function sketch(s: p5) {
  s.setup = () => {
    p5Instance.value = s
    s.createCanvas(cw.value, cw.value)
  }
  s.draw = () => {
    s.background(isDark.value ? DARK_COLOR : LIGHT_COLOR)
    const origin = {
       x: interpolate(cw.value * buff, cw.value * (1 - buff), - props.xRange[0] / xDis),
       y: interpolate(ch.value * (1 - buff), ch.value * buff, - props.yRange[0] / yDis),
    }
    s.stroke(127)

    // x axis
    s.line(
      cw.value * buff, 
      origin.y,
      cw.value * (1 - buff), 
      origin.y
    )
    // y axis
    s.line(
      origin.x,
      ch.value * buff,
      origin.x,
      ch.value * (1 - buff)
    )
    // x ticks
    for (let i = 0; i <= xSteps; i++) {
      const x = interpolate(cw.value * buff, cw.value * (1 - buff), i / xSteps)
      s.line(
        x,
        origin.y + ch.value * tickRate,
        x,
        origin.y - ch.value * tickRate,
      )
    }
    // y ticks
    for (let i = 0; i <= ySteps; i++) {
      const y = interpolate(ch.value * buff, ch.value * (1 - buff), i / ySteps)
      s.line(
        origin.x - cw.value * tickRate,
        y,
        origin.x + cw.value * tickRate,
        y
      )
    }
    // 对角线
    s.stroke(255, 127, 0)
    for (let i = 0; i < dashes; i += 2) {
      s.line(
        interpolate(cw.value * buff, cw.value * (1 - buff), i / dashes), 
        interpolate(ch.value * (1 - buff), ch.value * buff, i / dashes),
        interpolate(cw.value * buff, cw.value * (1 - buff), (i + 1) / dashes), 
        interpolate(ch.value * (1 - buff), ch.value * buff, (i + 1) / dashes)
      )
    }
    s.noStroke()
    s.fill(0, 127, 255)
    // Dots
    for (let data of props.pairs) {
      let [lastX, lastY] = [0, 0]
      // 着色
      s.fill(data.color[0], data.color[1], data.color[2])
      s.stroke(data.color[0], data.color[1], data.color[2])
      // 画点
      for (let i = 0; i < data.data.length; i++) {
        const p = data.data[i]
        const x = interpolate(cw.value * buff, cw.value * (1 - buff), (p.x - props.xRange[0]) / xDis)
        const y = interpolate(ch.value * (1 - buff), ch.value * buff, (p.y - props.yRange[0]) / yDis)
        s.rect(
          x - cw.value * halfDotSize,
          y - ch.value * halfDotSize,
          dotSize * cw.value, dotSize * cw.value
        )
        if (data.line && i !== 0) {
          s.line(lastX, lastY, x, y)
        }
        lastX = x
        lastY = y
      }
    }
    // text
    s.noStroke()
    s.fill(calcTextColor())
    s.text(props.title, cw.value * 0.5, 0, cw.value, ch.value * 0.1)
    s.text(props.yLabel, origin.x, ch.value * 0.07)
    s.text(props.xLabel, cw.value * (1 - buff + 0.01), origin.y)

    const b = ch.value * 0.05
    const b2 = cw.value * 0.07
    if (props.showDec){
      // 刻度数字
      for (let i = 0; i <= xSteps; i++) {
        const x = interpolate(cw.value * buff, cw.value * (1 - buff), i / xSteps)
        s.text(
          interpolate(props.xRange[0], props.xRange[1], i / xSteps).toFixed(props.toFix),
          x, origin.y + b
        )
      }
      for (let i = 1; i <= ySteps; i++) {
        const y = interpolate(ch.value * (1 - buff), ch.value * buff, i / ySteps)
        s.text(
          interpolate(props.yRange[0], props.yRange[1], i / ySteps).toFixed(props.toFix),
          origin.x - b2, y
        )
      }
    }
  }
}

watch([cw, ch], ([w, h]) => {
  if (p5Instance.value && w > 0 && h > 0) {
    p5Instance.value.resizeCanvas(w, h)
  }
})

onMounted(() => {
  if (dom) {
    new p5(sketch, dom.value)
  }
})
</script>

<template>
  <div ref="dom" />
</template>