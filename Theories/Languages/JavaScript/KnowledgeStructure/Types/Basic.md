
## Basic
* In JavaScript, variables don't have types, values have types
* Seven built-in types: string, numbers, vooleans, null, undefined, symbol, object


## `typeof`
* Technically, functions are considered objects in ECMAScript and don’t represent another data type. Specifically, a function is referred to as a "callable object" -- an object that has an internal `[[Call]]` property that allows it to be invoked. However, they do have some special properties, which necessitates differentiating between functions and other objects via the
    `typeof` operator.
    ```js
    console.log(typeof function(){}); // 'function'
    ```
* Why using `typeof` on undeclared variable will not throw an error. Imagine that you wrote a plugin which will be included by anyone, and your plugin can be used in context containing jQuery or not, so you need to check if the user has used jQuery in their scripts or not
    ```js
    let btn = null;
    // if( $ ) // may cause error
    if(typeof $ !== 'undefined'){
        btn = $('.btn');
    }
    else{
        btn = document.querySeletor('.btn');
    }
    ```
    You should not use `if($)` here, because if there's not jQuery, this will cause a `ReferenceError`
* `let` and `const` make typeof not safe
    ```js
    console.log(typeof value); // 'undefined'   
    // As this result, be careful if typeof returns undefined
    ```
    ```js
    console.log(typeof value); // 'undefined'    
    var value;
    ```
    Variables declared by `let` or `const` will not be hoisted
    ```js
    typeof value; // ReferenceError
    let value;
    ```
    ```js
    typeof value; // ReferenceError
    const value = 2;
    ```
* Bug of `null`
    ```js
    console.log( typeof null ); // 'object'
    ```
