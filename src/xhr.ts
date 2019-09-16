import { AxiosRequestConfig } from './types'

export default function(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach(name => {
    if (!data && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
