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
