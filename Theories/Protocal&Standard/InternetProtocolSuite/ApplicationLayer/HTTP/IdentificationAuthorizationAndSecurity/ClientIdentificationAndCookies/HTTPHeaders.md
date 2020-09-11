# HTTP Headers


<!-- TOC -->

- [HTTP Headers](#http-headers)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [From](#from)
    - [User-Agent](#user-agent)
    - [Referer](#referer)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. Table below shows the seven HTTP request headers that most commonly carry information about the user
    <table>
        <thead>
            <tr>
                <th>Header name</th>
                <th>Header type</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>From</td>
                <td>Request</td>
                <td>User’s email address</td>
            </tr>
            <tr>
                <td>User-Agent</td>
                <td>Request</td>
                <td>User’s browser software</td>
            </tr>
            <tr>
                <td>Referer</td>
                <td>Request</td>
                <td>Page user came from by following link</td>
            </tr>
            <tr>
                <td>Authorization</td>
                <td>Request</td>
                <td>Username and password</td>
            </tr>
            <tr>
                <td>Client-ip</td>
                <td>Extension (Request)</td>
                <td>Client’s IP address</td>
            </tr>
            <tr>
                <td>X-Forwarded-For</td>
                <td>Extension (Request)</td>
                <td>Client’s IP address</td>
            </tr>
            <tr>
                <td>Cookie</td>
                <td>Extension (Request)</td>
                <td>Server-generated ID label</td>
            </tr>
        </tbody>
    </table>
2.  We’ll discuss the first three now; the last four headers are used for more advanced identification techniques that we’ll discuss later.


## From
1. The `From` header contains the user’s email address. Ideally, this would be a viable source of user identification, because each user would have a different email address.
2. However, few browsers send `From` headers, due to worries of unscrupulous servers collecting email addresses and using them for junk mail distribution. 
3. In practice, `From` headers are sent by automated robots or spiders so that if something goes astray, a webmaster has someplace to send angry email complaints.


## User-Agent
1. The `User-Agent` header tells the server information about the browser the user is using, including the name and version of the program, and often information about the operating system. 
2. This sometimes is useful for customizing content to interoperate well with particular browsers and their attributes, but that doesn’t do much to help identify the particular user in any meaningful way. 


## Referer
1. The `Referer` header provides the URL of the page the user is coming from. 
2. The Referer header alone does not directly identify the user, but it does tell what page the user previously visited. You can use this to better understand user browsing behavior and user interests. For example, if you arrive at a web server coming from a baseball site, the server may infer you are a baseball fan.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)