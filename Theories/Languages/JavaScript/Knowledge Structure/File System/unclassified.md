
## `__dirname` vs `./`
* `__dirname` is always the directory in which the currently executing script
resides.
* `.` gives you the directory from which you ran the node command in your
terminal window (i.e. your working directory).
* The exception is when you use `.` with `require()`. The path inside require is
always relative to the file containing the call to require
* [reference](https://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js)
