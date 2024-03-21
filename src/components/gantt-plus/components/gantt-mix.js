export default {
	data() {
		return {
			isDeleteMode: false // 是否删除模式
		}
	},
	computed: {
		//  获取时间段的位置
		_timeBlockStyle() {
			return (block) => {
				let left = 0
				let width = 10
				if (block && block.startTime && block.endTime) {
					// 一个小时长度为15px
					left = (this._getTime(block.startTime) - this._getTime(this.choiceTime[0])) / 3600000 * 8
					width = (this._getTime(block.endTime) - this._getTime(block.startTime)) / 3600000 * 8
				}
				const style = {
					top: this.defaultTop + 'px',
					left: `${left}px`,
					width: `${width}px`
				}
				// 滚动条滚动到当前时间块的范围内,给字体加上左边距
				if (this.transFormXValue > left && this.transFormXValue < (left + width)) {
					// 计算左边距
					let paddingLeft = this.transFormXValue - left + 10
					// 计算字体长度 加上原来左右边距各10px
					const textWidth = this._stringLength(block.projectName) * 6 + 10
					// 左边距加上字体长度大于整体长度的时候,直接使用固定左边距
					paddingLeft = paddingLeft > (width - textWidth) ? width - textWidth : paddingLeft
					// console.log(block.projectName, block.projectName.length, width, textWidth, paddingLeft)
					style.paddingLeft = paddingLeft + 'px'
				}

				// 删除模式下修改背景颜色
				if (this.isDeleteMode) {
					style.backgroundColor = '#999999'
					style.webkitUserDrag = 'none'
					style.cursor = 'default'
				}

				return style
			}
		},
		/**
		 * 需要合并的单元格子
		 * @param key 单元格名称
		 * @param value 需要合并的值
		 * @param index 当前行的Index
		 */
		_mergeStyle() {
			return (key, value, index, center = true) => {
				const returnStyle = {}
				if (this.ganttData && this.ganttData.length > 1) {
					if (index < this.ganttData.length - 1) {
						// 是否显示底部分割线
						const nextRow = this.ganttData[index + 1]
						if (nextRow[key] === value) {
							returnStyle.borderBottom = 'none'
						}

						// 计算行高
						let lastIndex = index
						for (let rowIndex = index + 1; rowIndex < this.ganttData.length; rowIndex++) {
							const row = this.ganttData[rowIndex]
							if (row[key] === value) {
								lastIndex = rowIndex
							}
						}
						returnStyle.height = 60 * (lastIndex - index + 1) + 'px'
						if (center) {
							returnStyle.lineHeight = 60 * (lastIndex - index + 1) + 'px'
						}
					}

					if (index >= 1) {
						// 是否需要显示文字,把文字颜色变成背景颜色
						const lastRow = this.ganttData[index - 1]
						if (lastRow[key] === value) {
							returnStyle.color = '#ffffff'
						}
					}
				}
				return returnStyle
			}
		}
	},

	methods: {
		// 移动后重新计算整行时间
		_recalcRowTimes(block, row) {
			console.log('_recalcTimes', row.length, block.id)
			// 整行过滤掉删除标志
			let calcRow = row.filter((item) => {
				return item.isValidate === '1'
			})

			// 移动的时间块按照一个小时取整,小于半个小时归零,大于半个小时加一个小时,自动吸附到小时分割线
			// let startTime = this._getTime(block.startTime)
			// const more = startTime % 3600000
			// if (more < 1800000) {
			// 	startTime = startTime - more
			// } else {
			// 	startTime = startTime - more + 3600000
			// }
			// 移动的时间块按照15分钟取整,小于7.5分钟不移动,大于7.5分钟加15分钟
			let startTime = this._getTime(block.startTime)
			const more = startTime % 900000
			if (more < 450000) {
				startTime = startTime - more
			} else {
				startTime = startTime - more + 900000
			}
			this._updateEndTime(block, startTime)

			// 如果整行可以显示的时间块数量少于1个,就不需要重新计算了
			if (calcRow.length <= 1) return

			// 当时间块移动到日期范围的最前面的时候,原来置顶的模块加上1分钟,再后面重新计算
			if (this._getTime(block.startTime) === this.choiceTime[0].getTime()) {
				const firstBlock = calcRow.find((item) => {
					return this._getTime(block.startTime) === this._getTime(item.startTime) && block.id !== item
						.id
				})
				if (firstBlock) {
					const newTime = this._getTime(firstBlock.startTime) + 60000
					this._updateEndTime(firstBlock, newTime)
				}
			}

			// 重新按照开始时间排序
			calcRow = this._sort(calcRow)
			// calcRow.forEach((item) => {
			// 	console.log('时间块', item.projectName, item.startTime, item.endTime)
			// })

			// 从第一个起同时获取下一个时间块,2个时间块对比,如果下一个时间块开始时间大于本时间块的结束时间,自动移动下一个时间块
			if (calcRow.length > 1) {
				for (let i = 1; i < calcRow.length; i++) {
					const nowBlock = calcRow[i]
					const lastBlock = calcRow[i - 1]
					if (this._getTime(lastBlock.endTime) > this._getTime(nowBlock.startTime) ) {
						if(nowBlock.canMove) {
							this._updateEndTime(nowBlock, this._getTime(lastBlock.endTime))
						} else {
							console.log('无法移动')
							this._hisBack()
						}
						// console.log('_recalcTimes移动新位置', nowBlock.projectName, nowBlock.id, nowBlock.startTime)
					}
				}
			}
		},

		// 根据初始时间更新结束时间,startTime为时间戳格式
		_updateEndTime(block, startTime, oldStartTime = null) {
			startTime = oldStartTime || startTime
			if (startTime instanceof String) {
				startTime = new Date(startTime).getTime()
			}
			if (startTime instanceof Date) {
				startTime = startTime.getTime()
			}
			const diff = this._getTime(block.endTime) - this._getTime(block.startTime)
			const endTime = new Date(startTime + diff)

			// 拖拽时间超出最大时间，时间往后增加
			let endDate = this.choiceTime[1];
			const endDateTime = endDate.getTime();
			if(endDateTime < endTime) {
				let diffDay = Math.floor((endTime - endDateTime) / (3600000 * 24)); // 向下取整计算天数
				endDate.setDate(endDate.getDate() + diffDay);
				this.choiceTime = [this.choiceTime[0], endDate];
			}

			this.$set(block, 'startTime', startTime)
			this.$set(block, 'endTime', endTime)
			console.log('--updateEndTime:', block.projectName, block.id, block.startTime, diff, block.endTime)
		},

		/**
		 * 编辑时间块参数时,根据时长来更新结束时间,时长需要预先设置好
		 * @param {Object} block
		 * @param {Object} startTime
		 */
		_updateEndTimeByDiff(block, startTime) {
			if (startTime instanceof String) {
				startTime = new Date(startTime).getTime()
			}
			if (startTime instanceof Date) {
				startTime = startTime.getTime()
			}
			const diff = block.timeDiff * 3600000
			const endTime = new Date(startTime + diff)
			
			this.$set(block, 'startTime', startTime)
			this.$set(block, 'endTime', endTime)
			console.log('--_updateEndTimeByDiff:', block.projectName, block.id, block.startTime, diff, block.endTime)
		},


		// 时间或时间字符串格式化为YYYY-MM-dd hh:mm:ss或者YYYY-MM-dd
		_fomatter(date, full = true) {
			if (!date) return ''
			let myDate = date
			try {
				if (date instanceof Date) {
					myDate = date
				} else {
					myDate = new Date(date)
				}
				const year = myDate.getFullYear()
				const month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
				const day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
				if (full) {
					const hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
					const minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
					// const seconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
					return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes  // + ':' + seconds
				} else {
					return year + '-' + month + '-' + day
				}
			} catch (e) {
				console.log('格式化错误', e)
			}
			return myDate
		},

		// 时间或时间字符串格式化为YYYY-MM-dd
		_formatDate(date) {
			return this._fomatter(date, false)
		},

		// 获取时间戳
		_getTime(timeStr) {
			if (!timeStr) return ''
			if (timeStr instanceof Date) {
				return timeStr.getTime()
			} else {
				return new Date(timeStr).getTime()
			}
		},

		// 整行按照开始时间排序
		_sort(row) {
			return row.sort((a, b) => {
				return this._getTime(a.startTime) - this._getTime(b.startTime)
			})
		},

		// 计算字符串长度,中文算2个长度
		_stringLength(str) {
			let length = 0
			const array = Array.from(str)
			array.forEach(function(char) {
				if (char.charCodeAt(0) > 255) { // 字符编码大于255，说明是双字节字符
					length += 2
				} else {
					length++
				}
			})
			return length
		}
	},

}
