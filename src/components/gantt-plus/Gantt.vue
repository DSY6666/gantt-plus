<!--甘特图首页-->

<template>
	<div class="gantt-table">
		<div class="gantt-head">
			<!-- 头部-->
			<div class="gantt-fixed">
				<div class="gantt-head" style="padding: 5px;">
					<div class="gantt-head" style="padding: 5px 20px;">
					<span>时间区间:</span>
					<div style="width: 240px;">{{ _formatDate(choiceTime[0]) }} - {{ _formatDate(choiceTime[1]) }}</div>
					<el-button type="primary" size="mini" @click="save">保存</el-button>

					<el-button type="danger" size="mini" plain @click="_hisBack">撤回({{ hisList.length }})</el-button>

					<el-button type="danger" v-if="!isDeleteMode" size="mini" plain @click="isDeleteMode = true">批量删除</el-button>
					<el-button type="danger" v-if="isDeleteMode" size="mini" plain @click="isDeleteMode = false">取消删除</el-button>
				</div>
				</div>
			</div>
		</div>
		<div class="gantt-box">
			<div class="left" ref="left">
				<div class="head">
					<!--    左边栏的列表头      -->
					<div class="head-box">
						<GanttRow>
							<GanttBlock>资源编号</GanttBlock>
						</GanttRow>
					</div>
				</div>
				<!--  左边栏的列表内容      -->
				<div class="left-box" :style="{ transform: `translateY(-${transFormYValue}px)` }">
					<GanttRow v-for="(item, index) in ganttData" :key="index">
						<GanttBlock>{{ item.seat }}</GanttBlock>
					</GanttRow>
				</div>
			</div>
			<!--    右边的内容      -->
			<div class="right" ref="right">
				<!--  时间头      -->
				<div class="head">
					<div class="head-box">
						<GanttRow :style="{ transform: `translatex(-${transFormXValue}px)` }"
							class="transition-transForm">
							<GanttTimeBlock :target-time="_formatDate(item)" v-for="(item, index) in choiceTimeArr"
								:key="index"></GanttTimeBlock>
						</GanttRow>

						<div style="width: 200px;height:60px;">备注</div>
					</div>
				</div>
				<div class="content" ref="contentGrid">
					<!--      甘特图中具体的内容   -->
					<div class="gantt-grid" ref="box" @contextmenu.prevent="() => { }">
						<!--   网格状图表  -->
						<GanttRow v-for="(item, rowIndex) in ganttData" :key="rowIndex" :id="`ganttRow-${rowIndex}`"
							class="gantt-row-relative" :class="{ 'gantt-row-active': nowSuck === rowIndex }">
							<template>

								<div v-for="(times, index) in rowBlocks(item[listKey])" :key="`times-${index}`"
									:style="_timeBlockStyle(times)" class="time-block gantt-grab"
									:class="' block-type-' + times.status"
									@mousedown="onMouseDown($event, times, rowIndex)"
									@mousemove="onMouseMove1($event, times, rowIndex)"
									@mouseout="onMouseOut($event, times, rowIndex)"
									@contextmenu.prevent="onRightClick($event, item[listKey], times)"
									@click.stop="onClicked(times, index)">
									{{ times.projectName }}
								</div>


							</template>
							<!--      block => 180  因为[this.listKey] => 60    60*3 = 180px   -->
							<GanttBlock class="time" v-for="(choiceTimeArrItem, _) in choiceTimeArr" :key="_"
								:item="item" :rowIndex="rowIndex" :choiceTimeArrItem="choiceTimeArrItem"
								@addBlock="addNewBlock" style="flex-shrink: 0">
							</GanttBlock>
							<!-- <GanttBlock style="width: 200px;" :style="_mergeStyle('typeName', item.typeName, rowIndex, false)">{{ item.remark }}</GanttBlock> -->
						</GanttRow>
					</div>
					<div v-if="currentBlock.show" class="current-block"
						:style="{ transform: `translate(${currentBlock.left}px, ${currentBlock.top}px)` }">
						<el-row  :gutter="10">	
							<el-col  :span="12"
                style="-webkit-line-clamp: 2;"
              >计划开始时间：{{ _fomatter(currentBlock.block['startTime']) }}</el-col>
              <el-col  :span="12"
                style="-webkit-line-clamp: 2;"
              >计划完成时间：{{ _fomatter(currentBlock.block['endTime']) }}</el-col>
            </el-row>
					</div>
				</div>
			</div>
		</div>

		<!-- 右键菜单 -->
		<div id="contextmenu" v-show="menuVisible" class="menu">
			<div class="contextmenu__item">查看</div>
			<div class="contextmenu__item" @click="onEditBlock(editBlock, editRow)">修改</div>
			<div class="contextmenu__item" @click="onDeleteBlock(editBlock)">删除</div>
		</div>

		<!-- 编辑窗口 -->
		<el-dialog title="编辑时间块" append-to-body :visible.sync="isEditBlock">
			<el-form v-if="editBlock" :model="editBlock" label-width="120px">
				<el-form-item label="名称"><el-input v-model="editBlock.projectName"
						autocomplete="off"></el-input></el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker @change="onChangeStartTime" v-model="editBlock.startTime" type="datetime"
						placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="时间长度">
					<el-input-number v-model="editBlock.timeDiff" @change="onChangeStartTime" :min="1" :max="100"
						label="时间长度"></el-input-number>
				</el-form-item>
				<el-form-item label="结束时间"><el-date-picker readonly v-model="editBlock.endTime" type="datetime"
						placeholder="选择日期时间"></el-date-picker></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onEditCancel()">取 消</el-button>
				<el-button type="primary" @click="onEditSave()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import GanttRow from './components/gantt-row';
import GanttBlock from './components/gantt-block';
import GanttTimeBlock from './components/gantt-time-block';
import ganttMix from './components/gantt-mix.js';
import ganttHisMix from './components/gantt-his-mix.js';

import airPlaneData from './components/airPlaneData.js';

export default {
	name: 'gantt-index',
	components: { GanttBlock, GanttRow, GanttTimeBlock },
	mixins: [ganttMix, ganttHisMix],
	data() {
		return {
			// 用right 的滚动，控制aside-left的滚动
			transFormYValue: 0,
			// 用right 的滚动，控制head-left的滚动
			transFormXValue: 0,
			// 飞机的数据，用于渲染左侧边
			ganttData: airPlaneData.getData(),
			// 选择的时间区间
			choiceTime: [
				new Date(this.$dayjs().locale('zh-cn').format('YYYY/MM/DD 00:00:00')),
        new Date(this.$dayjs(new Date(this.$dayjs().locale('zh-cn').format('YYYY/MM/DD 00:00:00'))).add(2, 'month')),
      ],

			choiceTimeArr: [],

			defaultTop: 10,
			nowSuck: -1,
			// X轴移动距离
			moveX: 0,
			// Y轴移动距离
			moveY: 0,

			// 是否显示编辑弹出框
			isEditBlock: false,
			// 编辑内容
			editBlock: null,
			// 编辑行
			editRow: null,
			// 数据列表key名字
			listKey: 'blockList',
			//右键菜单
			menuVisible: false,
			// 鼠标当前的移入的时间块
			currentBlock: {
				drag: false,
				show: false,
				left: 0,
				top: 0,
				block: null,
			}
		};
	},
	provide() {
		return {
			page: this
		};
	},
	watch: {
		choiceTime: {
			handler() {
				console.log('触发时间增加');
				const timeArr = [];
				// 时间戳毫秒为单位
				// 尾时间-首时间 算出头尾的时间戳差  再换算成天单位                                   毫秒->分->时->天
				const diffDays = (this.choiceTime[1].getTime() - this.choiceTime[0].getTime()) / 1000 / 60 / 60 / 24;

				// 一天的时间戳
				const oneDayMs = 24 * 60 * 60 * 1000;
				// 差了多少天就便利多少天 首时间+当前便利的天数的毫秒数
				for (let i = 0; i < diffDays + 1; i++) {
					// 时间戳来一个相加，得到的就是时间数组
					timeArr.push(new Date(this.choiceTime[0].getTime() + i * oneDayMs));
				}

				console.log(diffDays, oneDayMs, timeArr);
				this.choiceTimeArr = timeArr;
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		// 通过选择的时间区间，得到这区间之间的数组
		// choiceTimeArr() {
		// 	console.log('触发时间增加');
		// 	const timeArr = [];
		// 	// 时间戳毫秒为单位
		// 	// 尾时间-首时间 算出头尾的时间戳差  再换算成天单位                                   毫秒->分->时->天
		// 	const diffDays = (this.choiceTime[1].getTime() - this.choiceTime[0].getTime()) / 1000 / 60 / 60 / 24;

		// 	// 一天的时间戳
		// 	const oneDayMs = 24 * 60 * 60 * 1000;
		// 	// 差了多少天就便利多少天 首时间+当前便利的天数的毫秒数
		// 	for (let i = 0; i < diffDays + 1; i++) {
		// 		// 时间戳来一个相加，得到的就是时间数组
		// 		timeArr.push(new Date(this.choiceTime[0].getTime() + i * oneDayMs));
		// 	}

		// 	console.log(diffDays, oneDayMs, timeArr);
		// 	return timeArr;
		// },

		// 行列表过滤删除的时间段,已删除的不显示
		rowBlocks() {
			return list => {
				return list.filter(item => {
					return item.isValidate === '1';
				});
			};
		}
	},
	methods: {
		// 滚动事件
		getScrollEvent() {
			const rightDom = this.$refs.contentGrid;

			// 获取contentGrid宽高
			this.currentBlock.w = rightDom.offsetWidth;

			this.currentBlock.h = rightDom.offsetHeight;
			rightDom.addEventListener('scroll', e => {
				const scrollLeft = e.target.scrollLeft;
				const scrollTop = e.target.scrollTop;
				this.transFormYValue = scrollTop;
				this.transFormXValue = scrollLeft;
			});

			const leftDom = this.$refs.left;
			leftDom.addEventListener('mousewheel', e => {
				const wheelValue = e.deltaY;
				rightDom.scrollTop += wheelValue;
			});
		},

		/**
		 * 当对于这个时间块按下的时候
		 * @param e 时间块的 event 事件
		 * @param times 时间块
		 * @param rowIndex 该条线的id
		 */
		onMouseDown(e, times, rowIndex) {
			const { id: blockId, canMove } = times;
			this.currentBlock.drag = true;
			if (!canMove) {
				this.currentBlock.drag = false;
				return;
			}
			// 删除模式下不处理拖动事件
			if (this.isDeleteMode) {
				return;
			}
			this.moveX = 0;
			this.moveY = 0;

			// 用box 移动，不采用 Doucment
			const box = this.$refs.box;
			const dom = e.target;
			// 算出鼠标相对元素的位置
			const disX = e.clientX - dom.offsetLeft;
			const disY = e.clientY - dom.offsetTop;

			// 当点击下来的时候 nowSuck 其实等于的就是当前index
			this.nowSuck = rowIndex;

			// 让本来拥有手掌样式的class取消
			dom.classList.remove('gantt-grab');
			// 让整个box 鼠标都是抓住
			box.classList.add('gantt-grabbing');

			// 如果事件绑定在 dom上，那么一旦鼠标移动过快就会脱离掌控
			box.onmousemove = ee => {
				// 获得当前受到拖拽的div 用于计算suck 所谓拖引的行数
				const top = parseInt(dom.style.top);
				// 四舍五入 获得磁性吸附激活的值 (索引值)  60是block的height 10是时间块距离block的top  suck 可以当作row的索引
				let suck = Math.round((top - 10) / 60) + rowIndex;

				// suck的边界值设置
				if (suck < 0) {
					suck = 0;
				} else if (suck > this.ganttData.length - 1) {
					suck = this.ganttData.length - 1;
				}

				// suck 行样式变化
				this.nowSuck = suck;
				console.log(this.nowSuck, '====>当前行');

				// 移动事件
				this.onMouseMove(ee, disX, disY, dom);
			};
			// 不管在哪里，鼠标松开的时候，清空事件 所以对于这个 “不管在哪里，使用了window”
			window.onmouseup = () => {
				this.currentBlock.drag = false;
				// 鼠标松开了，让时间块恢复手掌样式
				dom.classList.add('gantt-grab');
				// 整个box 不在抓住了，变成箭头鼠标
				box.classList.remove('gantt-grabbing');
				// 当移动距离小于5时,不做移动处理
				//console.log('移动距离:', this.moveX, this.moveY);
				if (this.moveX < 1 && this.moveY < 1 && this.moveX > -1 && this.moveY > -1) {
					console.log('无效移动');
					box.onmousemove = null;
					window.onmouseup = null;
					this.nowSuck = -1;
					return;
				}
				// 保存操作日志
				this._addHisList(this.ganttData);

				const index = this.ganttData[rowIndex][this.listKey].findIndex(item => {
					return item.id === blockId;
				});
				const oldTimeBlock = this.ganttData[rowIndex][this.listKey][index];
				// let timeId = oldTimeBlock.id;

				// startTime 与 endTime 用于数据重新替换  上面css已经经过计算 16px为1小时
				const startTime = new Date(this.choiceTime[0].getTime() + (parseInt(dom.style.left) * 3600000) / 8);
				const endTime = new Date(this._getTime(startTime) + (parseInt(dom.style.width) * 3600000) / 8);
				// console.log(startTime, endTime, dom.style.width, parseInt(dom.style.left) * 60 * 1000);
				let suck = this.nowSuck;

				// 加入新数据
				const data = oldTimeBlock;
				// 更新开始时间和结束时间
				this.$set(data, 'startTime', startTime);
				this.$set(data, 'endTime', endTime);
				// 修改时间块的equipmentId
				this.$set(data, 'equipmentId', this.ganttData[suck].id);
				/**
				 * 本来dom元素磁性吸附是打算用document.appendChild() 方式来做的，但是对于vue来说 for出来的子元素就算变了位置，其index也不属于新的row
				 */
				// 老数据 删除
				this.ganttData[rowIndex][this.listKey].splice(index, 1);

				// 新数据加入
				this.ganttData[suck][this.listKey].push(data);

				// 坐标定位 磁性吸附 永远的10px   不知道为啥动态绑定的元素也会受到以前元素的影响，可能是 for 中 index带来的影响
				dom.style.top = this.defaultTop + 'px';

				// 松开鼠标的时候 清空
				box.onmousemove = null;
				window.onmouseup = null;

				// 需要重新计算吸附位置,以及整行重新排列
				this.$nextTick(() => {
					this._recalcRowTimes(data, this.ganttData[suck][this.listKey]);
					// if (this.nowSuck != rowIndex) {
					// 	this._hisBack();
					// 	console.log('暂不支持换行移动！！');
					// }

					// 将当前row 清空
					this.nowSuck = -1;
				});


				// 改变位置后回调事件
				this.afterChangePosition(data, this.ganttData[rowIndex].id, this.ganttData[suck].id);
			};
		},
		onMouseMove1(e, times, rowIndex) {
      const left =
        ((this._getTime(times.startTime) - this._getTime(this.choiceTime[0])) /
          3600000) * 8
					
      let disX = e.offsetX + left + 15
      let disY = e.offsetY + rowIndex * 60 + 15
			
      // 判断位置进行展示
      if (this.currentBlock.h + this.transFormYValue - disY < 155) disY = disY - 155
      if (this.currentBlock.w + this.transFormXValue - disX < 315) disX = disX - 315

      this.$set(this.currentBlock, 'left', disX)
      this.$set(this.currentBlock, 'top', disY)
      this.currentBlock.block = times
      // 非拖拽模式下才显示信息
      if (this.currentBlock.drag || !times.canMove) {
        this.currentBlock.show = false
      } else {
        this.currentBlock.show = true
      }
    },
		onMouseOut() {
			// 算出鼠标相对元素的位置
			this.currentBlock.show = false;
		},

		// 时间块点击
		onClicked(time) {
			console.log('点击:', time);
			this.currentBlock.show = false;
			if (this.isDeleteMode) {
				this.onDeleteBlock(time);
			}
		},

		/**
		 * 鼠标移动的时候，前置条件鼠标按下
		 * @param e 时间块的 event 事件
		 * @param disX x轴
		 * @param disY y轴
		 * @param targetDom 时间块的dom 其实可以直接 e.target 获取
		 */
		onMouseMove(e, disX, disY, targetDom) {
			// 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
			let left = e.clientX - disX;
			const top = e.clientY - disY;
			this.moveX = left;
			this.moveY = top;

			// 移动位置不能小于零(开始时间)
			if (left < 0) {
				left = 0;
			}

			//拖动时间块关闭右键菜单
			this.menuVisible = false;

			targetDom.style.left = left + 'px';
			targetDom.style.top = top + 'px';
		},
		/**
		 * 时间块位置变化后回调事件
		 * @param data 时间块的值 包括时间块id startTime endTime
		 * @param rowOId 时间块原来所在的那个飞机id (一条横线)
		 * @param rowNId 时间块新的所在的那个飞机id
		 */
		afterChangePosition(data, rowOId, rowNId) {
			console.log('时间块位置变化后回调事件', rowOId, rowNId);
		},

		save() {
			console.log(JSON.stringify(this.ganttData));
		},

		// 删除时间块,需要传入时间块信息和序号
		onDeleteBlock(block) {
			// 保存操作日志
			this._addHisList(this.ganttData);
			// const row = this.ganttData[rowIndex] /
			// row[this.listKey].splice(index, 1)
			this.$set(block, 'isValidate', '0');
		},

		onRightClick(event, row, block) {
			//编辑需要把时间长度先计算好
			block.timeDiff = (block.endTime - block.startTime) / 3600000;
			this.editRow = row;
			this.editBlock = block;

			this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
			this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
			event.preventDefault(); //关闭浏览器右键默认事件
			this.CurrentRow = row;
			var menu = document.querySelector('.menu');
			this.styleMenu(menu);
		},

		cancelMouse() {
			// 取消鼠标监听事件 菜单栏
			this.menuVisible = false;
			document.removeEventListener('click', this.foo); // 关掉监听，
		},

		styleMenu(menu) {
			if (event.clientX > 1800) {
				menu.style.left = event.clientX - 100 + 'px';
			} else {
				menu.style.left = event.clientX + 1 + 'px';
			}
			document.addEventListener('click', this.cancelMouse); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
			if (event.clientY > 700) {
				menu.style.top = event.clientY - 30 + 'px';
			} else {
				menu.style.top = event.clientY - 10 + 'px';
			}
		},

		// 格式化开始结束时间
		formateTime({ startTime, endTime }) {
			return `${this._fomatter(startTime)} ~ ${this._fomatter(endTime)}`
		},

		// 开始编辑时间块,需要传入时间块和本行列表
		onEditBlock() {
			this.editBlock = JSON.parse(JSON.stringify(this.editBlock));
			this.isEditBlock = true;
		},

		onChangeStartTime(event) {
			console.log('onChangeStartTime:', event);
			let startTime = this._getTime(this.editBlock.startTime);
			this._updateEndTimeByDiff(this.editBlock, startTime);
		},


		/**
		 * 新增一个block
		 * @param {*} param0 
		 */
		addNewBlock({ rowIndex, startTime }) {
			console.log(rowIndex, startTime);
			const { blockList } = this.ganttData[rowIndex];
			this._addHisList(this.ganttData);
			let data = {
				...blockList[0],
				startTime,
				endTime: (startTime + 900000 * 4 * 12)
			}
			blockList.push(data);
			// 需要重新计算吸附位置,以及整行重新排列
			this.$nextTick(() => {
				this._recalcRowTimes(data, this.ganttData[rowIndex][this.listKey]);
			});
		},

		// 保存数据
		onEditSave() {
			this.isEditBlock = false;
			console.log(this.editRow, this.editBlock);

			const index = this.editRow.findIndex(item => {
				return item.id === this.editBlock.id;
			});
			if (index >= 0) {
				// 保存操作日志
				this._addHisList(this.ganttData);
				this.$set(this.editRow, index, this.editBlock);
				// 需要重新计算吸附位置,以及整行重新排列
				this.$nextTick(() => {
					this._recalcRowTimes(this.editBlock, this.editRow);
				});
			}
		},

		// 取消保存
		onEditCancel() {
			this.isEditBlock = false;
		}
	},
	mounted() {
		this.getScrollEvent();
	}
};
</script>

<style scoped lang="scss">
@import './css/gant-v.scss';

.contextmenu__item {
	display: block;
	line-height: 34px;
	text-align: center;
}

.contextmenu__item:not(:last-child) {
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu {
	position: absolute;
	background-color: #fff;
	width: 100px;
	/*height: 106px;*/
	font-size: 12px;
	color: #444040;
	border-radius: 4px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-radius: 3px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
	white-space: nowrap;
	z-index: 1000;
}

.contextmenu__item:hover {
	cursor: pointer;
	background: #66b1ff;
	border-color: #66b1ff;
	color: #fff;
}
</style>
