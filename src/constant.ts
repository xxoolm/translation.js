export const enum ERROR_CODE {
  // TODO: 添加超时时间功能
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT', // 查询接口时超时了
  NETWORK_ERROR = 'NETWORK_ERROR', // 使用 superagent 查询时网络出问题了
  API_SERVER_ERROR = 'API_SERVER_ERROR', // 接口服务出问题了
  UNSUPPORTED_LANG = 'UNSUPPORTED_LANG', // 不支持的语种
  NO_THIS_API = 'NO_THIS_API' // 没有这个 API
}

// TODO: 后期打出两个包出来，一个专门给浏览器，一个专门给 Node.js，避免运行时判断环境。
export const IS_NODE = typeof window === 'undefined'
