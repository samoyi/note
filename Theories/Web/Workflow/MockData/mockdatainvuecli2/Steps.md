# Steps

## 解决的问题
根据开发环境和生产环境，自动切换使用 mock 数据或真实数据


## 一个接口统一获取 mock 数据或真实数据
1. 假设要获取`posts`数据并显示到 vue-cli2 默认的`HelloWorld`组件里
    ```html
    <template>
        <span v-if="loading">Loading……</span>
        <ul v-else>
            <li
                v-for="post of posts"
                :key="post.title"
            >
                {{ post.title }}
            </li>
        </ul>
    </template>

    <script>
    export default {
        data(){
            return {
                loading: false,
            };
        },
        computed: {
            posts(){
                return this.$store.state.posts;
            },
        },
        methods: {
            async fetchPosts(){
                await this.$store.dispatch('fetchPosts');
                this.loading = false;
            },
        },
        created(){
            this.fetchPosts();
        },
    }
    </script>
    ```
2. 这个模块里，`fetchPosts`方法就是这个统一的接口。这个方法会请求到 mock 或真是的
posts 数据，之后计算属性`posts`就不再是空数组。
3. 不管是使用 mock 数据还是真实数据，`HelloWorld`组件组件之后都不需要改动了。


## `fetchPosts`方法
1. 先看一下`store/index.js`的写法
    ```js
    import Vue from 'vue'
    import Vuex from 'vuex'
    import client from 'api-client'

    Vue.use(Vuex)

    export default new Vuex.Store({
        state: {
            posts: [],
        },

        mutations: {
            setPosts(state, payload){
                state.posts = payload.posts;
            },
        },

        actions: {
            fetchPosts({commit}){
                let posts = await client.fetchPosts();
                commit('setPosts', {posts,});
            },
        },
    });
    ```
2. 注意这里有一个新的模块`api-client`，这个模块会实际的根据开发环境或生产环境来请求
mock 数据或实际数据。
3. 该模块也有一个`fetchPosts`方法，用来请求`posts`。`fetchPosts`的 action 中就调用这个方法来请求数据，请求到之后改写 state 中的`posts`。


## `api-client`
1. 建立新目录`/src/api`。这个目录就是`api-client`用来实现功能的目录。
2. 在该目录之下新建两个子目录`/src/api/mock`和`/src/api/server`，分别用来处理请求
mock 数据和真实数据。
3. 在每个子目录之下分别建立一个`index.js`文件，用来实现实际的请求逻辑。
4. 在`/src/api/mock`之下建立子目录`/src/api/mock/data`，该目录下面通过若干个`json`
文件来保存 mock 数据。本例只有一个`posts.json`文件，内容如下
    ```json
        [
            { "title": "Post Title 1" },
            { "title": "Post Title 2" },
            { "title": "Post Title 3" },
            { "title": "Post Title 4" },
            { "title": "Post Title 5" }
        ]
    ```

### `/src/api/mock/index.js`
```js
import posts from './data/posts'

function fetch(mockData, time=0){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(mockData);
        }, time);
    });
}

export default {
    fetchPosts(){
        return fetch(posts, 1000);
    }
}
```
1. 该模块的实际上立刻就会读取 mock 数据，但仍通过`fetch`方法来模拟具有延迟的数据加载。
2. 输出的是若干种加载具体数据的方法，在本例中只有一个方法，就是之前用到的`fetchPosts`。
该方法返回一个 promise ，在`fetch`模拟加载完成后会解析该 promise。


### `/src/api/server/index.js`
```js
import axios from 'axios'

export default {
    fetchPosts(){
        return axios
            .get('http://localhost/api/posts.php')
            .then(res=>res.data);
    }
}
```
1. 该模块会实际发送请求加载数据。
2. 输出若干个加载数据的方法，本例中只有一个用来加载 posts 的方法


## 根据不同的环境
1. 现在，开发环境和生产环境下的请求数据功能已经完成了。下来需要的就是根据不同的环境应用
不同的方法。
2. 具体来说，就是如果在开发环境下 import `api-client`则加载`/src/api/mock/index.js`；
如果在生产环境下 import `api-client`则加载`/src/api/server/index.js`。
3. 更具体的说，就是要设置 alias `api-client`，并根据环境不同将其设置为上述两种不同的值
。
4. 在开发环境的配置中`/build/webpack.dev.conf.js`
    ```js
    const devWebpackConfig = merge(baseWebpackConfig, {
        resolve: {
            alias: {
                'api-client': path.join(__dirname, '..', 'src/api/mock/index.js')
            },
        },
        // ...
    });
    ```
    在生产环境的配置中`/build/webpack.dev.prod.js`
    ```js
    const devWebpackConfig = merge(baseWebpackConfig, {
        resolve: {
            alias: {
                'api-client': path.join(__dirname, '..', 'src/api/server/index.js')
            },
        },
        // ...
    });
    ```    
5. 这样其实就已经实现了不同的环境自动加载不同的数据。不过，比如现在的问题是开发环境只能
加载 mock 数据，这显然是不合适的。因此还需要加一个设置，可以选择在开发环境下加载 mock
数据或真实数据。因为也有可能在生产构建中测试加载 mock 数据，所以生产环境中也有可选择加
载哪种数据。
6. `/config/index.js`中可以在不同的环境中设置变量，因此在这里可以实际设置某个环境要加
载哪种数据
    ```js
    module.exports = {
        dev: {
            apiClient: 'mock', // 开发环境下，加载 mock 数据。
            // apiClient: 'server', // 开发环境下，加载真实数据。
            // ...
        },

        build: {
            apiClient: 'server', // 生产环境下，加载真实数据
            // apiClient: 'mock', // 生产环境下，加载 mock 数据。
            // ...
        }
    }
    ```
7. 因为现在在一个环境下可以加载任一种数据，所以就要给 alias `api-client`加上判断，判断
当前的环境变量`apiClient`是什么，以此来决定到底加载什么数据
在开发环境的配置中`/build/webpack.dev.conf.js`
    ```js
    const devWebpackConfig = merge(baseWebpackConfig, {
        resolve: {
            alias: {
                'api-client': config.dev.apiClient === 'mock'
                            ? path.join(__dirname, '..', 'src/api/mock/index.js')
                            : path.join(__dirname, '..', 'src/api/server/index.js'),
            },
        },
        // ...
    });
    ```
    在生产环境的配置中`/build/webpack.dev.prod.js`
    ```js
    const devWebpackConfig = merge(baseWebpackConfig, {
        resolve: {
            alias: {
                'api-client': config.build.apiClient === 'mock'
                            ? path.join(__dirname, '..', 'src/api/mock/index.js')
                            : path.join(__dirname, '..', 'src/api/server/index.js'),
            },
        },
        // ...
    });
    ```


## 其他
下面是测试用的`posts.php`
```php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $posts = array(
        array("title"=> "Post Title 1   server"),
        array("title"=> "Post Title 2   server"),
        array("title"=> "Post Title 3   server"),
        array("title"=> "Post Title 4   server"),
        array("title"=> "Post Title 5   server")
    );
    echo json_encode($posts);
}
```


## References
* [How to Use Mock Data in Vue Apps
](https://tahazsh.com/use-mock-data-in-vue)
