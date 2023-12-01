<template>
  <a-modal
    :visible="visible"
    title="关联权限"
    destroyOnClose
    :confirmLoading="loading"
    width="1024px"
    @cancel="close"
    @ok="submit"
  >
    <div
      class="group-container"
      v-for="(group, index) in allPermission.items || []"
      :key="'group-' + index"
    >
      <div class="group-header">
        <a-checkbox
          :indeterminate="group.anyChecked"
          v-model="group.checked"
          :disabled="group.disabled"
          >{{ group.name }}</a-checkbox
        >
      </div>
      <div class="group-items">
        <a-checkbox
          v-for="(item, index) in group.items || []"
          v-model="item.checked"
          :disabled="item.disabled"
          :key="'item-' + index"
          :title="item.alias"
          class="item"
        >
          {{ item.alias }}
        </a-checkbox>
      </div>
    </div>
    <template slot="footer">
      <span style="margin-right: 16px"
        >已选 {{ allPermission.checkedCount }} 项</span
      >
      <a-button key="back" @click="close">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="submit"
        >确定</a-button
      >
    </template>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import RoleApi from "../../apis/role";
import PermissionApi from "../../apis/permission";
import { PermissionGroup } from "../../models/Permission";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      allPermission: {},
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.R.permissions.forEach((_) => {
          this.allPermission.changeState(_.name, true);
        });
      }
    },
  },
  created() {
    this.getAllPermission();
  },
  methods: {
    getAllPermission() {
      PermissionApi.all().then((res) => {
        this.allPermission = new PermissionGroup(res.list);
      });
    },
    beforeClose() {
      this.allPermission.each((_) => (_.checked = _.disabled = false));
    },
    submit() {
      this.loading = true;
      RoleApi.allot({
        id: this.R.id,
        permissions: this.allPermission.getChecked(
          null,
          (item) => item.data && item.data.name
        ),
      })
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

<style lang="less" scoped>
.group-container {
  .group-header {
    background-color: #f0f2f5;
    font-weight: bold;
    padding: 4px 8px;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .group-items {
    display: flex;
    flex-wrap: wrap;
    margin: 8px;

    .item {
      width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: sub;
      margin: 4px 8px 4px 0;
    }
  }
}
</style>