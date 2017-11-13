# Require


***
## About `require` and Sync-I/O
1. `require` is one of the few synchronous I/O operations in Node. Because
modules are often used and are general required at the top of the file, making
`require` sync helps to keep the code clean, orderly, and more readable.
2. But in the process of I/O-intensive place try not to use `require`. All
synchronous calls will block the Node until the call is completed. For example,
if you are running an HTTP server, you may encouter performance problems if
`require` is used on every incoming request.
3. So usually `require` and other synchronous operations are only used when the
program is initially loaded.
