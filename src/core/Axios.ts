import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosInterceptorManager,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest
      }
    ]

    // 对于请求拦截器，后添加的先执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // 对于相应拦截器，先添加的先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  // request method without data
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config)
  }

  // request method with data
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }

  _requestWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    const mergedConfig = Object.assign(config || {}, {
      method,
      url
    })
    return this.request(mergedConfig)
  }

  _requestWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    const mergedConfig = Object.assign(config || {}, {
      method,
      url,
      data
    })
    return this.request(mergedConfig)
  }
}
