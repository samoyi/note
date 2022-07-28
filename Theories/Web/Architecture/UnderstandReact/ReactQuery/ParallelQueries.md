
# Parallel Queries


<!-- TOC -->

- [Parallel Queries](#parallel-queries)
    - [Manual Parallel Queries](#manual-parallel-queries)
    - [Dynamic Parallel Queries with `useQueries`](#dynamic-parallel-queries-with-usequeries)
    - [References](#references)

<!-- /TOC -->


## Manual Parallel Queries
1. When the number of parallel queries does not change, there is **no extra effort** to use parallel queries. Just use any number of React Query's useQuery and useInfiniteQuery hooks side-by-side
    ```ts
    function App() {
        // The following queries will execute in parallel
        const usersQuery = useQuery(['users'], fetchUsers)
        const teamsQuery = useQuery(['teams'], fetchTeams)
        const projectsQuery = useQuery(['projects'], fetchProjects)
    }
    ```
2. When using React Query in suspense mode, this pattern of parallelism does not work, since the first query would throw a promise internally and would suspend the component before the other queries run. 
3. To get around this, you'll either need to use the `useQueries` hook (which is suggested) or orchestrate your own parallelism with separate components for each `useQuery` instance (which is lame).


## Dynamic Parallel Queries with `useQueries`
1. If the number of queries you need to execute is changing from render to render, you cannot use manual querying since that would violate the rules of hooks. 
2. Instead, React Query provides a `useQueries` hook, which you can use to dynamically execute as many queries in parallel as you'd like.
3. `useQueries` accepts an options object with a queries key whose value is an array of query objects. It returns an array of query results
    ```ts
    function App({ users }) {
        const userQueries = useQueries({
            queries: users.map(user => {
                return {
                    queryKey: ['user', user.id],
                    queryFn: () => fetchUserById(user.id),
                }
            })
        })
    }
    ```


## References
* [React Query](https://tanstack.com/query/v4/docs/guides/parallel-queries)