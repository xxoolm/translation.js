// TODO: 暂时先写死一个 Cookie，后面有时间了改为在百度接口返回 997 错误码的时候自动获取。
// 在浏览器端，如果用户的浏览器中没有这个 Cookie，则第一次请求接口时会报错，但第二次开始会正常，
// 因为目前每次请求接口前都会先访问 fanyi.baidu.com，第一次请求接口时访问 fanyi.baidu.com 时就有 Cookie 了，
// 第二次请求接口时访问 fanyi.baidu.com 就会给正确的 token
export default 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;'
