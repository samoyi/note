# Mutations


<!-- TOC -->

- [Mutations](#mutations)
    - [Basics](#basics)
    - [Mutation states](#mutation-states)
    - [Resetting Mutation State](#resetting-mutation-state)
    - [Mutation Side Effects](#mutation-side-effects)
        - [Consecutive mutations](#consecutive-mutations)
    - [Promises](#promises)
    - [Retry](#retry)
    - [Persist mutations](#persist-mutations)
    - [References](#references)

<!-- /TOC -->


## Basics
1. Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, React Query exports a `useMutation` hook. 
2. Here's an example of a mutation that adds a new todo to the server:
    ```js
    function App() {
        const mutation = useMutation(newTodo => {
            return axios.post('/todos', newTodo)
        })

        return (
            <div>
                {mutation.isLoading ? (
                    'Adding todo...'
                ) : (
                    <>
                        {mutation.isError ? (
                            <div>An error occurred: {mutation.error.message}</div>
                        ) : null}

                        {mutation.isSuccess ? <div>Todo added!</div> : null}

                        <button
                            onClick={() => {
                                mutation.mutate({ id: new Date(), title: 'Do Laundry' })
                            }}
                        >
                            Create Todo
                        </button>
                    </>
                )}
            </div>
        )
    }
    ```
3. 在这个例子中，调用 `useMutation` 并接受一个函数，该函数会在需要提交数据时执行，向服务器发送实际的请求。
4. `useMutation` 返回一个 `mutation` 对象，在需要提交数据时，使用该对象的 `mutate` 方法，传入要提交的数据。
5. 传入的数据会作为调用 `useMutation` 时所传函数的参数，也就是 `newTodo`，发起请求会就会向服务器提交这个传入的数据。
6.  The `mutate` function is an asynchronous function, which means you cannot use it directly in an event callback in React 16 and earlier. If you need to access the event in `onSubmit` you need to wrap mutate in another function. This is due to React event pooling
    ```js
    // 在React16及之前的版本，这将无法正常工作
    const CreateTodo = () => {
        const mutation = useMutation((event) => {
            event.preventDefault();
            return fetch("/api", new FormData(event.target));
        });

        return <form onSubmit={mutation.mutate}>...</form>;
    };

    // 这将正常工作
    const CreateTodo = () => {
        const mutation = useMutation((formData) => {
            return fetch("/api", formData);
        });
        const onSubmit = (event) => {
            event.preventDefault();
            mutation.mutate(new FormData(event.target));
        };

        return <form onSubmit={onSubmit}>...</form>;
    };
    ```


## Mutation states
1. A mutation can only be in one of the following states at any given moment:
    * `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
    * `isLoading` or `status === 'loading'` - The mutation is currently running
    * `isError` or `status === 'error'` - The mutation encountered an error
    * `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available
2. Beyond those primary states, more information is available depending on the state of the mutation:
    * `error` - If the mutation is in an `error` state, the error is available via the `error` property.
    * `data` - If the mutation is in a `success` state, the data is available via the `data` property.


## Resetting Mutation State
It's sometimes the case that you need to clear the `error` or `data` of a mutation request. To do this, you can use the `reset` function to handle this
```js
const CreateTodo = () => {
    const [title, setTitle] = useState('')
    const mutation = useMutation(createTodo)

    const onCreateTodo = e => {
        e.preventDefault()
        mutation.mutate({ title })
    }

    return (
        <form onSubmit={onCreateTodo}>
            {mutation.error && (
                // 请求出错后清楚状态，方便之后的请求提交
                <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
            )}
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <br />
            <button type="submit">Create Todo</button>
        </form>
    )
}
```


## Mutation Side Effects
1. `useMutation` comes with some helper options(通过第二个参数) that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both invalidating and refetching queries after mutations and even optimistic updates
    ```js
    useMutation(addTodo, {
        onMutate: variables => {
            // A mutation is about to happen!

            // Optionally return a context containing data to use when for example rolling back
            return { id: 1 }
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`rolling back optimistic update with id ${context.id}`)
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
        },
    })
    ```
2. When returning a promise in any of the callback functions it will first be awaited before the next callback is called
    ```js
    useMutation(addTodo, {
        onSuccess: async () => {
            console.log("I'm first!")
        },
        onSettled: async () => {
            console.log("I'm second!")
        },
    })
    ```
3. 除了使用 `useMutation` 时可以设置回调，在调用 `mutate` 方法时也可以同样可以使用第二个参数设置回调。这里的回到可以用来设置针对组件自身的副作用。 Supported overrides include: `onSuccess`, `onError` and `onSettled`
    ```js
    useMutation(addTodo, {
        onSuccess: (data, variables, context) => {
            // I will fire first
        },
        onError: (error, variables, context) => {
            // I will fire first
        },
        onSettled: (data, error, variables, context) => {
            // I will fire first
        },
    })

    mutate(todo, {
        onSuccess: (data, variables, context) => {
            // I will fire second!
        },
        onError: (error, variables, context) => {
            // I will fire second!
        },
        onSettled: (data, error, variables, context) => {
            // I will fire second!
        },
    })
    ```
4. 如果你在请求完成前就卸载了组件，则 `mutate` 中设置的回调不会执行。

### Consecutive mutations
TODO


## Promises
1. Use `mutateAsync` instead of `mutate` to get a promise which will resolve on success or throw on an error. 
2. This can for example be used to compose side effects.
    ```js
    const mutation = useMutation(addTodo)
    
    try {
        const todo = await mutation.mutateAsync(todo)
        console.log(todo)
    } 
    catch (error) {
        console.error(error)
    } 
    finally {
        console.log('done')
    }
    ```


## Retry
1.  By default React Query will not retry a mutation on error, but it is possible with the `retry` option
    ```js
    const mutation = useMutation(addTodo, {
        retry: 3,
    })
    ```
2. If mutations fail because the device is offline, they will be retried in the same order when the device reconnects.


## Persist mutations
TODO


## References
* [Mutations](https://react-query.tanstack.com/guides/mutations)
* [Mutations 中文](https://cangsdarm.github.io/react-query-web-i18n/guides&concepts/mutations)