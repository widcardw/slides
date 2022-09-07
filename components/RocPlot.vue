<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import Table from './Table.vue';
import Slider from './Slider.vue';
const toFix = ref(1)
const lim = ref(1)
const pairs = ref<Array<{x: number, y: number}>>([{ x: 0, y: 0 }])
const table = reactive({
    columns: ['ID', '实际', '预测为正', `阈值 = ${lim.value.toFixed(toFix.value)}`, '属于'],
    data: [
        { id: 1, act: '阳', proba: 0.95, pre: '', label: '' },
        { id: 2, act: '阳', proba: 0.86, pre: '', label: '' },
        { id: 3, act: '阴', proba: 0.70, pre: '', label: '' },
        { id: 4, act: '阳', proba: 0.65, pre: '', label: '' },
        { id: 5, act: '阳', proba: 0.55, pre: '', label: '' },
        { id: 6, act: '阴', proba: 0.53, pre: '', label: '' },
        { id: 7, act: '阴', proba: 0.52, pre: '', label: '' },
        { id: 8, act: '阴', proba: 0.43, pre: '', label: '' },
        { id: 9, act: '阳', proba: 0.42, pre: '', label: '' },
        { id: 10, act: '阴', proba: 0.35, pre: '',label: '' },
    ]
})

const pos = 5
const neg = 5

const tpr = computed(() => {
    return table.data.filter(it => it.label === 'TP').length / pos
})

const fpr = computed(() => {
    return table.data.filter(it => it.label === 'FP').length / neg
})

watch(lim, (l) => {
    table.columns[3] = `阈值 = ${l.toFixed(toFix.value)}`
    for (let d of table.data) {
        if (d.proba >= l){
            d.pre = '阳'
        }
        else{
            d.pre = '阴'
        }
        if (d.pre === '阳' && d.act === '阳') {
            d.label = 'TP'
        } else if (d.pre === '阳' && d.act === '阴') {
            d.label = 'FP'
        } else if (d.pre === '阴' && d.act === '阳') {
            d.label = 'FN'
        } else if (d.pre === '阴' && d.act === '阴') {
            d.label = 'TN'
        }
    }
    const pair = { x: fpr.value, y: tpr.value }
    if (!pairs.value.find(it => it.x === pair.x && it.y === pair.y)){
        pairs.value.push(pair)
        pairs.value.sort((o1, o2) => o1.y - o2.y || o1.x - o2.x)
    }
})
</script>

<template>
    <div grid="~ cols-2 gap-2">
        <Table :columns="table.columns" :data="table.data" text="sm center" leading="tight" />
        <div flex="~ col">
            <div>
                <div flex space-x-2 items-center>
                    <Slider v-model="lim" :max-value="1" :min-value="0" :step="1 / 10 ** toFix" flex-1 />
                    <input v-model.number="toFix" type="number" min="1" max="2" bg="transparent" w-2rem border="~ zinc rounded" outline="!none" p="l-1">
                    <div cursor-pointer i-carbon-renew @click="() => { pairs = [{x:0,y:0}]; lim = 1 }" />
                </div>
                <div>
                    <p>FPR = 被预测为<span text-red>阳性</span>的<span text-green>阴性</span>数 / 实际的<span text-green>阴性</span>数 = {{ fpr.toFixed(toFix) }}</p>
                    <p>TPR = 被预测为<span text-red>阳性</span>的<span text-red>阳性</span>数 / 实际的<span text-red>阳性</span>数 = {{ tpr.toFixed(toFix) }}</p>
                </div>
            </div>
            <ScaPlot 
                x-label="FPR" y-label="TPR" title="ROC" 
                :x-range="[0, 1, 0.1]" :y-range="[0, 1, 0.1]" 
                :to-fix="toFix" 
                :pairs="[{data: pairs, color: [0, 127, 255], line: true}]" flex-1 
                :show-dec="true"
            />
        </div>
    </div>
</template>