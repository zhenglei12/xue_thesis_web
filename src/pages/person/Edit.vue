<template>
  <a-modal :visible="visible" :title="title" destroyOnClose :confirmLoading="loading" @cancel="close" @ok="submit">
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="用户名" required prop="username">
        <a-input v-model="form.username" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="密码" :required="!isEdit" prop="password">
        <a-input v-model="form.password" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="邮箱" required prop="email">
        <a-input v-model="form.email" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="部门" required>
        <a-cascader
          v-model="department_id"
          :options="allDepartment"
          :fieldNames="{
            label: 'name',
            value: 'id',
            children: 'children',
          }"
          changeOnSelect
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import UserApi from "../../apis/user";
import PublicApi from "../../apis/public";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      allDepartment: [],
      form: {},
      department_id: [],
    };
  },
  created() {
    this.getAllDepartment();
  },
  watch: {
    visible(e) {
      if (e) {
        const find = (list, id, path = []) => {
          const temp = list.find((_) => {
            path.push(_.id);
            if (_.id == id) {
              return true;
            } else if (_.children?.length) {
              return find(_.children, id, path);
            }
            path.pop();
          });
          if (temp) {
            return path;
          }
          path.pop();
        };
        this.department_id = find(this.allDepartment, this.R.department_id);
        this.form = {
          id: this.R.id,
          username: this.R.name,
          email: this.R.email,
          department_id: this.R.department_id,
        };
      }
    },
  },
  computed: {
    title() {
      return this.isEdit ? "编辑用户" : "新增用户";
    },
  },
  methods: {
    getAllDepartment() {
      PublicApi.departmentAll().then((res) => {
        console.log("部门列表", res);
        this.allDepartment = res.list;
      });
    },
    submit() {
      this.loading = true;
      this.form.department_id = [...this.department_id].pop();
      if (this.isEdit) {
        return UserApi.update({ ...this.form })
          .then((res) => {
            this.$message.success("保存成功");
            this.$emit("refresh", res);
            this.close();
          })
          .finally(() => (this.loading = false));
      } else {
        return UserApi.create({ ...this.form })
          .then((res) => {
            this.$message.success("保存成功");
            this.$emit("refresh", res);
            this.close();
          })
          .finally(() => (this.loading = false));
      }
    },
  },
};
</script>
