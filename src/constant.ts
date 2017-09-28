export const enum ERROR_CODE {
  NETWORK_ERROR = 'NETWORK_ERROR', // 使用 superagent 查询时网络出问题了
  API_SERVER_ERROR = 'API_SERVER_ERROR', // 接口服务出问题了
  UNSUPPORTED_LANG = 'UNSUPPORTED_LANG', // 不支持的语种
  NO_THIS_API = 'NO_THIS_API' // 没有这个 API
}
