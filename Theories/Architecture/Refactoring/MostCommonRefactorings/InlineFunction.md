# Inline Function

inverse of: *Extract Function*


## Motivation
### 函数体和函数名一样容易阅读，就可以不封装为函数
1. One of the themes of this book is using short functions named to show their intent, because these functions lead to clearer and easier to read code. 
2. But sometimes, I do come across a function in which the body is as clear as the name. Or, I refactor the body of the code into something that is just as clear as the name. When this happens, I get rid of the function. 
3. Indirection can be helpful, but needless indirection is irritating.
4. I also use Inline Function is when I have a group of functions that seem badly factored. I can inline them all into one big function and then reextract the functions the way I prefer.

### 如果跳来跳去感觉费劲儿，那可以考虑 inline
1. I commonly use Inline Function when I see code that’s using too much indirection — when it seems that every function does simple delegation to another function, and I get lost in all the delegation. 
2. Some of this indirection may be worthwhile, but not all of it. By inlining, I can flush out the useful ones and eliminate the rest.


## Mechanics
1. Check that this isn’t a polymorphic method.
    * If this is a method in a class, and has subclasses that override it, then I can’t inline it.
2. Find all the callers of the function.
3. Replace each call with the function’s body.
4. Test after each replacement.
    * The entire inlining doesn’t have to be done all at once. If some parts of the inline are tricky, they can be done gradually as opportunity permits.
5. Remove the function definition.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
