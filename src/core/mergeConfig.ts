import { AxiosRequestConfig } from '../types'
import { deepMerge, isObject } from '../helpers/util'

const strategys = Object.create(null)

// 默认合并策略，自定义配置中用了某个属性，就用自定义的
function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只接受自定义配置的合并策略
function fromVal2Strategy(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
const strategyKeysFromVal2 = ['url', 'params', 'data']
strategyKeysFromVal2.forEach(key => {
  strategys[key] = fromVal2Strategy
})

function deepMergeStrategy(val1: any, val2: any): any {
  if (isObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}
const strategyKeysDeepMerge = ['headers']
strategyKeysDeepMerge.forEach(key => {
  strategys[key] = deepMergeStrategy
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strategys[key] || defaultStrategy
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
