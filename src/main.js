// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

//element相关
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//css相关
import '../src/assets/css/reset.css' //导入css文件
import '../src/assets/css/myMax.css'

//字体图标相关
import '../src/assets/fonts/iconfont.css'



Vue.config.productionTip = false
Vue.use(ElementUI)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求代码的总拦截
axios.interceptors.request.use(
  config => {
    //console.log(config);  // 该处可以将config打印出来看一下，该部分将发送给后端（server端）
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config  // 对config处理完后返回，下一步将向后端发送请求
  },
  error => {  // 当发生错误时，执行该部分代码
    console.log(error); //调试用
    return Promise.reject(error)
  }
)
//响应的代码拦截
// axios.interceptors.response.use(
//   response => {  // 该处为后端返回整个内容
//     const res = response.data;  // 该处可将后端数据取出，提前做一个处理
//     if ('正常情况') {
//       return response  // 该处将结果返回，下一步可用于前端页面渲染用
//     } else {
//       alert('该处异常');
//       return Promise.reject('error')
//     }
//   },
//   error => {  // 当发生错误时，执行该部分代码
//     console.log(error); //调试用
//     return Promise.reject(error)
//   }
// )

Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
