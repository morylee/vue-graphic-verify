# vue-graphic-verify

> A vue graphic verify project, that need to be used with another authentication service, you can visit [website of graphic verify service](https://verify.cloudcrowd.com.cn) to apply for an account.

## Installation

1）npm install

``` bash
npm install vue-graphic-verify --save
```

2）local install

First, you should build it with the following command.

``` bash
npm run build
```

And then, you should pack it with the following command.

``` bash
npm pack
```

Finally, enter your project and install it with the following command. It should be noted that the `path` is the path where the package was packed on the operating system in the previous step. And the `name-version` is the name and version of the package. For example, `npm install D:\vue-graphic-verify\vue-graphic-verify-1.0.0.tgz`

``` bash
npm install path/name-version.tgz
```

## Usage

You can set `GraphicVerify` default props in main.js.

By the way, when you start using it, you should know that the `apiAddr`(defaults to 'https://verify.cloudcrowd.com.cn') and `webKey` are required, and if you wanna to change the `apiAddr`, you can only set it in main.js. The `verifyWidth` are nullable, if `verifyWidth` is null, it will adjust by the image's width. The other props can be set freely.

So let's start, you can use the component in two ways.

The first way is as follows.

main.js.
``` bash
import Vue from 'vue'
import {GVerifyPlugin} from 'vue-graphic-verify'

Vue.use(GVerifyPlugin, {
  apiAddr: 'http://localhost:8888',
  webKey: 'b7db153be64749799ab48a61ebcf7a1c',
  verifyWidth: 300
})
```

Your templete file.
``` bash
<template>
  <graphic-verify :webKey="webKey" :verifyWidth="verifyWidth"></graphic-verify>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c',
      verifyWidth: '450'
    }
  }
}
</script>
```

And the other way as below.

Your templete file.
``` bash
<template>
  <g-verify :webKey="webKey" :verifyWidth="verifyWidth"></g-verify>
</template>

<script>
import gVerify from 'vue-graphic-verify'
 
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

After the above steps, you can regist a callback function to receive the successful token of `GraphicVerify`, like below.

``` bash
<template>
  <graphic-verify :webKey="webKey" :verifyWidth="verifyWidth" @verify-callback="recordToken"></graphic-verify>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c',
      verifyWidth: '450',
      verifyToken: null
    }
  },
  methods: {
    recordToken (token) {
      this.verifyToken = token
    }
  }
}
</script>
```

Also, you may want to reset the `GraphicVerify`, and we provide a method to do that.

``` bash
<template>
  <div>
    <graphic-verify ref="gVerifyBtn" :webKey="webKey" :verifyWidth="verifyWidth"></graphic-verify>
    <button @click.prevent="reset">重置</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c',
      verifyWidth: '450'
    }
  },
  methods: {
    reset () {
      this.$refs.gVerifyBtn.reset()
    }
  }
}
</script>
```

## Props

| Property | Type | Default | Description |
| :------: | ---- | ------- | ----------- |
| webKey | String | - | website key |
| verifyWidth | String, Number | image's width | `GraphicVerify` button's width |
| border | String | 1px solid rgba(51, 51, 51, 0.25) | `GraphicVerify` button's border |
| borderRadius | String | 4px | `GraphicVerify` button's border radius |
| bgColor | String | rgba(255, 255, 255, 0.9) | `GraphicVerify` button's background color |
| color | String | #333333 | `GraphicVerify` button's default color |
| successColor | String | #1ca21c | `GraphicVerify` success color |
| failureColor | String | #dd1010 | `GraphicVerify` failure color |

## methods

| Name | In Param Type | Description |
| :------: | ---- | ----------- |
| reset() | - | reset the `GraphicVerify` |

## Callbacks

| Name | Out Param Type | Description |
| :------: | ------- | ----------- |
| verify-callback | String | return the successful token of `GraphicVerify` |
