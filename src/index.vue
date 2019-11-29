<template>
  <verify :webKey="webKey" :verifyWidth="verifyWidth"></verify>
</template>

<script>
import verify from './lib/verify'

export default {
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c',
      verifyWidth: 300
    }
  },
  components: {
    verify
  }
};
</script>
