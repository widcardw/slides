---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
drawings:
  persist: false
# use UnoCSS (experimental)
css: unocss
---

# 智能信息处理综合实践

7.1-7.3 风险评估模型效果评价方法 & ROC & AUC

widcardw

---

# 7.1 风险评估模型效果评价方法

- 准确性
  - **ROC 曲线** _<span text-gray>(receiver operating characteristic curve)</span>_
    - 通过 _<span text-green>真正率 TPR</span>_ 和 _<span text-red>假正率 FPR</span>_ 两个指标进行绘制
      - 真正率表示模型 _<span text-green>推测为真</span>_，而 _<span text-green>实际也为真</span>_ 的概率
      - 假正率表示模型 _<span text-green>推测为真</span>_，但 _<span text-red>实际为假</span>_ 的概率
    - 曲线与横轴之间的面积称为 _<span text-blue>AUC</span>_ _<span text-gray>(area under of curve)</span>_
      - AUC 的取值范围一般在 $[0.5,1]$ ，值越大表示模型效果越好
  - KS 检验
- 稳定性：模型是在特定时间点开发的，**是否对外部样本有效** 需要经过 **稳定性测试**。群体稳定性指标 (PSI) 是最常用的模型稳定性评价指标
- 可解释性：在逻辑回归和随机森林模型中，考量各个解释变量对目标变量预测结果的影响程度，可以得到模型指标重要性

<div v-click class="absolute -right-0 -top-5">

（云里雾里 不知所云）

</div>

---

# 了解 TPR & FPR

- 以糖尿病为例，糖尿病的重要诊断方法为随机静脉血浆葡萄糖含量 $\geqslant 11.1 \mathrm{mmol/L}$

<div grid="~ cols-2 gap-2">

<ScatterPlot title="理想" :num="20" xlabel="样本" ylabel="葡萄糖含量/(mmol/L)" :normal-center="{x: 0.4, y: 0.75}" :ill-center="{x: 0.7, y:0.4}" />

<ScatterPlot title="现实" :num="20" xlabel="样本" ylabel="葡萄糖含量/(mmol/L)" :normal-center="{x: 0.4, y: 0.65}" :ill-center="{x: 0.7, y:0.52}" />


</div>

---
layout: two-cols
---

# 了解 TPR & FPR

|         |  样本 1  |  样本 2  | 合计 |
|:-------:|:--------:|:-------:|:---:|
| 诊断试验 1 | <span text-red>43 真阳</span>   | <span text-green>5 假阳</span>  | 48  |
| 诊断试验 2 | <span text-red>7 假阴</span>    | <span text-green>45 真阴</span> | 52  |
| 合计    | 50       | 50     | 100 |

- 所有状态：<span text-red>真阳</span>，<span text-green>假阳</span>，<span text-green>真阴</span>，<span text-red>假阴</span>
- <span text-red>阳性</span>预测值：检测出<span text-red>有病</span>的人中，多少<span text-red>真正有病</span>
- <span text-green>阴性</span>预测值：检测数<span text-green>没病</span>的人中，多少<span text-green>真正没病</span>
- $TPR = {TP \over TP + FN} = {被预测为{\color{red}阳性}的{\color{red}阳性}数 \over 实际{\color{red}阳性}数} = \color{red} 43/50$
- $FPR = {FP \over FP + TN} = {被预测为{\color{red}阳性}的{\color{green}阴性}数 \over 实际{\color{green}阴性}数} = \color{green}5/50$

> TPR, FPR 的值都在 $[0,1]$ 内

::right::

<ScatterPlot title="" :num="50" xlabel="样本" ylabel="葡萄糖含量/(mmol/L)" :normal-center="{x: 0.7, y: 0.65}" :ill-center="{x: 0.4, y:0.52}" />

---
layout: two-cols
---

# ROC 曲线的绘制

- 将全部样本按 **概率递减** 顺序排列
- 阈值从 1 至 0 变更，计算各阈值下 $(FPR, TPR)$ 对 
- 将数值对绘制在直角坐标系中


<div text="sm" leading="tight">

| 样本 ID | 原本类别 | 预测为正 |样本 ID | 原本类型|预测为正|
|:------:|:-------:|:-----------:|:------:|:-------:|:-----------:|
| 1 | <span text-red>阳</span> | 0.95 | 6 |<span text-green>阴</span>|0.53|
| 2 | <span text-red>阳</span> | 0.86 | 7 |<span text-green>阴</span>|0.52|
| 3 |<span text-green>阴</span> | 0.70 | 8 |<span text-green>阴</span>|0.43|
| 4 |<span text-red>阳</span>|0.65| 9 |<span text-red>阳</span>|0.42|
| 5 |<span text-red>阳</span>|0.55| 10 |<span text-green>阴</span>|0.35|


</div>

::right::

<ScaPlot title="" x-label="样本" y-label="预测" :x-range="[0, 1, 0.1]" :y-range="[0, 1, 0.1]" :to-fix="1" :show-dec="true" :pairs="[{x: 0, y: 0}, {x: 0.1, y: 0.2}, {x: 0.15, y: 0.35}, {x: 0.2, y: 0.35}, {x: 0.3, y: 0.5}, {x: 0.5, y: 0.7}, {x: 0.6, y: 0.8}, {x: 0.8, y: 0.9}]" />


