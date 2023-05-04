# 组件 v-model


<!-- TOC -->

- [组件 v-model](#组件-v-model)
    - [两种实现方法](#两种实现方法)
    - [修改 prop 和 emit 中的参数名](#修改-prop-和-emit-中的参数名)
    - [处理 `v-model` 修饰符​](#处理-v-model-修饰符​)
    - [References](#references)

<!-- /TOC -->


## 两种实现方法
1. 而当使用在一个组件上时，`v-model` 会被展开为如下的形式：
    ```html
    <CustomInput
        :modelValue="searchText"
        @update:modelValue="newValue => searchText = newValue"
    />
    ```
2. 因此，要让这个例子实际工作起来，`<CustomInput>` 组件内部需要做两件事
    * 将内部原生 `<input>` 元素的 `value` attribute 绑定到 `modelValue` prop
    * 当原生的 `input` 事件触发时，触发一个携带了新值的 `update:modelValue` 自定义事件
3. 这里是 `<CustomInput>` 组件内部实现的代码
    ```vue
    <script setup>
    defineProps(['modelValue'])
    defineEmits(['update:modelValue'])
    </script>

    <template>
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    </template>
    ```
4. 现在 `v-model` 可以在这个组件上正常工作了：
    ```html
    <CustomInput v-model="searchText" />
    ```
5. 另一种在组件内实现 `v-model` 的方式是使用一个可写的，同时具有 getter 和 setter 的 `computed` 属性。get 方法需返回 `modelValue` prop，而 set 方法需触发相应的事件
    ```vue
    <!-- CustomInput.vue -->
    <script setup>
    import { computed } from 'vue'

    const props = defineProps(['modelValue'])
    const emit = defineEmits(['update:modelValue'])

    const value = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })
    </script>

    <template>
        <input v-model="value" />
    </template>
    ```


## 修改 prop 和 emit 中的参数名
1. 默认情况下，`v-model` 在组件上都是使用 `modelValue` 作为 prop，并以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来更改这些名字
    ```html
    <MyComponent v-model:title="bookTitle" />
    ```
2. 在这个例子中，子组件应声明一个 `title` prop，并通过触发 `update:title` 事件更新父组件值
    ```vue
    <!-- MyComponent.vue -->
    <script setup>
    defineProps(['title'])
    defineEmits(['update:title'])
    </script>

    <template>
        <input
            type="text"
            :value="title"
            @input="$emit('update:title', $event.target.value)"
        />
    </template>
    ```
3. 通过修改参数名，就可以实现多个 `v-model` 绑定
    ```html
    <UserName
        v-model:first-name="first"
        v-model:last-name="last"
    />
    ```
    ```vue
    <script setup>
        defineProps({
            firstName: String,
            lastName: String
        })

        defineEmits(['update:firstName', 'update:lastName'])
    </script>

    <template>
        <input
            type="text"
            :value="firstName"
            @input="$emit('update:firstName', $event.target.value)"
        />
        <input
            type="text"
            :value="lastName"
            @input="$emit('update:lastName', $event.target.value)"
        />
    </template>
    ```


## 处理 `v-model` 修饰符​
1. 我们来创建一个自定义的修饰符 `capitalize`，它会自动将 `v-model` 绑定输入的字符串值第一个字母转为大写
    ```html
    <MyComponent v-model.capitalize="myText" />
    ```
2. 组件的` v-model` 上所添加的修饰符，可以通过 `modelModifiers` prop 在组件内访问到。在下面的组件中，我们声明了 `modelModifiers` 这个 prop，它的默认值是一个空对象
    ```vue
    <script setup>
        const props = defineProps({
            modelValue: String,
            modelModifiers: { default: () => ({}) }
        })

        defineEmits(['update:modelValue'])

        console.log(props.modelModifiers) // { capitalize: true }
    </script>

    <template>
        <input
            type="text"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </template>
    ```
3. 有了这个 prop，我们就可以检查 `modelModifiers` 对象的键，并编写一个处理函数来改变抛出的值。在下面的代码里，我们就是在每次 `<input />` 元素触发 `input` 事件时将值的首字母大写：
    ```vue
    <script setup>
        const props = defineProps({
            modelValue: String,
            modelModifiers: { default: () => ({}) }
        })

        const emit = defineEmits(['update:modelValue'])

        function emitValue(e) {
            let value = e.target.value
            if (props.modelModifiers.capitalize) {
                value = value.charAt(0).toUpperCase() + value.slice(1)
            }
            emit('update:modelValue', value)
        }
    </script>

    <template>
        <input type="text" :value="modelValue" @input="emitValue" />
    </template>
    ```
3. 上面是默认的没有修改 `v-model` 参数名的情况，如果修改了的话，修饰符的 prop 就不再是 `modelModifiers`，而是 `{参数名}Modifiers`
    ```html
    <MyComponent v-model:title.capitalize="myText">
    ```
    ```js
    const props = defineProps(['title', 'titleModifiers'])
    defineEmits(['update:title'])

    console.log(props.titleModifiers) // { capitalize: true }
    ```


## References
* [组件 v-model](https://cn.vuejs.org/guide/components/v-model.html)