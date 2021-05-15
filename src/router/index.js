import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/users.vue'
import welcome from '../components/welcome.vue'
import roles from '../components/roles.vue'

Vue.use(Router)


// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: login
    },
    , {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        {
          path: '/users',
          component: users
        }, {
          path: '/welcome',
          component: welcome
        }, {
          path: '/roles',
          component: roles
        }
      ]
    },
  ]
})

//全局路由守卫，检查用户是否登录，未登录则跳转到登录页面
router.beforeEach((to, form, next) => {
  if (to.fullPath == '/login') {
    next();
  } else {
    if (window.sessionStorage.getItem('token')) {
      next();
    } else {
      next('/login')
    }
  }
})



export default router
