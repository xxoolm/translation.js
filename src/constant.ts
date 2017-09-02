export enum ERROR_CODE {
  NETWORK_TIMEOUT, // 使用 superagent 查询时超时了
  NETWORK_ERROR, // 使用 superagent 查询时网络出问题了
  API_SERVER_ERROR, // 接口服务出问题了
  API_UNSUPPORT_LANG, // 接口不支持的语种
  API_UNABLE_DETECT_LANG // 对应的 API 无法检测到文本的语种
}
