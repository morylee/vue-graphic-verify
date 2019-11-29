# vue-graphic-verify

> A vue graphic verify project, that need to be used with another authentication service, you can visit [website of graphic verify service](https://verify.cloudcrowd.com.cn) to apply for an account.

## Installation

``` bash
npm install vue-graphic-verify --save
```

## Usage

You can set graphic verify default props in main.js.

By the way, apiAddr defaults to 'https://verify.cloudcrowd.com.cn', webKey defaults to null, and verifyWidth defaults to null.

More explanation, when you start using it, the apiAddr and webKey are required, and the apiAddr can be only set in main.js. The verifyWidth are nullable, if verifyWidth is null, it will be 100%.

An example as follows

``` bash
import verify from 'vue-graphic-verify'

Vue.use(verify, {
  apiAddr: 'http://localhost:8888',
  webKey: 'b7db153be64749799ab48a61ebcf7a1c',
  verifyWidth: 300
})
```

And next, you can import the component into your template as follows.

``` bash
<template>
  <g-verify :webKey="webKey" :verifyWidth="verifyWidth"></g-verify>
</template>

<script>
import {gVerify} from 'vue-graphic-verify'
 
export default {
  name: 'app',
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c',
      verifyWidth: '450'
    }
  },
  components:{
    gVerify
  }
}
</script>
```

## Props

| Property | Type | Default | Description |
| :------: | ---- | ------- | ----------- |
| webKey | String | - | web端身份标志 |
| verifyWidth | String, Number | - | 按钮宽度 |
