<!--
 * @Author: dengshiyou dengshiyou@oureman.com
 * @Date: 2024-02-28 13:55:05
 * @LastEditors: dengshiyou dengshiyou@oureman.com
 * @LastEditTime: 2024-03-11 14:40:30
 * @FilePath: \drag-gantt\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div id="app"><GanttIndex></GanttIndex></div>
</template>

<script>
import GanttIndex from './components/gantt-plus/Gantt.vue';
// import GanttIndex from './components/vue-gantt/Playground.vue';

export default {
	name: 'App',
	components: {
		GanttIndex
	}
};
</script>

<style lang="scss">
body {
	padding: 0;
	margin: 0;
}
div {
	box-sizing: border-box;
	user-select: none;
}
</style>
