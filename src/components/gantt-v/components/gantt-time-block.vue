<!--
 * @Author: dengshiyou dengshiyou@oureman.com
 * @Date: 2024-02-28 13:55:05
 * @LastEditors: dengshiyou dengshiyou@oureman.com
 * @LastEditTime: 2024-03-05 11:21:31
 * @FilePath: \drag-gantt\src\components\gantt-v\gantt-time-block.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--甘特图时间头的一块块-->
<template>
  <div class="gantt-time-block">
    <div class="top">{{ targetTime }}</div>
    <div class="bottom">
      <!-- 24小时 -->
      <div class="day-item" v-for="index in 2" :key="index">
        <!-- <div class="text">{{ index === 2 ? '12-24' : '0-12' }}</div> -->
        <div class="text"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gantt-time-block',
  props: {
    targetTime: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
@import '../css/gant-v.scss';
.gantt-time-block {
  box-sizing: border-box;
  //border: 1px solid #999999;
  font-size: 12px;
  .top {
    box-sizing: border-box;
    border-bottom: 1px solid $tableBorderColor;
    border-right: 1px solid $tableBorderColor;
    text-align: center;
    // 60 ÷ 2 = 30
    height: $tableHeadHeight/2;
    line-height: $tableHeadHeight/2;
  }
  .bottom {
    display: flex;
    .day-item {
      //180 ÷ 3 = 60
      line-height: $tableHeadHeight/2;
      //为了保持1px 等于1分钟 所以取值60px
      width: 192px;
      height: $tableHeadHeight/2;
      background-image: repeating-linear-gradient(90deg, transparent, transparent 47px, #f3f3f3, #f3f3f3 48px);

      &:first-child {
        border-right: 1px solid $tableBorderColor;
      }

      .text {
        // margin-left: -6px;
        text-align: center;
        width: 100%;
        height: 80%;
        overflow: hidden; 
        white-space: nowrap; 
        text-overflow: ellipsis;
        background-image: repeating-linear-gradient(90deg, transparent, transparent 15px, #f3f3f3, #f3f3f3 16px);
      }
      &:last-child {
        box-sizing: border-box;
        border-right: 1px solid $tableBorderColor;
      }
    }
  }
}
</style>
