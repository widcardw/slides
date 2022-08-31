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

<style>
.two-columns {
  gap: 1rem;
}
</style>


# 智能信息处理综合实践

4.18-4.20

widcardw

---

# 离散型特征的取值


## 范例

| maritalStatus | education | idVerify | threeVerify | Default |
|:-------------:|:---------:|:--------:|:-----------:|:-------:|
|   已婚         |  高中     | 一致      |  一致        |  0      |
|   未婚         |  初中      | 一致      | 一致         |  0      |
|   未知        |  未知      | 不一致      | 不一致         |  1      |
| ...           | ...     | ...           | ...     | ...    |



## 特点


- 取值有限，例如 **婚姻情况** 只能取到 _已婚_、_未婚_、_未知_ 这 3 种值
- 这些取值大都有非数字性的特殊含义，可能不能直接进行加减运算，可以用 One-Hot 编码


---

# 连续型特征的取值

## 范例

| 银行存款/元 | 月支出/元 | 月收入/元 | 月交易次数/次 | 上网时间/小时 |
| ----------:| -------:| -------:| ------------:| -----------:|
| 1000000.00 | 4596.00 | 7890.00 |   34         |  120        |
| 1919810.00 | 10492.00| 114514.00|  114         | 514         |
| 0.00       | 0.00    | 0.00    | 0         | 20          |
| ...        | ...     | ...     | ...          | ...         |

## 特征

- 取值一般没有特殊限制，例如 RMB 金额一般只要求保留小数点后两位
- 一般都有数字性的意义，可以进行 _加减乘除_ 运算

---
layout: two-cols
---


# Series

| index |    value   |
|:------------:|:----------:|
|  0           | <span style="color: #b32535">Angular</span>    |
|  1           | <span style="color: #82d7f7">React</span>       |
|  2           | <span style="color: #65b687">Vue</span>       |
|  3           | <span style="color: #eb4f27">Svelte</span> |
|  4           | <span style="color: #3e5998">Solidjs</span> |
|  5           | <span style="color: #603cb2">Preact</span>      |

::right::

# Slice

- 由于 Series 相当于一维数组，因此可以像一维列表一样进行切片操作

```python {1|2|3|4|all}
>>> print(data[2])
Vue
>>> print(data[2:5])
[ Vue, Svelte, Solidjs ]
```

# Caution

- Slice 通常是一个 _拷贝_，对 Slice 进行修改并不会导致源数据的更改
- 如果想要修改源数据，必须使用 `data.loc[]` 方法来使用源数据的引用

---
layout: two-cols
---

# DataFrame

| index | Name  | Age | Gender |
|:-----:|:-----:|:---:|:------:|
| 0     | Giorno Giovanna  | 15  | male   |
| 1     | Bruno Buccellati | 20  | male   |
| 2     | Trish Una | 15  | female |
| 3     | Narancia Ghirga | 17 | male |
| 4     | Guīdo Mi4444ta | 18 | male |
| 5     | Leone Abbacchio | 21 | male |
| 6     | Pannacotta Fugo | 16 | male |

::right::

# Slice

- 使用单一索引只会得到一行或者一列的数据切片
- 使用双索引可以得到对应行和列的切片

<div grid grid-cols-2 gap-2>

```python {1|2-5|6|7-9|all}
>>> df['Name']
0   Giorno Giovanna
1   Bruno Buccellati
...
6   Pannacotta Fugo
>>> df.loc[0]
Name    Giorno Giovanna
Age     15
Gender  male
```

```python {1|2|3-6|7-9|all}
>>> df.loc[4, 'Name']
4   Guīdo Mi4444ta
>>> df.loc[
...   [2, 3], 
...   ['Age', 'Gender']
... ]
    Age   Gender
2    15     male
3    17     male
```

</div>

- 同样地，如果需要修改原始数据，必须使用 `df.loc` 来访问源数据的引用

```python
>>> df.loc[4, 'Name'] = 'Guīdo Mista'
>>> df.loc[4]
           Name   Age   Gender
4   Guīdo Mista    18     male
```

---

# 4.18 查看连续型特征的取值

- 已给出所有连续型特征列名，保存在 `continuous_columns` 中。
- 请借助 `min()` 函数查看数据各连续型特征的最小值。
- 将输出的连续型特征的最小值保存在变量 `data_con_min`，类型为 `Series`。

```python {1-4|all}
import pandas as pd
data = pd.read_table('dataset.txt',encoding='gbk',sep=' ')
# 所有连续型特征列名已保存在continuous_columns中
continuous_columns = ['age','cashTotalAmt','cashTotalCnt','monthCardLargeAmt','onlineTransAmt','onlineTransCnt','publicPayAmt','publicPayCnt','transTotalAmt','transTotalCnt','transCnt_non_null_months','transAmt_mean','transAmt_non_null_months','cashCnt_mean','cashCnt_non_null_months','cashAmt_mean','cashAmt_non_null_months','card_age']
# 查看数据各连续型特征的最小值
data_con_min = data[continuous_columns].min()
print(data_con_min)
```

<div grid grid-cols-3 gap-2>

```python
age                            19.0
cashTotalAmt                    0.0
cashTotalCnt                    0.0
monthCardLargeAmt               0.0
onlineTransAmt          -12676500.0
onlineTransCnt                  0.0

```

```python
publicPayAmt             -6034950.0
publicPayCnt                    0.0
transTotalAmt                   0.0
transTotalCnt                   0.0
transCnt_non_null_months        0.0
transAmt_mean                   0.0
```

```python
transAmt_non_null_months        0.0
cashCnt_mean                    0.0
cashCnt_non_null_months         0.0
cashAmt_mean                    0.0
cashAmt_non_null_months         0.0
card_age                        0.0
dtype: float64
```

</div>

---


# Filter

- 在 Numpy 中，我们常用以下操作来对数据进行过滤

```python {1|2|3|4|5|6|all}
>>> a
array([-1,  0,  1,  2,  3])
>>> a > 0
array([False, False,  True,  True,  True])
>>> a[a > 0]
array([1, 2, 3])
```

- 通常称之为 **Mask**，`a > 0` 相当于获取了一组**掩码**
- 在掩码的作用下，得到的切片就是过滤后的数组
- 对于二维数组，也同样生效

```python {1|2-3|4|5-6|7|8|all}
>>> b
array([[1, 2, 3],
       [4, 5, 6]])
>>> b > 4
array([[False, False, False],
       [False,  True,  True]])
>>> b[b > 4]
array([5, 6])  # flattened
```

---
layout: two-cols
---

# Pandas & Filter

| index | Name  | Age | Gender |
|:-----:|:-----:|:---:|:------:|
| 0     | Giorno Giovanna  | 15  | male   |
| 1     | Bruno Buccellati | 20  | male   |
| 2     | Trish Una | 15  | female |
| 3     | Narancia Ghirga | 17 | male |
| 4     | Guīdo Mista | 18 | male |
| 5     | Leone Abbacchio | 21 | male |
| 6     | Pannacotta Fugo | 16 | male |

::right::

- 依葫芦画瓢，pandas 中的数据过滤也就相当简单了

```python {1|all}
>>> df[df['Age'] < 18]
               Name  Age  Gender
0   Giorno Giovanna   15    male
2         Trish Una   15  female
3   Narancia Ghirga   17    male
6   Pannacotta Fugo   16    male
```

- 将所有 15 岁的成员改为 16 岁

```python {1|all}
>>> df.loc[df['Age'] == 15, 'Age'] = 16
>>> df
                Name  Age  Gender
0   Giorno Giovanna    16    male
1  Bruno Buccellati    20    male
2         Trish Una    16  female
...
```

- 如果直接对切片进行更改，源数据并不会变化

```python {1|all}
>>> df[df['Age'] == 16]['Age'] = 17
<stdin>:1: SettingWithCopyWarning:
A value is trying to be set on a copy of a slice from a DataFrame.
Try using .loc[row_indexer,col_indexer] = value instead
```

---

# 4.19 网上消费金额异常值检测

- 请从原始数据中筛选出网上消费金额小于 0 的数据
- 提取网上消费额小于 0 时网上消费金额 `onlineTransAmt` 和网上消费笔数 `onlineTransCnt` 这两列。
- 将结果赋予变量 `online_trans`，类型为 `DataFrame`。

```python {1-2|all}
import pandas as pd
data = pd.read_table('dataset.txt',encoding='gbk',sep=' ')
# 从原始数据中筛选出网上消费金额小于 0 时，网上消费金额和网上消费笔数这两列
online_trans = data[data['onlineTransAmt'] < 0][['onlineTransAmt', 'onlineTransCnt']]
                    # get rows that amt < 0     # slice two columns
print(online_trans)
```

<div grid grid-cols-2>

```python {0|all}
       onlineTransAmt  onlineTransCnt
0             -7710.0             2.0
2           -164560.0            39.0
4             -5260.0            15.0
5              -170.0            12.0
8            -55270.0            73.0
...               ...             ...

```

```python {0|all}
47328       -154975.0            80.0
47329       -167115.0            79.0
47332        -78832.0             6.0
47336       -175859.0            61.0

[16361 rows x 2 columns]
/opt/conda/envs/python35-paddle120-env/lib/python3.7/...
```

</div>

---

# 4.20 网上消费金额异常值处理

- 请将网上消费笔数为 0 时的网上消费金额皆修改为 0 。
- 将修正后的网上消费笔数为 0 时，网上消费笔数与网上消费金额两列数据赋予变量 `online_after`，类型为 `DataFrame`。

```python {1-2|1-4|all}
import pandas as pd
data = pd.read_table('dataset.txt',encoding='gbk',sep=' ')
# 将网上消费笔数为0时的网上消费金额皆修改为0
data.loc[data['onlineTransCnt'] == 0, 'onlineTransAmt'] = 0
# 查看修正后网上消费笔数为0时，网上消费金额与网上消费笔数
online_after = data[data["onlineTransCnt"] == 0][["onlineTransAmt","onlineTransCnt"]] 
print(online_after)
```

<div grid grid-cols-2>

```python {0|all}
       onlineTransAmt  onlineTransCnt
7                 0.0             0.0
12                0.0             0.0
14                0.0             0.0
16                0.0             0.0
17                0.0             0.0
...               ...             ...
```

```python {0|all}
47318             0.0             0.0
47324             0.0             0.0
47326             0.0             0.0
47334             0.0             0.0
47335             0.0             0.0

[14616 rows x 2 columns]
```

</div>
