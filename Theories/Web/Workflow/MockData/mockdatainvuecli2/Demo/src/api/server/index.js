import axios from 'axios'

export default {
    fetchPosts(){
        return axios
            .get('http://localhost/api/posts.php')
            .then(res=>res.data);
    }
}
