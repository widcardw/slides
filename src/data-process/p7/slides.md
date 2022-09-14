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

<div class="abs-br m-6 flex gap-2">
  <a href="https://slides.widcard.win/data-process/p7" target="_blank" 
    class="text-sm icon-btn opacity-50 !border-none !hover:text-white">
    SPA
  </a>
</div>

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
| 诊断试验 1 | <span text-red>43 真阳 TP</span>   | <span text-green>5 假阳 FP</span>  | 48  |
| 诊断试验 2 | <span text-red>7 假阴 FN</span>    | <span text-green>45 真阴 TN</span> | 52  |
| 合计    | 50       | 50     | 100 |

- 所有状态：<span text-red>真阳</span>，<span text-green>假阳</span>，<span text-green>真阴</span>，<span text-red>假阴</span>
- <span text-red>阳性</span>预测值：检测出<span text-red>有病</span>的人中，多少<span text-red>真正有病</span>
- <span text-green>阴性</span>预测值：检测数<span text-green>没病</span>的人中，多少<span text-green>真正没病</span>
- $TPR = { {\color{red}TP} \over {\color{red}TP} + {\color{red}FN} } = {被预测为{\color{red}阳性}的{\color{red}阳性}数 \over 实际{\color{red}阳性}数} = \color{red} 43/50$
- $FPR = { {\color{green}FP} \over {\color{green}FP} + {\color{green}TN} } = {被预测为{\color{red}阳性}的{\color{green}阴性}数 \over 实际{\color{green}阴性}数} = \color{green}5/50$

> TPR, FPR 的值都在 $[0,1]$ 内

::right::

<ScatterPlot title="" :num="50" xlabel="样本" ylabel="葡萄糖含量/(mmol/L)" :normal-center="{x: 0.7, y: 0.65}" :ill-center="{x: 0.4, y:0.52}" />

---
layout: two-cols
---

# ROC 曲线的绘制

- 将全部样本按 **预测概率递减** 顺序排列
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

<ScaPlot 
  title="" 
  x-label="FPR" y-label="TPR" 
  :x-range="[0, 1, 0.1]" :y-range="[0, 1, 0.1]" 
  :to-fix="1" :show-dec="true" 
  :pairs="[{data: [{x: 0, y: 0}, {x: 0, y: 0.2}, {x: 0, y: 0.4}, {x: 0.2, y: 0.4}, {x: 0.2, y: 0.6}, {x: 0.2, y: 0.8}, {x: 0.4, y: 0.8}, {x: 0.6, y: 0.8}, {x:0.8,y:0.8},{x:0.8,y:1},{x:1,y:1}], color: [0, 127, 255], line: true}]"
  h-full
/>

---

# 模型中的数据

```python
# 分割训练集和测试集
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=33, stratify=y)
# 根据模型对测试集进行预测
y_predict = lr.predict_proba(x_test)[:,1]
# 打印数据
print('\n'.join(map(lambda x: str(x), zip(y_predict[1000:1056].round(3), y_test[1000:1056]))))
```

<div grid="~ cols-7 gap-2">

```python {1}
(0.383, 1.0)
(0.297, 0.0)
(0.011, 0.0)
(0.105, 0.0)
(0.349, 0.0)
(0.248, 0.0)
(0.457, 0.0)
(0.119, 0.0)
```


```python {0}
(0.042, 0.0)
(0.036, 0.0)
(0.069, 0.0)
(0.100, 0.0)
(0.003, 0.0)
(0.070, 0.0)
(0.093, 0.0)
(0.138, 0.0)
```

```python {0}
(0.569, 0.0)
(0.026, 0.0)
(0.054, 0.0)
(0.088, 0.0)
(0.247, 0.0)
(0.965, 0.0)
(0.235, 0.0)
(0.303, 0.0)
```

```python {3,5,7}
(0.022, 0.0)
(0.385, 0.0)
(0.990, 1.0)
(0.012, 0.0)
(0.995, 1.0)
(0.086, 0.0)
(0.285, 1.0)
(0.137, 0.0)
```


```python {6,8}
(0.452, 0.0)
(0.131, 0.0)
(0.011, 0.0)
(0.919, 0.0)
(0.126, 0.0)
(0.945, 1.0)
(0.114, 0.0)
(0.038, 1.0)
```

```python {4,5}
(0.098, 0.0)
(0.040, 0.0)
(0.081, 0.0)
(0.071, 1.0)
(0.999, 1.0)
(0.032, 0.0)
(0.051, 0.0)
(0.092, 0.0)
```

```python {0}
(0.456, 0.0)
(0.197, 0.0)
(0.022, 0.0)
(0.379, 0.0)
(0.174, 0.0)
(0.054, 0.0)
(0.305, 0.0)
(0.371, 0.0)
```

</div>

- `y_predict` 中是预测为违约的概率，`y_test` 是 `Default` 一列的值
- 绘制 ROC 曲线前，先将预测概率从高到低排序，然后从 1 到 0 遍历，计算对应的 TPR 和 FPR 值
- 阈值的含义：我们认为，高于阈值的就判定为违约，低于阈值的就判定为未违约，并不是常识认为的 50% 为界限

---

<RocPlot />

---
layout: two-cols
---

# ROC 曲线所表达的含义

- 通常认为，曲线的 **凸起程度越高**，模型 **准确率越高**
  - 对角线相当于 **随机猜测**
  - 高于对角线的模型拥有 **更好的准确性**
  - 低于对角线的模型 **不如随机猜测**
- 在实训的银行信用风控模型中
  - TPR 表示预测为<span text-red>违约</span>，实际也为<span text-red>违约</span>的概率
  - FPR 表示预测为<span text-red>违约</span>，实际为<span text-green>未违约</span>的概率
- 图中 ${\color{green}M_1} > {\color{blue}M_2} >$ 对角线
- AUC 值就是 ROC 曲线下方的面积
  - AUC 值越大，表示模型的性能越好
  - AUC = 0.5 时，相当于随机猜测
- 最优临界点：找到一个阈值，使得 TPR 尽可能高，而 FPR 尽可能低

::right::

<ScaPlot 
  x-label="FPR" y-label="TPR" title="ROC" 
  :x-range="[0, 1, 0.1]" :y-range="[0, 1, 0.1]" 
  :to-fix="1" :show-dec="true" 
  :pairs="[
    {
      data: [{x:0,y:0},{x:0,y:0.05},{x:0.05, y:0.05},{x:0.05,y:0.25},{x:0.1,y:0.25},{x:0.1,y:0.4},{x:0.1,y:0.5},{x:0.15,y:0.5},{x:0.2,y:0.5},{x:0.2,y:0.6},
             {x:0.25,y:0.6},{x:0.25,y:0.65},{x:0.3,y:0.65},{x:0.3,y:0.7},{x:0.4,y:0.7},{x:0.5,y:0.75},{x:0.6,y:0.81},{x:0.7,y:0.85},{x:0.8,y:0.9},{x:1,y:1}], 
      color: [0, 127, 255],
      line: true
    },
    {
      data: [{x:0,y:0},{x:0,y:0.1},{x:0.05, y:0.1},{x:0.05,y:0.3},{x:0.1,y:0.3},{x:0.1,y:0.5},{x:0.1,y:0.6},{x:0.15,y:0.7},{x:0.2,y:0.7},{x:0.2,y:0.8},
             {x:0.25,y:0.8},{x:0.25,y:0.9},{x:0.3,y:0.9},{x:0.3,y:0.95},{x:0.4,y:0.95},{x:0.5,y:0.97},{x:0.6,y:0.97},{x:0.7,y:0.98},{x:0.8,y:0.98},{x:1,y:1}],
      color: [0, 192, 127],
      line: true
    }
  ]"
  h-full
/>

---
layout: two-cols
---

# ROC 曲线的特点

- 当测试集中的 **正负样本的分布变化** 的时候，ROC曲线能够保持不变
- (a)\(c\) 为 ROC 曲线，(b)(d) 为 Precision-Recall 曲线
  - $Precision={ {\color{red}TP} \over {\color{red}TP} + {\color{green}FP} }$
  - $Recall=TPR={ {\color{red}TP} \over {\color{red}TP} + {\color{red}FN} }$
- \(c\)(d) 将测试集中 **负样本的数量增加到原来的 10 倍**，ROC 曲线较为稳定，而 PR 曲线变化很大
- 在实际的数据集中经常会出现 **类不平衡现象**，即负样本比正样本多很多 (或者相反)，而且测试数据中的正负样本的分布也可能随着时间变化。在这种情况下，ROC 曲线在评估上有 **更好的稳定性**
- PR 曲线在正负样本分布得极不均匀时，能更有效地反映模型的好坏

::right::

![](https://static.plob.org/wp-content/uploads/2018/03/1520544675-3272-kNs1qZ8ibDjswYZS0SuVpWnjlcEQ.png)

> 图片来源：<https://www.plob.org/article/12476.html>

---

# 7.2 利用 AUC 评估逻辑回归模型准确性

<div grid="~ cols-2 gap-2">

```python
import matplotlib.pyplot as plt
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.externals import joblib
import pandas as pd
from sklearn import metrics
data = pd.read_table('dataset13.txt',sep='\t')
y = data['Default'].values
x = data.drop(['Default'], axis=1).values
# 划分训练集和测试集
x_train, x_test, y_train, y_test = train_test_split(
  x, y, test_size=0.2,random_state = 33,stratify=y)
# 加载模型
lr = joblib.load("train_model.m")
y_predict = lr.predict_proba(x_test)[:,1]

#用metrics.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(
  y_test, y_predict)
#用metrics.auc求出roc_auc的值
roc_auc = metrics.auc(fpr, tpr)
```

```python
#将图片大小设为8:6
fig,ax = plt.subplots(figsize=(8,6))

#将plt.plot里的内容填写完整
plt.plot(fpr, tpr, label = f'AUC = {roc_auc:.2f}')
 
#将图例显示在右下方
plt.legend(loc = 'lower right') 
 
#画出一条红色对角虚线
plt.plot([0, 1], [0, 1],'r--') 
 
#设置横纵坐标轴范围
plt.xlim([-0.01, 1.01]) 
plt.ylim([-0.01, 1.01])
 
#设置横纵名称以及图形名称
plt.ylabel('True Positive Rate')
plt.xlabel('False Positive Rate')
plt.title('Receiver Operating Characteristic Curve')
plt.show()
```

</div>

---

# 7.2 利用 AUC 评估逻辑回归模型准确性

<img src="/data-process/7.2.png" mx-auto>

---

# 使用 PR 曲线呈现

<div grid="~ cols-2" place-items-center>

<div>

```python
pre, rec, the2 = metrics.precision_recall_curve(
  y_test, y_predict
)
plt.plot(pre, rec)

plt.xlim([-0.01, 1.01]) 
plt.ylim([-0.01, 1.01])

plt.ylabel('Recall Rate')
plt.xlabel('Precision Rate')
plt.title('Precision-Recall Curve')
plt.show()
```

- 因为本实验中，正负样本分布不均匀，因此 PR 曲线呈现出的效果也有一定的参考价值

</div>

![](/data-process/prc.png)

</div>

---

# 7.3 利用 AUC 评估随机森林模型准确性

<div grid="~ cols-2 gap-2">

```python {all|13-14}
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.externals import joblib
from sklearn import metrics
import matplotlib.pyplot as plt
data = pd.read_table('dataset13.txt',sep='\t')
y = data['Default'].values
x = data.drop(['Default'], axis=1).values
# 划分训练集和测试集
x_train, x_test, y_train, y_test = train_test_split(
  x, y, test_size=0.2,random_state = 33,stratify=y)
# 加载模型
rf_clf = joblib.load("train_model2.m")
y_predict = rf_clf.predict_proba(x_test)[:,1]
#用metrics.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(
  y_test, y_predict)

#用metrics.auc求出roc_auc的值
roc_auc = metrics.auc(fpr, tpr)
```

```python
#将图片大小设为8:6
fig,ax = plt.subplots(figsize=(8,6))

#将plt.plot里的内容填写完整
plt.plot(fpr, tpr, label = f'AUC = {roc_auc:.2f}')

#将图例显示在右下方
plt.legend(loc = 'lower right') 

#画出一条红色对角虚线
plt.plot([0, 1], [0, 1],'r--') 

#设置横纵坐标轴范围
plt.xlim([-0.01, 1.01]) 
plt.ylim([-0.01, 1.01])

#设置横纵名称以及图形名称
plt.ylabel('True Positive Rate')
plt.xlabel('False Positive Rate')
plt.title('Receiver Operating Characteristic Curve')
plt.show()
```

</div>

<div v-click>

> 模型报错了！

</div>

---

# 6.12 使用网格搜索进行随机森林参数调优

```python {all|20}
import ...
data = pd.read_table('dataset13.txt',sep='\t')
y = data['Default'].values
x = data.drop(['Default'], axis=1).values
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,random_state = 33,stratify=y)

rf = RandomForestClassifier()

# 设置需要调试的参数
tuned_parameters = {'n_estimators': [180,190],'max_depth': [8,10]}

# 调用网格搜索函数
rf_clf = GridSearchCV(rf, tuned_parameters, scoring='roc_auc', n_jobs=2, cv=5)
rf_clf.fit(x_train, y_train)

y_predict = rf_clf.predict_proba(x_test)[:, 1]
test_auc = roc_auc_score(y_test, y_predict)
print ('随机森林模型test AUC:')
print (test_auc)
joblib.dump(rf_clf, 'train_model2.m')
```

<div v-click>

> 将训练好的模型下载后，上传至 7.3

</div>

---

# 7.3 利用 AUC 评估随机森林模型准确性

<img src="/data-process/7.3.png" mx-auto>

---
layout: center
---

- 工具：[Slidev](https://sli.dev)
- 绘图：[p5.js](https://p5js.org)
