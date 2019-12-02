# Basic


## 继承
<img src="./images/03.d01z.010.png" width="600" style="display: block;" />

### IS-A 关系 和 HAS-A 关系
#### IS-A关系 
1. 甲通过继承来使用乙的功能，甲是已的子类，则两者是 IS-A 关系，意为 甲“是”一种乙。
2. 例如 老虎 类继承了动物类，因而有了一些动物的功能，这里就可以说“老虎是动物”。
3. 在`./LogicGate.py`的例子中，`BinaryGate`和`LogicGate`之间就是 IS-A 关系关系。

#### HAS-A关系
1. 甲不通过继承而是直接引用乙的实例来使用乙的功能，则两者是 HAS-A 关系，意为 甲里面“有”乙。
2. 例如汽车里面装了空调而拥有了空调的功能，但不能使说汽车是一种空调或者是空调的子类，只能说汽车里面“有”空调。
3. 在`./LogicGate.py`的例子中，`Connector`和`LogicGate`之间就是 HAS-A 关系关系。
  <img src="./images/03.d01z.012.png" width="600" style="display: block;" />