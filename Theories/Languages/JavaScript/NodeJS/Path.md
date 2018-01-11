# Path



### `basename()` and `extname()`
* `path.basename`: trailing directory separators are ignored
    ```js
    const path = require('path');
    console.log( path.basename('/foo/bar/baz///') );       // 'baz'
    console.log( path.basename('/foo/bar/baz.html///') );  // 'baz.html'
    ```
* `path.extname`If there is no `.` in the last portion of the path, or if the first character of
 the basename of path is `.`, then an empty string is returned.
    ```js
    const path = require('path');

    console.log( path.basename('.htaccess') );   // '.htaccess'
    console.log( path.extname('.htaccess') );    // ''
    console.log( path.basename('htaccess.') );   // 'htaccess.'
    console.log( path.extname('htaccess.') );    // '.'
    console.log( path.basename('htaccess') );    // 'htaccess'
    console.log( path.extname('htaccess') );     // ''
    ```
