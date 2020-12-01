# Mixed content


<!-- TOC -->

- [Mixed content](#mixed-content)
    - [Summary](#summary)
    - [Types of mixed content](#types-of-mixed-content)
        - [Mixed passive/display content](#mixed-passivedisplay-content)
            - [Passive content list](#passive-content-list)
        - [Mixed active content](#mixed-active-content)
            - [active content 可以修改页面](#active-content-可以修改页面)
            - [危害](#危害)
            - [即使是没有私人信息站点也不安全](#即使是没有私人信息站点也不安全)
            - [Active content examples](#active-content-examples)
    - [浏览器对 mixed content 的警告和拦截](#浏览器对-mixed-content-的警告和拦截)
    - [How to fix your website](#how-to-fix-your-website)
    - [References](#references)

<!-- /TOC -->


## Summary
1. When a user visits a page served over HTTPS, their connection with the web server is encrypted with TLS and is therefore safeguarded from most sniffers and man-in-the-middle attacks. 
2. An HTTPS page that includes content fetched using cleartext HTTP is called a **mixed content** page. 
3. Pages like this are only partially encrypted, leaving the unencrypted content accessible to sniffers and man-in-the-middle attackers. That leaves the pages unsafe.

## Types of mixed content
1. There are two categories for mixed content: **mixed passive/display content** and **mixed active content**. 
1. The difference lies in the threat level of the worst case scenario if content is rewritten as part of a man-in-the-middle attack. 
3. In the case of passive content, the threat is lower (the page may contain misleading content, or the user's cookies may be stolen). 
4. In the case of active content, the threat can lead to phishing, sensitive data disclosure, redirection to malicious sites, etc.

### Mixed passive/display content
1. Mixed passive/display content is content served over HTTP that is included in an HTTPS webpage, but that cannot alter other portions of the webpage. 
2. For example, an attacker could replace an image served over HTTP with an inappropriate image or message to the user. 
3. The attacker could also infer information about the user's activities by watching which images are served to the user; often images are only served on a specific page within a website. If the attacker observes HTTP requests to certain images, they could determine which webpage the user is visiting.

#### Passive content list
This section lists all types of HTTP requests which are considered passive content:
* `<img>` (`src` attribute)
* `<audio>` (`src` attribute)
* `<video>` (`src` attribute)
* `<object>` subresources (when an `<object>` performs HTTP requests)

### Mixed active content
#### active content 可以修改页面
1. Mixed active content is content that has access to all or parts of the Document Object Model of the HTTPS page. 
2. This type of mixed content can alter the behavior of the HTTPS page and potentially steal sensitive data from the user. 
3. Hence, in addition to the risks described for mixed display content above, mixed active content is vulnerable to a few other attack vectors.

#### 危害
1. In the mixed active content case, a man-in-the-middle attacker can intercept the request for the HTTP content. 
2. The attacker can also rewrite the response to include malicious JavaScript code. 
3. Malicious active content can steal the user's credentials, acquire sensitive data about the user, or attempt to install malware on the user's system (by leveraging vulnerabilities in the browser or its plugins, for example).

#### 即使是没有私人信息站点也不安全
1. The risk involved with mixed content does depend on the type of website the user is visiting and how sensitive the data exposed to that site may be. 
2. The webpage may have public data visible to the world or private data visible only when authenticated. If the webpage is public and has no sensitive data about the user, using mixed active content still provides the attacker with the opportunity to redirect the user to other HTTP pages and steal HTTP cookies from those sites.

#### Active content examples
1. This section lists some types of HTTP requests which are considered active content:
    * `<script>` (`src` attribute)
    * `<link>` (`href` attribute) (this includes CSS stylesheets)
    * `<iframe>` (`src` attribute)
    * `XMLHttpRequest` requests
    * `fetch()` requests
    * All cases in CSS where a `<url>` value is used (`@font-face`, `cursor`, `background-image`, and so forth).
    * `<object>` (`data` attribute)
    * `Navigator.sendBeacon` (`url` attribute)
2. Other resource types like web fonts and workers may be considered active mixed content, as they are in Chrome.


## 浏览器对 mixed content 的警告和拦截
1. If your website delivers HTTPS pages, all active mixed content delivered via HTTP on this pages will be blocked by default. 
2. Consequently, your website may appear broken to users (if iframes or plugins don't load, etc.). 
3. Passive mixed content is displayed by default, but users can set a preference to block this type of content, as well.
4. 从控制台可以看到相关信息。


## How to fix your website
1. The best strategy to avoid mixed content blocking is to serve all the content as HTTPS instead of HTTP.
2. **For your own domain**, serve all content as HTTPS and fix your links. However, in some cases, the path may just be incorrect to the media in question. There are online as well as offline tools (depending on your operating system) such as [linkchecker](https://linkchecker.github.io/linkchecker/) to help resolve this.
3. **For other domains**, use the site's HTTPS version if available. If HTTPS is not available, you can try contacting the domain and asking them if they can make the content available via HTTPS.


## References
* [MDN Mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)