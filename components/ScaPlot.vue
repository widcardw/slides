<script setup lang="ts">
import p5 from 'p5'
import { ref, watch, onMounted } from 'vue';
import { isDark } from '../utils/dark';
import { useElementSize } from '@vueuse/core'
import interpolate from '../utils/interpolate';
import { calcTextColor } from '../utils/dark'
const props = withDefaults(defineProps<{
  title: string
  xLabel: string
  yLabel: string
  xRange: [number, number, number?]
  yRange: [number, number, number?]
  pairs: Array<{x: number, y: number}>
  toFix?: number
  showDec?: boolean
}>(), {
  toFix: 0,
  showDec: false
})
const p5Instance = ref<p5 | null>(null)
const dom = ref<HTMLElement>()
const { width: cw } = useElementSize(dom)

const tickRate = 0.01
const dotSize = 0.02
const halfDotSize = dotSize / 2
const buff = 0.1
let xSteps = 5
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
    const origin = {
       x: interpolate(cw.value * buff, cw.value * (1 - buff), - props.xRange[0] / xDis),
       y: interpolate(cw.value * (1 - buff), cw.value * buff, - props.yRange[0] / yDis),
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
      cw.value * buff,
      origin.x,
      cw.value * (1 - buff)
    )
    // x ticks
    for (let i = 0; i <= xSteps; i++) {
      const x = interpolate(cw.value * buff, cw.value * (1 - buff), i / xSteps)
      s.line(
        x,
        origin.y + cw.value * tickRate,
        x,
        origin.y - cw.value * tickRate,
      )
    }
    // y ticks
    for (let i = 0; i <= ySteps; i++) {
      const y = interpolate(cw.value * buff, cw.value * (1 - buff), i / ySteps)
      s.line(
        origin.x - cw.value * tickRate,
        y,
        origin.x + cw.value * tickRate,
        y
      )
    }
    s.noStroke()
    s.fill(0, 127, 255)
    // Dots
    for (let pair of props.pairs) {
      const x = interpolate(cw.value * buff, cw.value * (1 - buff), (pair.x - props.xRange[0]) / xDis)
      const y = interpolate(cw.value * (1 - buff), cw.value * buff, (pair.y - props.yRange[0]) / yDis)
      s.rect(
        x - cw.value * halfDotSize,
        y - cw.value * halfDotSize,
        dotSize * cw.value, dotSize * cw.value
      )
    }
    // text
    const textColor = calcTextColor()
    s.fill(textColor)
    s.textAlign('center')
    s.text(props.title, 0, 0, cw.value, cw.value * 0.1)
    s.text(props.yLabel, origin.x, cw.value * 0.09)
    s.textAlign('left')
    s.text(props.xLabel, cw.value * (1 - buff + 0.01), origin.y)

    s.textAlign('center')
    const b = cw.value * 0.05
    if (props.showDec){
      // 刻度数字
      for (let i = 0; i <= xSteps; i++) {
        const x = interpolate(cw.value * buff, cw.value * (1 - buff), i / xSteps)
        s.text(
          interpolate(props.xRange[0], props.xRange[1], i / xSteps).toFixed(props.toFix),
          x, origin.y + b
        )
      }
      s.textAlign('right')
      for (let i = 1; i <= ySteps; i++) {
        const y = interpolate(cw.value * (1 - buff), cw.value * buff, i / ySteps)
        s.text(
          interpolate(props.yRange[0], props.yRange[1], i / ySteps).toFixed(props.toFix),
          origin.x - b, y
        )
      }
    }
  }
}

watch(cw, (w) => {
  if (p5Instance.value && w > 0) {
    p5Instance.value.resizeCanvas(w, w)
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