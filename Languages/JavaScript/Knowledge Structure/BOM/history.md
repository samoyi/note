
* Because `history` is a property of `window`, each browser window, tab, and frame has its own `history` object relating specifically to that `window` object. 
* For security reasons, it’s not possible to determine the URLs that the user has visited. It is possible, however, to navigate backwards and forwards through the list of places the user has been without knowing the exact URL.
* Entries are made in the history stack whenever the page’s URL changes, this includes changes to the URL hash.
* Though not used very often, the history object typically is used to create custom Back and Forward buttons and to determine if the page is the first in the user’s history. 


### `history.go`
This method accepts a single argument   
* an integer: representing the number of pages to go backward or forward. 
* a string: the browser navigates to the first location in history that contains the given string. The closest location may be either backward or forward. If there’s no entry in history matching the string, then the method does nothing.
    
### `history.back()` and `history.forward()`
mimic the browser Back and Forward buttons

### `history.length`