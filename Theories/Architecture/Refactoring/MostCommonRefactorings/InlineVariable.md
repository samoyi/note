# Inline Variable


## Motivation
1. Variables provide names for expressions within a function, and as such they are usually a Good Thing. 
2. But sometimes, the name doesn’t really communicate more than the expression itself. 
3. At other times, you may find that a variable gets in the way of refactoring the neighboring code. 
4. In these cases, it can be useful to inline the variable.


## Mechanics
1. Check that the right­hand side of the assignment is free of side effects.
2. If the variable isn’t already declared immutable, do so and test. This checks that it’s only assigned to once.
3. Find the first reference to the variable and replace it with the right­hand side of the assignment.
4. Test.
5. Repeat replacing references to the variable until you’ve replaced all of them.
6. Remove the declaration and assignment of the variable.
7. Test.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)