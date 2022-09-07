<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core'
import p5 from 'p5'
import interpolate from '../utils/interpolate'
import { calcTextColor, DARK_COLOR, LIGHT_COLOR } from '../utils/dark';

const props = defineProps<{
  title: string
  num: number
  xlabel: string
  ylabel: string
  normalCenter: {
    x: number,
    y: number
  },
  illCenter: {
    x: number,
    y: number
  }
}>()

const dom = ref<HTMLElement>()
const { width: canvasW } = useElementSize(dom)
const p5Instance = ref<p5 | null>(null)

const randList: number[] = []
const dotSize = 1 / 100

for (let i = 0; i < props.num; i++) {
  randList.push(Math.random() - 0.5)
}

function sketch(s: p5) {
  s.setup = () => {
    p5Instance.value = s
    s.createCanvas(canvasW.value, canvasW.value)
  }

  s.draw = () => {
    s.background(calcTextColor() == DARK_COLOR ? LIGHT_COLOR : DARK_COLOR)
    s.stroke(127)
    // x 轴
    s.line(
      canvasW.value * 0.2, canvasW.value * 0.9,
      canvasW.value * 0.9, canvasW.value * 0.9
    )
    // y 轴
    s.line(
      canvasW.value * 0.2, canvasW.value * 0.9,
      canvasW.value * 0.2, canvasW.value * 0.1
    )
    const dashes = 21
    for (let i = 0; i < dashes; i += 2) {
      s.line(
        interpolate(canvasW.value * 0.2, canvasW.value * 0.9, i / dashes), canvasW.value * 0.6, 
        interpolate(canvasW.value * 0.2, canvasW.value * 0.9, (i + 1) / dashes), canvasW.value * 0.6,
      )
    }

    s.noStroke()
    const textColor = calcTextColor()
    s.fill(textColor)
    
    s.text(props.title, canvasW.value * 0.5, canvasW.value * 0.05, canvasW.value * 0.6, canvasW.value * 0.1)
    s.text(props.ylabel, canvasW.value * 0.05, canvasW.value * 0.05, canvasW.value * 0.5, canvasW.value * 0.1)
    s.text(props.xlabel, canvasW.value * 0.91, canvasW.value * 0.9)
    s.text('11.1', canvasW.value * 0.15, canvasW.value * 0.61)

    s.fill(20, 192, 50)
    for (let i = 0; i < props.num; i++) {
      const posX = canvasW.value * (props.normalCenter.x + randList[(i * 1.5) % props.num] / 10)
      const posY = canvasW.value * (props.normalCenter.y + randList[(2 * i) % props.num] / 4)
      const d = canvasW.value * dotSize;

      s.rect(posX, posY, d, d)
    }

    s.fill(255, 40, 30)
    for (let i = 0; i < props.num; i++) {
      const posX = canvasW.value * (props.illCenter.x + randList[props.num - i] / 10)
      const posY = canvasW.value * (props.illCenter.y + randList[(2 * i) % props.num] / 4)
      const d = canvasW.value * dotSize;

      s.rect(posX, posY, d, d)
    }
  }
}

onMounted(() => {
  if (dom) {
    new p5(sketch, dom.value)
  } 
})

watch(canvasW, (w) => {
  if (p5Instance.value && w > 0) {
    p5Instance.value.resizeCanvas(w, w)
  }
})

</script>

<template>
    <div ref="dom" />
</template>