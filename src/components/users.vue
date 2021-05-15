<!--  -->
<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-top: 15px">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入查询姓名"
              clearable
              v-model="query"
              @clear="getData"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getData"
              ></el-button>
            </el-input>
          </el-col>

          <el-col :span="8">
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </el-col>
        </el-row>

        <el-table
          border
          stripe=""
          :data="tableData"
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="swichChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >

              <el-button
                size="mini"
                type="primary"
                @click="handleDelete(scope.row)"
                >设置</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>

    <!-- 添加用户面板 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addBox"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="mima">
          <el-input v-model="ruleForm.mima"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addBox = false">取 消</el-button>
        <el-button type="primary" @click="trueAddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户面板 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="updataDialogVisible"
      width="50%"
    >
      <el-form
        ref="updataForm"
        :model="updataForm"
        label-width="80px"
        :rules="updataRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="updataForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updataForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="updataForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="trueUpdataData">确 定</el-button>
      </span>
    </el-dialog>
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
    let checkEmail = (rule, val, cb) => {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!reg.test(val)) {
        cb(new Error("邮箱校验不通过"));
      } else {
        cb();
      }
    };
    let checkPhone = (rule, val, cb) => {
      var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
      if (!reg.test(val)) {
        cb(new Error("手机校验不通过"));
      } else {
        cb();
      }
    };
    return {
      updataForm: {
        id: "",
        username: "",
        email: "",
        phone: "",
      }, //修改弹出框的数据
      tableData: [],
      pagenum: 1, //请求页码，默认请求第一页
      pagesize: 5, //每页显示的数据量
      total: 0,
      query: "", //搜素关键字
      addBox: false, //添加面板的显示与影藏
      updataDialogVisible: false, //编辑弹出框的显示与影藏
      ruleForm: {
        username: "",
        mima: "",
        email: "",
        phone: "",
      }, //添加用户的数据
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        mima: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      updataRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
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
    async handleDelete(data) {
      let { data: res } = await this.$axios.delete(`/users/${data.id}`);
      if (res.meta.status !== 200) {
        this.$message.error(`删除失败:${res.meta.msg}`);
        return;
      }
      //重新获取渲染数据
      this.getData();
    },
    trueUpdataData() {
      this.$refs.updataForm.validate(async (vali) => {
        if (!vali) {
          return;
        }
        let { data: res } = await this.$axios.put(
          `/users/${this.updataForm.id}`,
          {
            email: this.updataForm.email,
            mobile: this.updataForm.phone,
          }
        );
        if (res.meta.status !== 200) {
          return;
        }
        this.updataDialogVisible = false;
        //重新获取渲染数据
        this.getData();
      });
    },
    async handleEdit(data) {
      this.updataDialogVisible = true;
      let { data: res } = await this.$axios.get(`/users/${data.id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return;
      }
      this.updataForm.username = res.data.username;
      this.updataForm.email = res.data.email;
      this.updataForm.phone = res.data.mobile;
      this.updataForm.id = res.data.id;
    },
    trueAddUser() {
      this.$refs.ruleForm.validate(async (val) => {
        if (!val) {
          return;
        } else {
          let obj = {
            username: this.ruleForm.username,
            password: this.ruleForm.mima,
            email: this.ruleForm.email,
            mobile: this.ruleForm.phone,
          };
          let { data: res } = await this.$axios.post("/users", obj);
          console.log(res);
          if (res.meta.status == 201) {
            this.$message.success("添加用户成功");
          } else {
            this.$message.error(res.meta.msg);
          }
          this.addBox = false;
        }
      });
    },
    async swichChange(val) {
      let { data: res } = await this.$axios.put(
        `/users/${val.id}/state/${val.mg_state}`
      );
      if (res.meta.status !== 200) {
        //如果修改失败的话，页面里面的开关状态已经修改，需要取反
        val.mg_state = !val.mg_state;
        this.$message.error("状态修改失败");
      } else {
        this.$message.success("状态修改成功");
      }
    },
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getData();
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getData();
    },
    async getData() {
      let { data: res } = await this.$axios.get(
        `/users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      if (res.meta.status === 200) {
        this.$message.success("获取数据成功");
        this.tableData = res.data.users;
        this.total = res.data.total;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    addUser() {
      this.addBox = true;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
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
</style>