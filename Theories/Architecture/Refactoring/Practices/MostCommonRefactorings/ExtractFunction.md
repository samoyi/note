# Extract Function


<!-- TOC -->

- [Extract Function](#extract-function)
    - [原则](#原则)
    - [场景](#场景)
        - [一个 88 行函数的重构](#一个-88-行函数的重构)
            - [原代码](#原代码)
            - [原代码分析](#原代码分析)
            - [重构后](#重构后)
            - [重构后分析](#重构后分析)
        - [请求数据的逻辑和处理数据的逻辑分离](#请求数据的逻辑和处理数据的逻辑分离)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则


## 场景
### 一个 88 行函数的重构
#### 原代码
```js
initCases() {
    let cases = this.historyActivity;
    let caseList = [];

    function tagIndexInCaseList(id) {
        id = parseInt(id);
        let indexResult = -1;
        caseList.find((item, index) => {
            if (item.tagId === id) {
                indexResult = index;
                return true;
            }
        });
        return indexResult;
    }
    cases = cases.filter((item, index) => {
        if (!item.sportStartTime) {
            // console.error('caseItem.sportStartTime',item.sportStartTime,index)
            // return false
            item.sportStartTime = "1970-01-01";
        }
        return item.sportStartTime;
    });
    cases.forEach((caseItem, index) => {
        let timeArr = caseItem.sportStartTime.split("-");
        // timeArr[0]
        caseItem.timestamp = helper.formatTimeToTimestamp(
            caseItem.sportStartTime
        );
        caseItem.monthTimestamp = new Date(
            parseInt(timeArr[0]),
            parseInt(timeArr[1] - 1)
        );
        caseItem.monthTimestamp = caseItem.monthTimestamp.getTime();
        caseItem.shootMonth = timeArr[0];
    });
    cases.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });
    cases.forEach(caseItem => {
        if (!!!caseItem.albumTag) {
            return;
        }
        let tagIds = caseItem.albumTag.tagIds.split(",");
        let tagNames = caseItem.albumTag.tagName.split(",");
        tagIds.forEach((tagId, index) => {
            let tagIndex = tagIndexInCaseList(tagId);
            if (tagIndex === -1) {
                caseList.push({
                    tagName: tagNames[index],
                    tagId: parseInt(tagId),
                    cases: [caseItem]
                    //todo : group by month
                });
            } else {
                caseList[tagIndex].cases.push(caseItem);
            }
        });
    });
    caseList.unshift({
        tagName: "全部",
        tagId: -1,
        cases: cases
    });
    caseList.forEach((caseTag, index) => {
        let casesTemp = [],
            crrtIndex = -1;
        caseTag.cases.forEach(caseItem => {
            if (
                casesTemp.length > 0 &&
                caseItem.shootMonth === casesTemp[crrtIndex].month
            ) {
                casesTemp[crrtIndex].cases.push(caseItem);
            } else {
                crrtIndex++;
                casesTemp.push({
                    month: caseItem.shootMonth,
                    cases: [caseItem]
                });
            }
        });
        caseTag.cases = casesTemp;
    });
    this.caseList = caseList[0].cases;
}
```

#### 原代码分析
这个函数其实有很多问题，属于匆忙完成后没有及时整理重构的情况：
* `!!!caseItem.albumTag` 警示一般的三感叹号判断！！！
* 而且根据业务，这个判断永远是 `true`，所以它所在的 `forEach` 没有意义了。但当初并没有及时删除这段代码。
* 因为上一条，所以 `tagIndexInCaseList` 也没有意义了。
* 那个 `filter` 永远都会返回真知，所以其实就是 `foreach`。
* 因为 `filter` 可以改成 `foreach`，所以就可以和下面的 `foreach` 合并成一个迭代了。
* `monthTimestamp` 属性没有被用到
* `caseItem.shootMonth = timeArr[0];` 赋值的内容实际上是年而不是月，也许是需求从月变成了年，但是属性名没有变。
* `caseList` 实际上只有 `unshift` 进去的那一项，而且倒数第二行 `this.caseList = caseList[0].cases;` 可以看出来，实际有用的也只是那个 `cases`，所以 `caseList.forEach` 就没必要了。
* 这个没用的 `forEach` 里面有几个也可以调整一下，比如变量 `crrtIndex` 的命名就比较奇怪。

#### 重构后
```js
addFields (activities) {
    function addDefaultDate (item) {
        if (!item.sportStartTime) {
            item.sportStartTime = "1970-01-01";
        }
        return item;
    }
    function addTimeStampField (item) {
        item.timestamp = helper.formatTimeToTimestamp(item.sportStartTime);
        return item;
    }
    function addYearField (item) {
        item.shootYear = item.sportStartTime.split("-")[0];
        return item;
    }
    activities.forEach((caseItem, index) => {
        addDefaultDate(caseItem);
        addTimeStampField(caseItem);
        addYearField(caseItem);
    });
    return activities;
},
descendingSort (activities) {
    activities.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });
    return activities;
},
sortByYear (activities) {
    let sorted = [];
    activities.forEach(item => {
        let lastIndex = sorted.length - 1;
        if (lastIndex > -1 && item.shootYear === sorted[lastIndex].year) {
            sorted[lastIndex].cases.push(item);
        } 
        else {
            sorted.push({
                year: item.shootYear,
                cases: [item]
            });
        }
    });
    return sorted;
},
formatActivities() {
    let activities = this.historyActivity;
    activities = this.addFields(activities);
    activities = this.descendingSort(activities);
    activities = this.sortByYear(activities);
    this.activities = activities;
},
```

#### 重构后分析
* 最明显的就是 `formatActivities` 意图与实现分离了。
* 之前需要仔细看才能知道干什么的几个代码段，现在封装为函数，从名字就能看出来。
* `addFields` 内部虽然定义了三个嵌套函数，但因为 `addFields` 只会被调用一次，所以也无所谓，不会重复声明内部被嵌套的函数。在这种情况下，放在里面更加清晰。
* 降序排序的代码本来就很短，仅从长度上来说不需要封装为 `descendingSort`。但封装为函数后，在 `formatActivities` 仅仅通过三个函数名就可以很舒服的看到 `addFields` - `descendingSort` - `sortByYear` 这种处理流程。

### 请求数据的逻辑和处理数据的逻辑分离
1. 常常看到请求接口的函数里面在获取到数据之后原地处理数据
    ```js
    function getUserInfo () {
        ajax('http:// xxx.com/userInfo', function( data ){
            console.log( 'userId: ' + data.userId );
            console.log( 'userName: ' + data.userName );
            console.log( 'nickName: ' + data.nickName );
        });
    };
    ```
2. 如果处理数据的逻辑比较简单倒还好，但经常会看到一些复杂的处理逻辑也写在请求的函数里。
3. 所以可以把处理的逻辑独立出来
    ```js
    function getUserInfo() {
        ajax( 'http:// xxx.com/userInfo', function( data ){
            printUserInfo( data );
        });
    };

    function printUserInfo (data) {
        console.log( 'userId: ' + data.userId );
        console.log( 'userName: ' + data.userName );
        console.log( 'nickName: ' + data.nickName );
    };
    ```
    
    
## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
