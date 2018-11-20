import posts from './data/posts'

function fetch(mockData, time=0){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(mockData);
        }, time);
    });
}

export default {
    fetchPosts(){
        return fetch(posts, 500);
    }
}
