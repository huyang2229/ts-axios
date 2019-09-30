import { AxiosRequestConfig, AxiosResponse } from '../types'

interface AxiosErrorParams {
  isAxiosError: boolean
  config: AxiosRequestConfig
  message: string
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  message: string
  code?: string | null
  request?: any
  response?: AxiosResponse

  constructor(params: AxiosErrorParams) {
    super()
    const { message, code, config, request, response, isAxiosError } = params
    this.message = message
    this.code = code
    this.config = config
    this.request = request
    this.response = response
    this.isAxiosError = isAxiosError
    // 继承Error等原生类时需要重新指定原型，防止构造出的实例通过instanceof操作符得到的结果不正确
    Object.setPrototypeOf(this, AxiosError)
  }
}

export function createError(params: AxiosErrorParams): AxiosError {
  const error = new AxiosError(params)
  return error
}
