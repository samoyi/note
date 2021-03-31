# Split Parameter Object

inverse of *Introduce Parameter Object*


## 思想
东西越多，需要处理的就越多，副作用就越多。


## Motivation
不要为了图方便而传整个对象。如果接收方实际上只需要对象中的少部分属性，那传整个对象就没有必要，而且会带来一些副作用。

### 明确接收方逻辑
1. 相比于传整个对象，传具体的属性可以更明确的体现出接收方的意图，因为你知道它具体使用了哪些数据。
2. 例如一个函数 `makePhotoCall` 是给某个用户打电话，那么相比于传整个 `userInfo`，还是只传 `userInfo.name` 和 `userInfo.phoneNum` 更清晰。
3. 这样当你要对 `userInfo` 进行修改时，就能很快的看出来是否会对 `makePhotoCall` 造成影响。
4. 这个例子也许不是很明显，因为 `makePhotoCall` 已经比较明确的表明了自己可能需要的数据。但还有很多情况仅从接收方 API 的名字不能明确的了解，例如一个公共的 UI 组件，常常就不能很明确的从组件名字里看出需要哪些数据。

### 可复用性
1. 比如还是上面的 `makePhotoCall`，如果被设计为要接受 `userInfo` 对象，那它内部就必须要从对象中取到名为 `name` 和 `phoneNum` 的两个属性。
2. 但如果这个函数想用在 `userInfo` 以外其他地方，那也要保证传入的对象有这两个属性，如果没有的话，那就要对传入的数据包装一下保证有这两个属性。
3. 显然在这种可复用的场景下，直接传具体的值会更方便。
4. 当然如果参数比较多，而且它们逻辑上确实是一个整体，那么还是应该作为一个整体接受。只不过它里面的属性名应该是公用的，而不应该是耦合某一类对象。

### 数据变化监听的问题
1. 比如接收方只需要 `obj.a`，然后还会希望在 `obj.a` 变化是进行更新。
2. 如果外部传给接收方的是整个 `obj` 对象，内部如果是监听 `obj` 的话，外部 `obj.a` 更改的话，内部就无法监听到。
3. 这种情况下内部需要实现深入监听 `obj` 对象的 `a` 属性才能实现需求。而如果是直接传给接收方 `obj.a` 的话，监听就会比较方便。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
* [Front end component design principles](https://engineering.carsguide.com.au/front-end-component-design-principles-55c5963998c9)
