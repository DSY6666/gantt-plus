/* eslint-disable */
import dayjs from "dayjs";

const airPlaneData = {
	randomId: (length = 10) => {
		return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);;
	},

	randomNum: (Min, Max) => {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},

	// 生成随机数据
	getData: () => {
		let datas = []
		for (let rowIndex = 0; rowIndex < 15; rowIndex++) {
			const rowId = airPlaneData.randomId() + "" + rowIndex;
			const row = {
				id: rowId,
				name: rowIndex <= 8 ? '设备1-' + rowIndex : '设备2-' + rowIndex,
				typeName: rowIndex <= 8 ? '分类1' : '分类2',
				model: rowIndex,
				seat: airPlaneData.randomNum(1, 5) + "楼",
				blockList: [],
				remark: "1231231231321dsfsdfsdf"
			}

			let now = new Date(dayjs().locale('zh-cn').format('YYYY/MM/DD 00:00:00')).getTime();
			let types = [{
					status: 1,
					name: "转动测试"
				},
				{
					status: 1,
					name: "速度测试"
				},
				{
					status: 1,
					name: "运行测试"
				},
				{
					status: 2,
					name: "停机"
				}
			]

			const blockNum = airPlaneData.randomNum(5, 10)
			for (let blockIndex = 0; blockIndex < blockNum; blockIndex++) {
				const randomDiff = airPlaneData.randomNum(5, 200); //长度多少小时
				const startTime = now;
				const endTime = now + randomDiff * 3600000
				const type = types[airPlaneData.randomNum(0, types.length - 1)]

				const block = {
					id: airPlaneData.randomId() + "" + blockIndex,
					equipmentId: rowId,
					startTime: startTime,
					endTime: endTime,
					status: type.status,
					projectName: type.name + " - " + blockIndex,
					projectCode: airPlaneData.randomId(),
					isValidate: "1",
					canMove: type.status != 2
				}

				now = endTime;
				//console.log(randomDiff, startTime, new Date(startTime), airPlaneData.fomatter(new Date(startTime)));
				console.log(JSON.stringify(block))

				row.blockList.push(block);
			}

			datas.push(row)
		}
		// console.log(datas)

		return datas;

		return [{
				id: "r1",
				model: 1,
				seat: airPlaneData.randomNum(1, 5) + "楼",
				type: '转台1',
				typeName: '转台',
				remark: "备注 \nasdsa /n sadsad",
				blockList: [{
					id: '1',
					equipmentId: "r1",
					projectName: '测试项目1',
					status: '1',
					startTime: '2022-4-14 10:00:00',
					endTime: '2022-4-14 24:00:00',
					isValidate: "1"
				}]
			},
			{
				id: "r2",
				model: 1,
				seat: airPlaneData.randomNum(1, 5) + "楼",
				type: '转台2',
				typeName: '转台',
				remark: "备注 \nasdsa /n sadsad",
				blockList: [{
						id: '11',
						equipmentId: "r2",
						projectName: '测试项目2',
						status: '1',
						startTime: '2022-4-14 10:00:00',
						endTime: '2022-4-14 24:00:00',
						isValidate: "1"
					},
					{
						id: '12',
						equipmentId: "r2",
						projectName: '测试项目3',
						status: '0',
						startTime: '2022-4-15 00:00:00',
						endTime: '2022-4-16 5:00:00',
						isValidate: "1"
					},
					{
						id: '13',
						equipmentId: "r2",
						projectName: '预留',
						status: '2',
						startTime: '2022-4-16 5:00:00',
						endTime: '2022-4-16 9:00:00',
						isValidate: "1"
					}, {
						id: '13',
						equipmentId: "r2",
						projectName: '故障4',
						status: '3',
						startTime: '2022-4-16 10:00:00',
						endTime: '2022-4-16 24:00:00',
						isValidate: "1"
					}

				]
			},
		]
	},

	fomatter: (date) => {
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
			const hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
			const minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
			const seconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
			return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
		} catch (e) {
			console.log('格式化错误', e)
		}
		return myDate
	},



}



export default airPlaneData;
