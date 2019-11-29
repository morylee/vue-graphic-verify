let baseUrl = ''

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://verify.cloudcrowd.com.cn'
} else {
  baseUrl = 'http://localhost:8888'
}

export {
  baseUrl
}
