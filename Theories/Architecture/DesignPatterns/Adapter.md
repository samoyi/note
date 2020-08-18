# State

Adapter is a structural design pattern that allows objects with incompatible interfaces to collaborate.


<!-- TOC -->

- [State](#state)
    - [1. 设计思想](#1-设计思想)
        - [SRP](#srp)
        - [对用户透明](#对用户透明)
    - [2. 抽象本质](#2-抽象本质)
    - [3. 实现原理](#3-实现原理)
    - [4. 适用场景](#4-适用场景)
    - [5. 缺点](#5-缺点)
    - [例子](#例子)
    - [和其他模式的关系](#和其他模式的关系)
    - [References](#references)

<!-- /TOC -->


## 1. 设计思想
### SRP
和代理模式一样，在不改变原对象的情况下做出功能修改

### 对用户透明
1. 被适配的对象不需要做出任何修改，甚至不会知道自己被适配了。
2. 因为适配器实现了和被适配对象相同的接口，所以使用原对象的对象也是无感知的。


## 2. 抽象本质
打补丁式的兼容


## 3. 实现原理
1. Make sure that you have at least two classes with incompatible interfaces:
    * A useful service class, which you can’t change (often 3rd-party, legacy or with lots of existing dependencies).
    * One or several client classes that would benefit from using the service class.
2. Declare the client interface and describe how clients communicate with the service.
3. Create the adapter class and make it follow the client interface. Leave all the methods empty for now.
4. Add a field to the adapter class to store a reference to the service object. The common practice is to initialize this field via the constructor, but sometimes it’s more convenient to pass it to the adapter when calling its methods.
5. One by one, implement all methods of the client interface in the adapter class. The adapter should delegate most of the real work to the service object, handling only the interface or data format conversion.
6. Clients should use the adapter via the client interface. This will let you change or extend the adapters without affecting the client code.


## 4. 适用场景
适配两个不兼容的对象


## 5. 缺点
1. 打补丁式的兼容会让过时或不良的设计苟延残喘。
2. 因为属于非正常的逻辑，因此会使程序的变得难以理解。
3. 有时需要的其实并不是对旧的设计打补丁兼容，而是应该直接重构。


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


## 和其他模式的关系
1. 有一些模式跟适配器模式的结构非常相似，比如装饰者模式、代理模式和外观模式。这几种模式都属于 “包装模式”，都是由一个对象来包装另一个对象。
2. 区别它们的关键仍然是模式的意图。
    * 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。
    * 装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象增加功能。装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。代理模式是为了控制对对象的访问，通常也只包装一次。
    * 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/state)
