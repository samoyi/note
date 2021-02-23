# RegExp


<!-- TOC -->

- [RegExp](#regexp)
    - [Creating a regular expression](#creating-a-regular-expression)
        - [Literal](#literal)
        - [Constructor](#constructor)
    - [References](#references)

<!-- /TOC -->


## Creating a regular expression
You construct a regular expression in one of two ways: literal and constructor.

### Literal
1. Using a regular expression literal, which consists of a pattern enclosed between slashes, as follows:
    ```js
    let re = /ab+c/;
    ```
2. Regular expression literals provide **compilation of the regular expression when the script is loaded**. 
3. If the regular expression remains constant, using this can improve performance.

### Constructor
1. Or calling the constructor function of the `RegExp` object, as follows:
    ```js
    let re = new RegExp('ab+c');
    ```
2. Using the constructor function provides `runtime compilation` of the regular expression. 
3. Use the constructor function when you know the regular expression pattern will be changing, or you don't know the pattern and are getting it from another source, such as user input.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)