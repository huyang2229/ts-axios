import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    Accept: 'text/plain, application/json, */*'
  }
}

const methodWithoutData = ['get', 'delete', 'options', 'head']

methodWithoutData.forEach(method => {
  defaults.headers[method] = {}
})

const methodWithData = ['post', 'put', 'patch']

methodWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
