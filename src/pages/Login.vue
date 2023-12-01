<template>
  <div class="wraper">
    <div class="login-card" @keydown.enter="login">
      <a-form-model ref="form" class="login-form" :model="form" :rules="rules">
        <a-form-model-item prop="username">
          <a-input v-model="form.username" placeholder="用户名" allow-clear>
            <a-icon slot="prefix" type="user" class="login-form-icon" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input
            type="password"
            v-model="form.password"
            placeholder="密码"
            allow-clear
          >
            <a-icon slot="prefix" type="lock" class="login-form-icon" />
          </a-input>
        </a-form-model-item>
        <a-button
          class="login-submit"
          size="large"
          type="primary"
          block
          :loading="loading"
          @click="login"
          >登录</a-button
        >
      </a-form-model>
    </div>
  </div>
</template>

<script>
const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空！",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空！",
      trigger: "blur",
    },
  ],
};

export default {
  data() {
    return {
      rules,
      loading: false,
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$refs.form
        .validate()
        .then(() => {
          return this.$auth.login({ ...this.form }).then(() => {
            this.$message.success("登录成功");
            this.$router.push("/");
          });
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="less" scoped>
.wraper {
  height: 100%;
  // background-image: url("~@/assets/login.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.login {
  &-card {
    position: absolute;
    width: 350px;
    box-sizing: content-box;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    padding: 40px 20px;
    border-radius: 4px;
  }

  &-form {
    width: 100%;

    &-icon {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  &-submit {
    margin-top: 10px;
  }
}
</style>
