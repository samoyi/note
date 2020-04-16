# Change Function Declaration

## Motivation
1. Functions represent the primary way we break a program down into parts. Function declarations represent how these parts fit together—effectively, they represent the joints in our software systems. And, as with any construction, much depends on those joints. 
2. Good joints allow me to add new parts to the system easily, but bad ones are a constant source of difficulty, making it harder to figure out what the software does and how to modify it as my needs change. 
3. Fortunately, software, being soft, allows me to change these joints, providing I do it carefully.
4. The most important element of such a joint is the name of the function. A good name
allows me to understand what the function does when I see it called, without seeing the
code that defines its implementation. However, coming up with good names is hard,
and I rarely get my names right the first time. When I find a name that’s confused me,
I’m tempted to leave it—after all, it’s only a name. This is the work of the evil demon
Obfuscatis; for the sake of my program’s soul I must never listen to him. If I see a
function with the wrong name, it is imperative that I change it as soon as I understand
what a better name could be. That way, the next time I’m looking at this code, I don’t
have to figure out again what’s going on. (Often, a good way to improve a name is to
write a comment to describe the function’s purpose, then turn that comment into a
name.)
Similar logic applies to a function’s parameters. The parameters of a function dictate
how a function fits in with the rest of its world. Parameters set the context in which I
can use a function. If I have a function to format a person’s telephone number, and that
function takes a person as its argument, then I can’t use it to format a company’s
telephone number. If I replace the person parameter with the telephone number itself,
then the formatting code is more widely useful.
Apart from increasing a function’s range of applicability, I can also remove some
coupling, changing what modules need to connect to others. Telephone formatting logic
may sit in a module that has no knowledge about people. Reducing how much modules
need to know about each other helps reduce how much I need to put into my brain
when I change something—and my brain isn’t as big as it used to be (that doesn’t say
anything about the size of its container, though).
Choosing the right parameters isn’t something that adheres to simple rules. I may have
a simple function for determining if a payment is overdue, by looking at if it’s older
than 30 days. Should the parameter to this function be the payment object, or the due
date of the payment? Using the payment couples the function to the interface of the
payment object. But if I use the payment, I can easily access other properties of the
payment, should the logic evolve, without having to change every bit of code that calls
this function—essentially, increasing the encapsulation of the function.The only right answer to this puzzle is that there is no right answer, especially over
time. So I find it’s essential to be familiar with Change Function Declaration so the code
can evolve with my understanding of what the best joints in the code need to be.
Usually, I only use the main name of a refactoring when I refer to it from elsewhere in
this book. However, since renaming is such a significant use case for Change Function
Declaration, if I’m just renaming something, I’ll refer to this refactoring as Rename
Function to make it clearer what I’m doing. Whether I’m merely renaming or
manipulating the parameters, I use the same mechanics


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
