<!--  -->
<template>
  <div class="maxbox">
    <div class="loginBox">
      <div class="imgbox">
        <img src="../assets/img/logo.png" alt="" srcset="" />
      </div>
      <el-form
        ref="formref"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    reset() {
      this.$refs.formref.resetFields();
    },
    onSubmit() {
      let that = this;
      this.$refs.formref.validate(async (bool) => {
        if (!bool) {
          return;
        }
        //前端校验通过的话，去走接口
        let { data: res } = await that.$axios.post("/login", this.form);
        if (res.meta.status === 200) {
          this.$message.success("登录成功");
          //保存token到sessionStroge
          window.sessionStorage.setItem("token", res.data.token);
          //跳转组件
          that.$router.push("/home");
        } else {
          this.$message.error(`登录失败:${res.meta.msg}`);
        }
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
.maxbox {
  width: 100%;
  height: 100%;
  background: rgb(64, 139, 168);
}
.loginBox {
  width: 500px;
  height: 320px;
  background: #fff;
  border: 1px solid #eee;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;

  .imgbox {
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #eee;
    }
  }
  .form {
    padding: 20px;
    margin-top: 20%;
  }
}
</style>