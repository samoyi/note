# Computed Properties


## Misc
* 计算属性是通过 ref 实现的
    ```js
    const author = reactive({
        name: 'John Doe',
        books: [
            'Vue 2 - Advanced Guide',
            'Vue 3 - Basic Guide',
            'Vue 4 - The Mystery'
        ]
    })

    // 一个计算属性 ref
    const publishedBooksMessage = computed(() => {
        return author.books.length > 0 ? 'Yes' : 'No'
    })


    onMounted (() => {
        console.log(publishedBooksMessage.value) // "yes"
    })
    ```


## References
* [计算属性](https://cn.vuejs.org/guide/essentials/computed.html)