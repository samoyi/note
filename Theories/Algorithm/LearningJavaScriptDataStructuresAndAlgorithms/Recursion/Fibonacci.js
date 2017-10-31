function fibonacci(n){
    if(n<3){
        return 1;
    }
    return fibonacci(n-1) + fibonacci(n-2);
}

module.exports = fibonacci;
