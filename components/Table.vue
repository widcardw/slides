<script setup lang="ts">
const props = defineProps<{
  columns: string[]
  data: any[]
}>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="c in columns" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(d, i) in data" :key="i">
        <td 
          v-for="k in Object.keys(d)" :key="k" 
          :class="{ 
            'text-green': d[k] === '阴' || d[k] === 'TN' || d[k] === 'FP', 
            'text-red': d[k] === '阳' || d[k] === 'TP' || d[k] === 'FN'
          }"
        >{{ d[k] }}</td>
      </tr>
    </tbody>
  </table>
</template>
