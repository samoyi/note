# Fat URLs


<!-- TOC -->

- [Fat URLs](#fat-urls)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [Weaknesses](#weaknesses)
        - [Ugly URLs](#ugly-urls)
        - [Can’t share URLs](#cant-share-urls)
        - [Breaks caching](#breaks-caching)
        - [Extra server load](#extra-server-load)
        - [Escape hatches](#escape-hatches)
        - [Not persistent across sessions](#not-persistent-across-sessions)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. Some web sites keep track of user identity by generating special versions of each URL for each user. Typically, a real URL is extended by adding some state information to the start or end of the URL path. 
2. As the user browses the site, the web server dynamically generates hyperlinks that continue to maintain the state information in the URLs.
3. URLs modified to include user state information are called fat URLs. The following are some example fat URLs used in the `Amazon.com` e-commerce web site. Each URL is suffixed by a user-unique identification number (`002-1145265-8016838`, in this case) that helps track a user as she browses the store
    ```html
    ...
    <a href="/exec/obidos/tg/browse/-/229220/ref=gr_gifts/002-1145265-8016838">All Gifts</a><br>
    <a href="/exec/obidos/wishlist/ref=gr_pl1_/002-1145265-8016838">Wish List</a><br>
    ...
    <a href="http://s1.amazon.com/exec/varzea/tg/armed-forces/-//ref=gr_af_/002-1145265-8016838">Salute Our Troops</a><br>
    <a href="/exec/obidos/tg/browse/-/749188/ref=gr_p4_/002-1145265-8016838">Free Shipping</a><br>
    <a href="/exec/obidos/tg/browse/-/468532/ref=gr_returns/002-1145265-8016838">Easy Returns</a>
    ...
    ```
4. You can use fat URLs to tie the independent HTTP transactions with a web server into a single “session” or “visit”.
5. The first time a user visits the web site, a unique ID is generated, it is added to the URL in a server-recognizable way, and the server redirects the client to this fat URL. 
6. Whenever the server gets a request for a fat URL, it can look up any incremental state associated with that user ID (shopping carts, profiles, etc.), and it rewrites all outgoing hyperlinks to make them fat, to maintain the user ID.


## Weaknesses
1. Fat URLs can be used to identify users as they browse a site. But this technology does have several serious problems. 
2. Some of these problems include:

### Ugly URLs
The fat URLs displayed in the browser are confusing for new users.

### Can’t share URLs
The fat URLs contain state information about a particular user and session. If you mail that URL to someone else, you may inadvertently be sharing your accumulated personal information.

### Breaks caching
Generating user-specific versions of each URL means that there are no longer commonly accessed URLs to cache.

### Extra server load
The server needs to rewrite HTML pages to fatten the URLs.

### Escape hatches
1. It is too easy for a user to accidentally “escape” from the fat URL session by jumping to another site or by requesting a particular URL. 
2. Fat URLs work only if the user strictly follows the premodified links. If the user escapes, he may lose his progress (perhaps a filled shopping cart) and will have to start again. 

### Not persistent across sessions
All information is lost when the user logs out, unless he bookmarks the particular fat URL.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)