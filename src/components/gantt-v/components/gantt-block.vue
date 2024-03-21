<!--
 * @Author: dengshiyou dengshiyou@oureman.com
 * @Date: 2024-02-28 13:55:05
 * @LastEditors: dengshiyou dengshiyou@oureman.com
 * @LastEditTime: 2024-03-05 11:19:07
 * @FilePath: \drag-gantt\src\components\gantt-v\gantt-block.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--网格块-->
<template>
  <div class="gantt-block" @click="onClick($event)">
    <slot>
      <div class="gantt-block-background"></div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'GanttBlock',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: null
    },
    choiceTimeArrItem: {
      type: Date,
      default: null
    }
  },
  methods: {
    onClick(e) {
			// 算出鼠标相对元素的位置
			const disX = e.offsetX;
      // 15分钟为一个单位
      const minute = parseInt(disX / 4);
      const startDay = new Date(this.choiceTimeArrItem).getTime();
      const startDayTime = startDay + (minute * 900000)
      // 判断这个时间段内是否被占用
      const { blockList } = this.item;
      let canAdd = blockList.some(item=> {
        const { startTime, endTime } = item;
        return startDayTime + 60000>startTime&&startDayTime<endTime
      })
      if(!canAdd) {
        this.$emit('addBlock', { rowIndex: this.rowIndex, startTime: startDayTime});
      } else {
        console.log('禁止插入');
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../css/gant-v.scss';

.gantt-block {
  text-align: center;
  line-height: 60px;
  height: 60px;
  width: 384px; // 24小时
  box-sizing: border-box;
  border-right: 2px solid $tableBorderColor;
  border-bottom: 1px solid $tableBorderColor;

  // 给时间段加上小时分割线,每一个小时为16px 24个小时为384px
  &.time {
    background-image: repeating-linear-gradient(90deg, transparent, transparent 3px, #f3f3f3, #f3f3f3 4px);
  }
  &-background {
    height: 40px;
    margin-top: 10px;
    background-color: #eb8a1b;
  }
}
</style>
