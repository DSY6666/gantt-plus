/*
 * @Author: dengshiyou dengshiyou@oureman.com
 * @Date: 2024-02-28 13:55:05
 * @LastEditors: dengshiyou dengshiyou@oureman.com
 * @LastEditTime: 2024-03-11 14:49:32
 * @FilePath: \drag-gantt\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import App from './App.vue'
import dateFormat from "@/config/dateFormat.js"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import dayjs from 'dayjs'

Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs;

Vue.use(ElementUI)
Vue.use(dateFormat)
new Vue({
	render: h => h(App),
}).$mount('#app')
