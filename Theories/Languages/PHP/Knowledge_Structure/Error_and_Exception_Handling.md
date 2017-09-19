# Error and Exception Handling

## Exception Handling
```
function throwErrorTest(){
    try{
        throw new Exception ('previous error', 40403);
    }
    catch(Exception $prev_err){
        throw new Exception("error message", 40404, $prev_err);
    }

}

try {
     throwErrorTest();
}
catch (Exception $err) {
    echo '<h2>error code</h2>'. $err->getCode();
    echo '<br /><br />';
    echo '<h2>error message</h2>' . $err->getMessage();
    echo  '<br /><br />';
    echo '<h2>error file</h2>' . $err->getFile();
    echo  '<br /><br />';
    echo '<h2>error line</h2>' . $err->getLine();
    echo  '<br /><br />';
    echo '<h2>previous error</h2>';
    print_r( $err->getPrevious() );
    echo  '<br /><br />';
    echo '<h2>error Trace</h2>';
    print_r( $err->getTrace() );
    echo  '<br /><br />';
    echo '<h2>error Trace String</h2>' . $err->getTraceAsString();
    echo  '<br /><br />';
    echo '<h2>error toString</h2>' . $err->__toString();
    echo  '<br /><br />';
}
```


***
## User-Defined Exceptions
<mark>不懂 没看</mark>
