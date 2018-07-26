# Single Thread


## JavaScript is single-thread
1. The core JavaScript language does not contain any threading mechanism, and
clientside JavaScript has traditionally not defined any either.
2. HTML5 defines “Web Workers” which serve as a kind of a background thread, but
 clientside JavaScript still behaves as if it is strictly single-threaded.
3. Even when concurrent execution is possible, client-side JavaScript cannot
ever detect the fact that it is occurring.


## advantage
1. Single-threaded execution makes for much simpler scripting: you can write
code with the assurance that two event handlers will never run at the same time.
2. You can manipulate document content knowing that no other thread is
attempting to modify it at the same time, and you never need to worry about
locks, deadlock, or race conditions when writing JavaScript code.


## disadvantage
1. Single-threaded execution means that web browsers must stop responding to
user input while scripts and event handlers are executing.
2. This places a burden on JavaScript programmers: it means that JavaScript
scripts and event handlers must not run for too long.
3. If a script performs a computationally intensive task, it will introduce a
delay into document loading, and the user will not see the document content
until the script completes.
4. If an event handler performs a computationally intensive task, the browser
may become nonresponsive, possibly causing the user to think that it has crashed.


## Performs computationally intensive task
* Use `Web worker`
* If your application must perform enough computation to cause a noticeable
delay, you should allow the document to load fully before performing that
computation
* You should be sure to notify the user that computation is underway and that
the browser is not hung.
* If it is possible to break your computation down into discrete subtasks, you
can use methods such as `setTimeout()` and `setInterval()` to run the subtasks
in the background while updating a progress indicator that displays feedback to
the user.
