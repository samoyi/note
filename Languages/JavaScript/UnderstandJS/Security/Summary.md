# JavaScript security restrictions and security issues

## What JavaScript Can’t Do

### Web browsers’ first line of defense against malicious code is that they simply do not support certain capabilities. Such as
* Client-side JavaScript does not provide any
way to write or delete arbitrary files or list arbitrary directories on the client computer.
* Client-side JavaScript does not have any general-purpose networking capabilities.

### Browsers’ second line of defense against malicious code is that they impose restrictions on the use of certain features that they do support. Such as
* A JavaScript program can open new browser windows, but, to prevent pop-up abuse by advertisers, most browsers restrict this feature so that it can happen only in response to a user-initiated event, such as a mouse click.
* A JavaScript program can close browser windows that it opened itself, but it is not allowed to close other windows without user confirmation.
* The `value` property of HTML FileUpload elements cannot be set. If this property could be set, a script could set it to any desired filename and cause the form to upload the contents of any specified file to the server.
* A script cannot read the content of documents loaded from different servers than the document that contains the script. Similarly, a script cannot register event listeners on documents from different servers. This prevents scripts from snooping on the user’s input (such as the keystrokes that constitute a password entry) to other pages.
