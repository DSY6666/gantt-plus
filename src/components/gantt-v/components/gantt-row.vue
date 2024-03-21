<!--网格行-->
<template>
  <div class="gantt-row">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GanttRow'
}
</script>

<style scoped lang="scss">
  .gantt-row {
    height: 60px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    //z-index: 3;
  }
</style>
