// 操作历史
export default {
	data() {
		return {
			hisList: [], // 操作记录历史
			maxHis: 20 // 最大历史记录数
		}
	},
	computed: {},

	methods: {
		// 增加一条操作记录
		_addHisList(ganttData) {
			const his = {
				his: JSON.parse(JSON.stringify(ganttData))
			}
			const len = this.hisList.length
			if (len >= this.maxHis) {
				this.hisList.splice(0, 1)
			}
			this.hisList.push(his)
		},

		// 撤回操作
		_hisBack() {
			if (this.hisList && this.hisList.length > 0) {
				this.ganttData = this.hisList[this.hisList.length - 1].his
				this.hisList.splice(this.hisList.length - 1, 1)
				// console.log('历史操作:', this.hisList)
			} else {
				console.log('没有可撤回步骤')
			}
		},

		// 重置操作历史
		_resetHis() {
			this.hisList = []
		}
	}
}
