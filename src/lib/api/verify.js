import fetch from './fetch'

/**
 * 获取验证码信息
 */
export const loadParams = (webKey) => fetch('/verify/param', {
  webKey
}, 'POST')

/**
 * 获取验证码
 */
export const initVerify = (webKey) => fetch('/verify/init', {
  webKey
}, 'POST')

/**
 * 校验验证码
 */
export const doVerify = (key, clientPositions) => fetch('/verify/verify', {
  key,
  clientPositions
}, 'POST')
