# Dependent Queries


<!-- TOC -->

- [Dependent Queries](#dependent-queries)
    - [Usage](#usage)
    - [References](#references)

<!-- /TOC -->


## Usage
1. Dependent (or serial) queries depend on previous ones to finish before they can execute. To achieve this, it's as easy as using the `enabled` option to tell a query when it is ready to run
    ```ts
    // Get the user
    const { data: user } = useQuery(['user', email], getUserByEmail)

    const userId = user?.id

    // Then get the user's projects
    const { status, fetchStatus, data: projects } = useQuery(
        ['projects', userId],
        getProjectsByUser,
        {
            // The query will not execute until the userId exists
            enabled: !!userId,
        }
    )
    ```
2. The projects query will start in
    ```ts
    status: 'loading'
    fetchStatus: 'idle'
    ```
3. As soon as the `user` is available, the projects query will be enabled and will then transition to
    ```ts
    status: 'loading'
    fetchStatus: 'fetching'
    ```
4. Once we have the projects, it will go to
    ```ts
    status: 'success'
    fetchStatus: 'idle'
    ```



## References
* [React Query](https://tanstack.com/query/v4/docs/guides/dependent-queries)