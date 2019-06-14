# Adapter


## 设计思想
1. 如果现有的接口已经能够正常工作，那我们就永远不会用上适配器模式。适配器模式是一种“亡羊补牢”的模式，没有人会在程序的设计之初就使用它。
2. 因为没有人可以完全预料到未来的事情，也许现在好好工作的接口，未来的某天却不再适用于新系统，那么我们可以用适配器模式把旧接口包装成一个新的接口，使它继续保持生命力。
3. 比如在 JSON 格式流行之前，很多 cgi 返回的都是 XML 格式的数据，如果今天仍然想继续使用这些接口，显然我们可以创造一个 XML-JSON 的适配器。


## 例子
1. 假设我们正在编写一个渲染广东省地图的页面。目前从第三方资源里获得了广东省的所有城市以及它们所对应的ID，并且成功地渲染到页面中：
    ```js
    const GuangdongCities = [
        {
            name: 'city1',
            id: 11,
        },
        {
            name: 'city2',
            id: 12,
        },
    ];

    function render(cities){
        document.write(JSON.stringify(cities));
    }

    render(GuangdongCities);
    ```
2. 但后来因为某些原因，渲染出的数据结构必须变动，变成如下的结构：
    ```js
    const GuangdongCities = {
        city1: 11,
        city1: 22,
    };
    ```
3. 除了大动干戈地改写渲染页面的前端代码之外，另外一种更轻便的解决方式就是新增一个数据格式转换的适配器：
    ```js
    const GuangdongCities = [
        {
            name: 'city1',
            id: 11,
        },
        {
            name: 'city2',
            id: 12,
        },
    ];

    function render(cities){
        document.write(JSON.stringify(cities));
    }

    function citiesAdapter( oldCityList ){
        let cities = {};
        oldCityList.forEach((city)=>{
            cities[city.name] = city.id;
        })
        return cities;
    }

    render(citiesAdapter(GuangdongCities));
    ```


## 类似模式
有一些模式跟适配器模式的结构非常相似，比如装饰者模式、代理模式和外观模式。这几种模式都属于“包装模式”，都是由一个对象来包装另一个对象。区别它们的关键仍然是模式的意图。

* 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。
* 装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象增加功能。装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。代理模式是为了控制对对象的访问，通常也只包装一次。
* 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
