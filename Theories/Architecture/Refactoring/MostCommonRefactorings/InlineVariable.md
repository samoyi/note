# Inline Variable

inverse of: *Extract Variable*


## Motivation
表达式已经足够简明


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