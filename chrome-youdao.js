chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ requestHeaders }) => {
    const r = {
      name: 'Referer',
      value: 'https://fanyi.youdao.com'
    }
    const index = requestHeaders.findIndex(
      ({ name }) => name.toLowerCase() === 'referer'
    )
    if (index >= 0) {
      requestHeaders.splice(index, 1, r)
    } else {
      requestHeaders.push(r)
    }
    return { requestHeaders }
  },
  {
    urls: ['https://fanyi.youdao.com/translate_o'],
    types: ['xmlhttprequest']
  },
  ['blocking', 'requestHeaders']
)
