# Testing


## 测试 Mutation
1. Mutation 很容易被测试，因为它们仅仅是一些完全依赖参数的函数。
2. 如果你在`store.js`文件中默认输出了`Vuex.Store`的实例，那么你仍然可以再单独输出
 mutations 以供测试
    ```js
    const state = {
        count: 0,
    };
    export const mutations = { // 仅供测试用的输出
        increment: state => state.count++
    };

    export const store = new Vuex.Store({
        strict: true,
        state,
        mutations,
    });
    ```
3. 使用 Mocha 测试 mutation 的例子
    ```js
    const assert = require('assert');

    import { mutations } from '../src/store/index'
    const { increment } = mutations;

    describe('mutations', () => {
        it('INCREMENT', () => {
            // 模拟状态
            const state = { count: 0 };
            // 应用 mutation
            increment(state);
            // 断言结果
            assert.equal(state.count, 1);
        });
    });
    ```


## 测试 Action


## 测试 Getter
和 Mutation 的测试是方法类似
```js
// store
const state = {
    persons: [
        {
            name: '33',
            isVTuber: false,
        },
        {
            name: 'Hime',
            isVTuber: true,
        },
        {
            name: 'Hina',
            isVTuber: true,
        },
    ],
};
export const getters = {
    VTubers(state){
        return state.persons.filter(person=>{
            return person.isVTuber;
        });
    },
};

export const store = new Vuex.Store({
    strict: true,
    state,
    getters,
});
```
```js
// test
const assert = require('assert');

import { getters } from '../src/store/index'
const { VTubers } = getters;

describe('getters', () => {
    it('VTubers', () => {
        const state = {
            persons: [
                {
                    name: '33',
                    isVTuber: false,
                },
                {
                    name: 'Hime',
                    isVTuber: true,
                },
                {
                    name: 'Hina',
                    isVTuber: true,
                },
            ],
        };

        assert.deepEqual(VTubers(state), [
            {
                name: 'Hime',
                isVTuber: true,
            },
            {
                name: 'Hina',
                isVTuber: true,
            },
        ]);
    });
});
```
