<template>
  <a-modal
    :visible="visible"
    title="售后"
    destroyOnClose
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model
      ref="form"
      :model="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-model-item label="售后金额" required>
        <a-input-number
          v-model="form.after_banlace"
          :min="0"
          style="width: 200px"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      form: {},
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
          after_banlace: this.R.after_banlace,
        };
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      OrderApi.after({ ...this.form })
        .then((res) => {
          this.$message.success("操作成功");
          this.$emit("refresh", res);
          this.close();
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
