# Singleton


## 使用场景
1. 全局只需要一个或者只允许一个实例的情况，例如 store 就是这样的全局单例
2. 可用于某些 util 和 vue 插件

### Vuex

### 微信分享和授权的配置
1. 进行配置是需要先传一些基础的信息，比如说微信 APPID，所以可以封装为 class，实例化时传入。
2. 因为基础配置信息只有一套，所以没有必要也不应该重复实例化。

```js
/**
 * 使用方法
 * 1. 传 appID 实例化
 * 2. 使用相关功能
 *      * 微信授权：在需要的时候调用 baseAuth 或 userInfoAuth 进行授权。
 *      * 处理授权重定向回调：重定向回来取到 code 后，如果想清除 URL 中的 code 参数，可以调用静态方法 removeCodeParam。
 *      * 配置微信分享：
 *              1. 向服务端请求签名，可以使用静态方法 encodeUrlForSignature 处理 URL。
 *              2. 在确保 SDK 脚本加载完成后，在需要配置分享的地方调用 configShare，并传入分享配置项和签名的相关值。     
 */


/**
 * 注意事项
 * * 1.6 版本的 SDK 无法分享：参考相册 bug 文档
 * * iOS 路由后签名错误的情况：参考相册 bug 文档
 * * Android 路由切换后需要重新配置：参考相册 bug 文档
 * * 微信分享 API 数组项驼峰字符串转冒号形式的问题：参考相册 bug 文档
 */


let isWXReady = false;


// 配置分享参数
function configShareItems (shareConfig, shareApiNamesObj) {
    if(!isWXReady) {
        console.warn('window.wx is not ready');
        return;
    }
    let {title='', desc='', imgUrl='', link=''} = shareConfig;
    Object.keys(shareApiNamesObj).forEach((key) => {
        window.wx[key]({
            title, 
            desc, 
            imgUrl, 
            link, 
            success: function () {},
            cancel: function () {}
        })
    })
}


let singleton = null;

export default class Weixin {
    /**
     * 实例化参数对象
     * @param {String}  options.appId   
     * @param {Boolean} options.isDebug   是否打开调试，默认 false
     */
    constructor (options) {
        if (singleton) {
            return singleton;
        }
        else {
            this.appId = options.appId;
            this.isDebug = !!options.isDebug;
            this.shareApiNamesObj = {}; // 初始化，之后会使用 _setShareApiNamesObj 判断 SDK 版本进行相应的赋值
            return singleton = this;
        }
    }


    /**
     * 生成签名算法所需的 URL
     * 签名生成是在服务端进行，前端不需要考虑，但需要调用相应接口传递签名算法需要的 URL
     * 签名所用的 URL 有格式要求，可以使用静态方法 encodeUrlForSignature 将 URL 格式化为合理的格式
     * 参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#66
     */
    static encodeUrlForSignature (url=window.location.href) {
        let index = url.indexOf("#");
        if (index >= 0) {
            url = url.slice(0, index);
        }
        return window.encodeURIComponent(url);
    }

    // 根据 SDK 脚本加载的全局对象中的方法判断分享调用新接口还是旧接口
    // 官方文档说旧的分享接口即将废弃，但新的分享接口有 bug
    // 另外，不能用数组保存 API 名称，会被微信转换形式而无法使用。例如 `onMenuShareTimeline` 会被转换为 `menu:share:timeline`
    _setShareApiNamesObj (wx) {
        let obj = {};
        if (wx.updateTimelineShareData) { // 1.4 版本及以上
            obj = {
                updateTimelineShareData: '朋友圈',
                updateAppMessageShareData: '微信好友',
            }
        }
        else {
            obj = {
                onMenuShareTimeline: '朋友圈',
                onMenuShareAppMessage: '微信好友',
            }
        }
        this.shareApiNamesObj = obj;
    }

    /**
     * 设置分享配置
     * 可以整个项目进行一次分享配置，也可以在不同的页面进行不同的配置。例如不同页面显示不同的分享标题。
     * 每次进行分享配置时，都要调用接口生成签名，然后用签名以及签名算法中用到的时间戳和随机字符串进行分享配置
     * 
     * @param {Object} shareConfig           具体的微信分享配置
     * @param {Object} signatureApiReturned  签名接口返回的对象，至少包含 timestamp, nonceStr, signature 三个属性
     * 
     * shareConfig 可以包括 title, desc, imgUrl, link 四个属性，分别为分享标题、分享描述、分享图标 URL 和 分享链接，默认都为空
     */
    configShare (shareConfig, signatureApiReturned) {
        const wx = window.wx;
        if (!wx) {
            console.warn('window.wx is not ready');
            return;
        }

        this._setShareApiNamesObj(wx);

        let { timestamp, nonceStr, signature } = signatureApiReturned;
        wx.config({
            debug: this.isDebug,
            appId: this.appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: Object.keys(this.shareApiNamesObj),
        });
        
        wx.ready(() => {
            isWXReady = true;
            configShareItems(shareConfig, this.shareApiNamesObj);
        });
        wx.error(() => {
            console.log('wx config error!');
        });
    }


    // 生成微信授权 URL
    _generateAuthUrl (type, options={}) {
        let {redirectUrl, state} = options;
        redirectUrl = window.encodeURIComponent(redirectUrl || window.location.href);
        state = state || 'STATE';

        let authUrl =
            `https://open.weixin.qq.com/connect/oauth2/authorize` +
            `?appid=${this.appId}` +
            `&redirect_uri=${redirectUrl}` +
            `&response_type=code` +
            `&scope=${type}` +
            `&state=${state}` +
            `#wechat_redirect`;
        return authUrl;
    }

    // snsapi_base 微信授权
    // 重定向的 URL 不要 encode
    baseAuth (options) {
        let authUrl = this._generateAuthUrl('snsapi_base', options);
        window.location.replace(authUrl);
    }

    // snsapi_userinfo 微信授权
    // 重定向的 URL 不要 encode
    userInfoAuth (options) {
        let authUrl = this._generateAuthUrl('snsapi_userinfo', options);
        window.location.replace(authUrl);
    }

    /**
     * 移除授权重定向返回后的 code 参数
     * 授权重定向回来后，URL 会带上 code 参数，这个参数可以作为授权重定向的判断。
     * 如果想在获取 code 后及时清除该参数以防后续错误判断，可以调用 removeCodeParam 静态方法
     */
    static removeCodeParam () {
        let { search, hash } = window.location;
        let reg = /([&?]code=[^&#]+)/;
        let matches = search.match(reg);
        if (matches && matches[1]) {
            let isFirstParam = matches[1][0] === '?';
            let removed = isFirstParam ? search.slice(1, matches[1].length+1) : matches[1];
            search = search.replace(removed, '');
        }
        window.history.replaceState({}, '', `${search}${hash}`);
    }
}
```