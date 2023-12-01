<template>
  <a-modal
    :visible="visible"
    title="分配编辑"
    destroyOnClose
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="编辑人员">
        <a-select v-model="form.edit_name" allowClear :dropdownMatchSelectWidth="false" :options="editorOptions" />
      </a-form-model-item>
      <a-form-model-item label="售后人员">
        <a-select v-model="form.after_name" allowClear :dropdownMatchSelectWidth="false" :options="afterOptions" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import PublicApi from "../../apis/public";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      form: {},
      editorOptions: [],
      afterOptions: [],
    };
  },
  created() {
    PublicApi.roleUserList("edit").then((res) => {
      console.log("编辑人员", res);
      this.editorOptions = res.list?.map((_) => ({
        label: _.name,
        value: _.name,
      }));
    });
    PublicApi.roleUserList("after").then((res) => {
      console.log("售后人员", res);
      this.afterOptions = res.list?.map((_) => ({
        label: _.name,
        value: _.name,
      }));
    });
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
        };
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      OrderApi.allot({ ...this.form })
        .then((res) => {
          this.$message.success("保存成功");
          this.$emit("refresh", res);
          this.close();
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
