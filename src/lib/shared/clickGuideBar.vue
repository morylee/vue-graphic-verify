<template>
  <div class="verifyGuideBar">
    <span class="guideInfo">{{guide}}</span>
    <img class="freshBtn" src="../images/refresh.png" @click.prevent="fresh()" title="刷新">
  </div>
</template>

<script>
export default {
  props: {
    guide: {
      type: String,
      default: null
    }
  },
  methods: {
    fresh () {
      this.$emit('do-fresh')
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../style/guideBar';
</style>
