
## JavaScript is single-thread
The core JavaScript language does not contain any threading mechanism, and clientside JavaScript has traditionally not defined any either. HTML5 defines “WebWorkers” which serve as a kind of a background thread (more on web workers follows), but clientside JavaScript still behaves as if it is strictly single-threaded. Even when concurrent execution is possible, client-side JavaScript cannot ever detect the fact that it is occurring.


## advantage
Single-threaded execution makes for much simpler scripting: you can write code with the assurance that two event handlers will never run at the same time. You can manipulate document content knowing that no other thread is attempting to modify it at the same time, and you never need to worry about locks, deadlock, or race conditions when writing JavaScript code.


## disadvantage
Single-threaded execution means that web browsers must stop responding to user input while scripts and event handlers are executing. This places a burden on JavaScript programmers: it means that JavaScript scripts and event handlers must not run for too long. If a script performs a computationally intensive task, it will introduce a delay into document loading, and the user will not see the document content until the script completes. If an event handler performs a computationally intensive task, the browser may become nonresponsive, possibly causing the user to think that it has crashed.


## performs computationally intensive task
* Use `Web worker`
* If your application must perform enough computation to cause a noticeable delay, you should allow the document to load fully before performing that computation
* You should be sure to notify the user that computation is underway and that the browser is not hung.
* If it is possible to break your computation down into discrete subtasks, you can use methods such as `setTimeout()` and `setInterval()` to run the subtasks in the background while updating a progress indicator that displays feedback to the user.
