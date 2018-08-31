# Garbage Collected


## Summary
1. JavaScript is a garbage-collected language, meaning that the execution
environment is responsible for managing the memory required during code
execution.
2. In languages like C and C++, keeping track of memory usage is a principle
concern and the source of many issues for developers. JavaScript frees
developers from worrying about memory management by automatically allocating
what is needed and reclaiming memory that is no longer being used.
3. The basic idea is simple: figure out which variables aren’t going to be used
and free the memory associated with them.
4. This process is periodic, with the garbage collector running at specified
intervals (or at predefined collection moments in code execution).


## 局部变量生命周期
1. Consider the normal life cycle of a local variable in a function. The
variable comes into existence during the execution of the function.
2. At that time, memory is allocated on the stack (and possibly on the heap) to
provide storage space for the value.
3. The variable is used inside the function and then the function ends. At that
point this variable is no longer needed, so its memory can be reclaimed for
later use.
4. In this situation, it’s obvious that the variable isn’t needed, but not all
situations are as obvious. The garbage collector must keep track of which
variables can and can’t be used so it can identify likely candidates for memory
reclamation.
5. The strategy for identifying the unused variables may differ on an
implementation basis, though two strategies have traditionally been used in
browsers: Mark-and-Sweep and Reference Counting


## Mark-and-Sweep
1. When a variable comes into context, such as when a variable is declared
inside a function, it is flagged as being in context.
2. Variables that are in context, logically, should never have their memory
freed, because they may be used as long as execution continues in that context.
3. When a variable goes out of context, it is also flagged as being out of
context.
4. Variables can be flagged in any number of ways. There may be a specific bit
that is flipped when a variable is in context, or there may be an “in-context”
variable list and an “out-of-context” variable list between which variables are
moved. The implementation of the flagging is unimportant; it’s really the theory
that is key.
5. When the garbage collector runs, it marks all variables stored in memory
(once again, in any number of ways). It then clears its mark off of variables
that are in context and variables that are referenced by in-context variables.
6. The variables that are marked after that are considered ready for deletion,
because they can’t be reached by any in-context variables.
7. The garbage collector then does a memory sweep, destroying each of the marked
values and reclaiming the memory associated with them.
8. As of 2008, Internet Explorer, Firefox, Opera, Chrome, and Safari all use
mark-and-sweep garbage collection (or variations thereof) in their JavaScript
implementations, though the timing of garbage collection differs.



## Managing Memory
1. In a garbage-collected programming environment, developers typically don’t
have to worry about memory management. However, JavaScript runs in an
environment where memory management and garbage collection operate uniquely.
2. The amount of memory available for use in web browsers is typically much less
than is available for desktop applications. This is more of a security feature
than anything else, ensuring that a web page running JavaScript can’t crash the
operating system by using up all the system memory.
3. The memory limits affect not only variable allocation but also the call stack
and the number of statements that can be executed in a single thread.
4. Keeping the amount of used memory to a minimum leads to better page
performance.
5. The best way to optimize memory usage is to ensure that you’re keeping around
only data that is necessary for the execution of your code. When data is no
longer necessary, it’s best to set the value to `null`, freeing up the reference
— this is called *dereferencing* the value.
6. This advice applies mostly to global values and properties of global objects.
Local variables are dereferenced automatically when they go out of context, as
in this example:
    ```js
    function createPerson(name){
        var localPerson = new Object();
        localPerson.name = name;
        return localPerson;
    }
    var globalPerson = createPerson(“Nicholas”);
    //do something with globalPerson
    globalPerson = null;
    ```
7. Keep in mind that dereferencing a value doesn’t automatically reclaim the
memory associated withm it. The point of dereferencing is to make sure the value
is out of context and will be reclaimed the next time garbage collection occurs.
