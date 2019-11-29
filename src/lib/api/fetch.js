import Vue from 'vue'
import {
  baseUrl
} from '../config/env'

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase()
  if (Vue.prototype.apiAddr) {
    url = Vue.prototype.apiAddr + url
  } else {
    url = baseUrl + url
  }

  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'string') {
          dataStr += key + '=' + data[key].trim() + '&'
        } else {
          dataStr += key + '=' + data[key] + '&'
        }
      }
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      },
      mode: 'cors',
      cache: 'no-cache'
    }

    if (type === 'POST') {
      let jsonData = JSON.stringify(data)
      Object.defineProperty(requestConfig, 'body', {
        value: jsonData
      })
    }

    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()

      return new Promise((resolve, reject) => {
        resolve(responseJson)
      })
    } catch (error) {
      return {httpCode: -1, msg: '无效的地址'}
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        requestObj = ''
      }

      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/json')
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            resolve({httpCode: -1, msg: '无效的地址'})
          }
        }
      }
    })
  }
}
