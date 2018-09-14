# Mocha

## Getting Started
1. 在`package.json`中设置 test script
    ```json
    "scripts": {
        "test": "mocha"
    }
    ```
2. Mocha 默认查找的测试脚本路径为`./test/*.js`，这个路径是相对于 current working
directory 的。而运行`package.json`中 script 的 current working directory 总是在项
目根目录。所以需要在根目录创建`test`目录来存放测试脚本。
    ```js
    // test/test.js

    const assert = require('assert'); // 使用 Node 自带的 assert 模块

    describe('Array', function() {
        describe('#indexOf()', function() {
            it('should return -1 when the value is not present', function() {
                assert.equal([1,2,3].indexOf(4), -1);
            });
        });
    });
    ```



## Path
1. Mocha 默认查找的测试脚本路径为`./test/*.js`。
2. 默认情况下你只能把测试脚本放在`test/`目录之下，而不是它的子目录。
3. 如果想让 Mocha 也测试`test/`子目录的脚本，则要使用`--recursive`参数
    ```json
    "scripts": {
        "test": "mocha --recursive"
    }
    ```
