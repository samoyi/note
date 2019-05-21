# Flyweight


## 设计思想
1. A flyweight is an object that minimizes memory usage by sharing as much data as possible with other similar objects; it is a way to use objects in large numbers when a simple repeated representation would use an unacceptable amount of memory. Often some parts of the object state can be shared, and it is common practice to hold them in external data structures and pass them to the objects temporarily when they are used.
2. 说到底，还是和函数传参一样的思想。
3. 只不过是这种思想用在对象上的一种特例。很多相似的对象并不需要分别创建实例，只需要一个实例，每次执行任务是传入不同的参数，产出不同的结果。而且这里抽离内部状态，也就只是相当于函数内部用到的若干常量而已。



## 内部状态与外部状态——内外只是名字，概念只是概念
1. 享元模式要求将对象的属性划分为内部状态与外部状态，关于如何划分内部状态和外部状态
    * 内部状态存储于对象内部。
    * 内部状态可以被一些对象共享。
    * 内部状态独立于具体的场景，通常不会改变。
    * 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
2. 这样一来，我们便可以把所有内部状态相同的对象都指定为同一个共享的对象。而外部状态可以从对象身上剥离出来，并储存在外部。
3. 剥离了外部状态的对象成为共享对象，外部状态在必要时被传入共享对象来组装成一个完整的对象。
4. 通常来讲，内部状态有多少种组合，系统中便最多存在多少个对象。
5. 虽然组装外部状态成为一个完整对象的过程需要花费一定的时间，但却可以大大减少系统中的对象数量，相比之下，这点时间或许是微不足道的。因此，享元模式是一种用时间换空间的优化模式。


## 例
TODO 混乱
```js
class Upload {
    constructor(uploadType){
        this.uploadType = uploadType;
    }

    delFile(id){
       uploadManager.setExternalState(id, this);  // (1)

       if (this.fileSize < 3000){
           return this.dom.parentNode.removeChild(this.dom);
       }

       if (window.confirm( '确定要删除该文件吗? ' + this.fileName)){
           return this.dom.parentNode.removeChild(this.dom);
       }
   }
}

const UploadFactory = (function(){
    let createdFlyWeightObjs = {};

    return {
        create(uploadType){
            if (createdFlyWeightObjs[ uploadType]){
                return createdFlyWeightObjs[uploadType];
            }

            return createdFlyWeightObjs[ uploadType] = new Upload(uploadType);
        }
    }
})();

const uploadManager = (function(){
    let uploadDatabase = {};

    return {
        add(id, uploadType, fileName, fileSize){
            let flyWeightObj = UploadFactory.create(uploadType);

            let dom = document.createElement('div');
            dom.innerHTML =
                    '<span style="opacity:0;">文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
                    '<button style="opacity:0;" class="delFile">删除</button>';

            dom.querySelector('.delFile').onclick = function(){
                flyWeightObj.delFile(id);
            }

            document.body.appendChild(dom);

            uploadDatabase[id] = {
                fileName,
                fileSize,
                dom,
            };

            return flyWeightObj;
        },

        setExternalState(id, flyWeightObj){
            let uploadData = uploadDatabase[id];
            for (let i in uploadData){
                flyWeightObj[i] = uploadData[i];
            }
        },
    }
})();


let id = 0;

function startUpload(uploadType, files){
   for (let i = 0, file; file = files[i]; i++){
        uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
   }
};

startUpload('plugin', [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.html',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 5000
    }
]);

startUpload('flash', [
    {
        fileName: '4.txt',
        fileSize: 1000
    },
    {
        fileName: '5.html',
        fileSize: 3000
    },
    {
        fileName: '6.txt',
        fileSize: 5000
    }
]);
```


## 对象池
对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接`new`，而是转从对象池里获取。如果对象池里没有空闲对象，则创建一个新的对象，当获取出的对象完成它的职责之后， 再进入池子等待被下次获取。

### 对象池实现
1. 模拟地图地名气泡。先定义一个获取小气泡节点的工厂，作为对象池的数组成为私有属性被包含在工厂闭包里，这个工厂有两个暴露对外的方法，`create`表示获取一个`div`节点，`recover`表示回收一个`div`节点
    ```js
    const toolTipFactory = (function(){
        const toolTipPool = [];    // toolTip 对象池

        return {
            create(){
                if ( toolTipPool.length === 0 ){
                    let div = document.createElement( 'div' );
                    document.body.appendChild( div );
                    return div;
                }
                else {
                    return toolTipPool.shift();
                }
            },
            recover( tooltipDom ){
                return toolTipPool.push( tooltipDom );
            }
        }
    })();
    ```
2. 第一次查询地点出现2个气泡，第二次查询出现6个气泡。但第二次并不是新创建了6个，而是先回收了之前的2个，再新创建4个
    ```js
    let ary = [];

    // 第一次查询，先创建两个新的 toolTip
    for ( let i = 0, str; str = [ 'A', 'B' ][ i++ ]; ){
        let toolTip = toolTipFactory.create();
        toolTip.innerHTML = str;
        ary.push( toolTip );
    };

    // 稍后第二次查询，重新绘制，这次有6个。重新绘制前先回收之前的2个，再创建6个时只需要创建4个新的 toolTip
    setTimeout(()=>{
        for ( let i = 0, toolTip; toolTip = ary[ i++ ]; ){
            toolTipFactory.recover( toolTip );
        };
        for ( let i = 0, str; str = [ 'A', 'B', 'C', 'D', 'E', 'F' ][ i++ ]; ){
            let toolTip = toolTipFactory.create();
            toolTip.innerHTML = str;
        };
    }, 5555);
    ```

### 通用对象池实现
1.  在对象池工厂里，把创建对象的具体过程封装起来，实现一个通用的对象池创建函数
    ```js
    const objectPoolFactory = function( createObjFn ){
        const objectPool = [];

        return {
            create(...args){
                return objectPool.length === 0
                        ? createObjFn(...args)
                        : objectPool.shift();
            },
            recover( obj ){
                objectPool.push( obj );
            }
        }
    };
    ```
2. 使用通用的对象池创建函数，创建一个 toolTip 对象池对象
    ```js
    function createToolTip(str){
        let div = document.createElement( 'div' );
        div.innerHTML = str;
        document.body.appendChild( div );
        return div;
    }
    const toolTipFactory = objectPoolFactory(createToolTip);

    let ary = [];

    for ( let i = 0, str; str = [ 'A', 'B' ][ i++ ]; ){
        let toolTip = toolTipFactory.create(str);
        ary.push( toolTip );
    };

    setTimeout(()=>{
        for ( let i = 0, toolTip; toolTip = ary[ i++ ]; ){
            toolTipFactory.recover( toolTip );
        };
        for ( let i = 0, str; str = [ 'A', 'B', 'C', 'D', 'E', 'F' ][ i++ ]; ){
            toolTipFactory.create(str);
        };
    }, 5555);
    ```
3. **通用性的实现思想**
    1. 一类对象可以实现对应的一类功能。
    2. 实现过程中某些部分可以通用，某些部分是差异化的。
    3. 提取出差异化。反正还是那点儿设计思想。
    

## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
