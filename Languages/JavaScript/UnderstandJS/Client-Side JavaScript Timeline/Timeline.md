
## First step
The web browser creates a Document object and begins parsing the web page, adding Element objects and Text nodes to the document as it parses HTML elements and their textual content. The `document.readyState` property has the value “loading” at this stage.


## When the HTML parser encounters <script> elements that have neither the async nor defer attributes
* When the HTML parser encounters <script> elements that have neither the async nor defer attributes, it adds those elements to the document and then executes the inline or external script. These scripts are executed synchronously, and the parser pauses while the script downloads (if necessary) and runs. Scripts like these can use document.write() to insert text into the input stream. That text will become part of the document when the parser resumes. 
* Synchronous scripts often simply define functions and register event handlers for later use, but they can traverse and manipulate the document tree as it exists when they run. That is, synchronous scripts can see their own <script> element and document content that comes before it.


## When the parser encounters a <script> element that has the async attribute set
* When the parser encounters a `<script>` element that has the `async` attribute set, it begins downloading the script text and continues parsing the document. The script will be executed as soon as possible after it has downloaded, but the parser does not stop and wait for it to download. 
* Asynchronous scripts must not use the `document.write()` method. 
* They can see their own <script> element and all document elements that come before it, ==and may or may not have access to additional document content不懂==.


## When the document is completely parsed
When the document is completely parsed, the `document.readyState` property
changes to “interactive”.


## Any scripts that had the defer attribute set are executed
* Any scripts that had the `defer` attribute set are executed, in the order in which they appeared in the document. 
* Async scripts may also be executed at this time. 
* Deferred scripts have access to the complete document tree and must not use the `document.write()` method.


## The browser fires a DOMContentLoaded event on the Document object
* The browser fires a DOMContentLoaded event on the Document object. This marks the transition from synchronous script execution phase to the asynchronous event-driven phase of program execution. 
* Note, however, that there may still be async scripts that have not yet executed at this point.


## The document is completely parsed at this point
The document is completely parsed at this point, but the browser may still be waiting for additional content, such as images, to load. When all such content finishes loading, and when all async scripts have loaded and executed, the document.readyState property changes to “complete” and the web browser fires a load event on the Window object.


## event-handling phase
From this point on, event handlers are invoked asynchronously in response to user input events, network events, timer expirations, and so on.