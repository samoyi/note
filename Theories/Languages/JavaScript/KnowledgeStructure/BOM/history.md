# history

**HTML5 History API** 在 `Theories\Languages\JavaScript\KnowledgeStructure\Web APP API\HistoryManagement.md`

* Because `history` is a property of `window`, each browser window, tab, and
frame has its own `history` object relating specifically to that `window` object.
* For security reasons, it’s not possible to determine the URLs that the user
has visited. It is possible, however, to navigate backwards and forwards through
the list of places the user has been without knowing the exact URL.
* Entries are made in the history stack whenever the page’s URL changes, this
includes changes to the URL hash.
* Though not used very often, the history object typically is used to create
custom Back and Forward buttons and to determine if the page is the first in the
user’s history.


## Methods
### `history.go`
1. Loads a page from the session history, identified by its relative location to
the current page, for example `-1` for the previous page or `1` for the next
page.
2. If you specify an out-of-bounds value, this method silently has no effect.
3. Calling `go()` without parameters or a value of `0` reloads the current page.

### `history.back()` and `history.forward()`
mimic the browser Back and Forward buttons


## Properties
### `history.length`
