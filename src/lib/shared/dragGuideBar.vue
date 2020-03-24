<template>
  <div class="verifyGuideBar">
    <div @touchmove.stop.prevent="movingDrag" @touchend.stop.prevent="finishDrag" @mousemove="movingDrag" @mouseup="finishDrag">
      <span ref="dragBar" class="dragBar" :style="{left: '5px'}" @touchstart.stop.prevent="startDrag" @mousedown="startDrag"></span>
      <span class="progressBar"></span>
    </div>
    <img class="freshBtn" src="../images/refresh.png" @click.prevent="fresh()" title="刷新">
  </div>
</template>

<script>
export default {
  methods: {
    startDrag (event) {
      this.$emit('start-drag', event)
    },
    movingDrag (event) {
      this.$emit('moving-drag', event)
    },
    finishDrag (event) {
      this.$emit('finish-drag', event)
    },
    moveDragBar (x) {
      this.$refs.dragBar.style.left = (x + 5) + 'px'
    },
    fresh () {
      this.$emit('do-fresh')
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../style/guideBar';
</style>
