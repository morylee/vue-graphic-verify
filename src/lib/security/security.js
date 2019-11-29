import JsEncrypt from './jsencrypt'
import CryptoJS from "crypto-js"

// RSA公钥加密
export const rsaPubEncrypt = (pas, publicKey) => {
  let jse = new JSEncrypt()
  jse.setPublicKey(publicKey)
  return jse.encryptLong(pas)
}

// RSA私钥解密
export const rsaPriDecrypt = (pas, privateKey) => {
  let jse = new JSEncrypt()
  jse.setPrivateKey(privateKey)
  return jse.decrypt(pas)
}

// RSA公钥解密
export const rsaPubDecrypt = (pas, publicKey) => {
  let jse = new JSEncrypt()
  jse.setPublicKey(publicKey)
  return jse.pubDecryptLong(pas)
}

// AES解密
export const aesDecrypt = (word, key) => {
  key = CryptoJS.enc.Utf8.parse(key)
  let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

// AES加密
export const aesEncrypt = (word, key) => {
  key = CryptoJS.enc.Utf8.parse(key)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

// MD5加密
export const md5Encrypt32 = (word) => {
  return CryptoJS.MD5(word).toString()
}

export const md5Encrypt16 = (word) => {
  let md5 = md5Encrypt32(word)
  return md5.substring(8, 24)
}
