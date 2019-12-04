<template>
  <verify :webKey="webKey"></verify>
</template>

<script>
import verify from './lib/verify'

export default {
  data () {
    return {
      webKey: 'b7db153be64749799ab48a61ebcf7a1c'
    }
  },
  components: {
    verify
  }
};
</script>
