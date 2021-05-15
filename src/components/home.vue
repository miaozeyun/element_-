<!--  -->
<template>
  <div class="homeBox">
    <el-container>
      <el-header>
        <div class="left">
          <img src="../assets/img/logo.png" alt="" />
          <span>后台电商管理系统</span>
        </div>
        <div class="right">
          <el-button type="primary" @click="logOut">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isOpen ? '60px' : '200px'">
          <!-- 打开收起 -->
          <div class="menuBox" @click="boxOpen">| | |</div>
          <!-- 菜单模块 -->
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#203d74"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isOpen"
            :collapse-transition="false"
            :unique-opened="true"
            :default-active="menuActive"
          >
            <el-submenu
              :index="item.id + ''"
              v-for="(item, i) in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconClass[i]"></i>
                <span slot="title">{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="subItem.path + ''"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="toComponent(subItem.path)"
                >{{ subItem.authName }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 右边主要部分插槽 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      isOpen: false,
      menuList: [],
      iconClass: [
        "el-icon-location",
        "el-icon-menu",
        "el-icon-document",
        "el-icon-setting",
        "el-icon-s-goods",
      ],
      menuActive:''
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    toComponent(path) {
      this.$router.push("/" + path);
      //点击的时候讲激活的菜单的value值保存到本地
      this.menuActive = path;
      window.sessionStorage.setItem('menuActive',path)
    },
    logOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      console.log(1, key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(2, key, keyPath);
    },
    boxOpen() {
      this.isOpen = !this.isOpen;
    },
    async getmenu() {
      let { data: res } = await this.$axios.get("/menus");
      if (res.meta.status === 200) {
        this.menuList = res.data;
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getmenu();

    //刚进入页面的时候获取默认激活的菜单值
    this.menuActive = window.sessionStorage.getItem('menuActive');
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.homeBox {
  width: 100%;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
  .el-header {
    background: rgb(22, 84, 121);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 18px;
      span {
        margin-left: 15px;
      }
      img {
        height: 32px;
        height: 32px;
      }
    }
  }
  .el-aside {
    background: #203d74;
    .menuBox {
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #fff;
      letter-spacing: 1px;
      cursor: pointer;
      background: rgb(8, 70, 88);
    }
  }
}
</style>