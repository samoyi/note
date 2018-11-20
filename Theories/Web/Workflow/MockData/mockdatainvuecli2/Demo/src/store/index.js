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
        async fetchPosts({commit}){
            let posts = await client.fetchPosts();
            commit('setPosts', {posts,});
        },
    },
});
