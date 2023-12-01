<template>
  <div>
    <div class="cus-table-header">
      <list-search
        v-model="search"
        :condition="condition"
        :collection="collection"
      ></list-search>
      <a-button v-acl="'user-add'" type="primary" @click="toEdit()"
        >新增用户</a-button
      >
    </div>
    <a-table
      :columns="columns"
      :data-source="collection.list"
      :loading="collection.loading"
      :pagination="{
        total: collection.total,
        current: collection.page,
        pageSize: collection.pageSize,
        showSizeChanger: true,
      }"
      bordered
      rowKey="id"
      @change="listChange"
    >
      <template slot="operate" slot-scope="data">
        <span v-acl="'user-update'">
          <a-icon type="edit" title="编辑" @click="toEdit(data)" />
          <a-divider type="vertical"></a-divider>
        </span>
        <!-- <template v-acl="'user-detail'">
          <a-icon type="eye" title="详情" @click="toDetail(data)" />
          <a-divider type="vertical"></a-divider>
        </template> -->
        <span v-acl="'user-add.role'">
          <a-icon type="api" title="分配角色" @click="toManager(data.id)" />
          <a-divider type="vertical"></a-divider>
        </span>
        <span v-acl="'user-delete'">
          <a-popconfirm title="确认删除？" @confirm="toDelete(data.id)">
            <a-icon type="delete" title="删除" />
          </a-popconfirm>
        </span>
      </template>
    </a-table>

    <!-- 编辑 -->
    <cus-edit v-model="editVisible" :data="temp" @refresh="_getList"></cus-edit>

    <!-- 分配角色 -->
    <cus-role v-model="roleVisible" :data="temp" @refresh="_getList"></cus-role>

    <!-- 详情 -->
    <!-- <cus-detail
      v-model="detailVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-detail> -->
  </div>
</template>

<script>
const condition = [
  {
    key: "username",
    placeholder: "用户名",
  },
];

const columns = [
  {
    title: "用户名",
    dataIndex: "name",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "operate" },
  },
];

import listMixin from "../../mixins/list";
import CusEdit from "./Edit";
// import CusDetail from "./Detail";
import CusRole from "./Role";
import UserApi from "../../apis/user";

export default {
  components: {
    CusEdit,
    // CusDetail,
    CusRole,
  },
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      editVisible: false,
      // detailVisible: false,
      roleVisible: false,
    };
  },
  methods: {
    // toDetail(e) {
    //   this.temp = e;
    //   this.detailVisible = true;
    // },
    toEdit(e) {
      this.temp = e;
      this.editVisible = true;
    },
    toDelete(e) {
      UserApi.remove(e).then(() => {
        this.$message.success("操作成功");
        this._getList();
      });
    },
    toManager(e) {
      UserApi.roles(e).then((res) => {
        this.temp = {
          id: e,
          roles: res.list.map((_) => _.name),
        };
        this.roleVisible = true;
      });
    },
    _getList() {
      this.collection.loading = true;
      UserApi.list(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          this.search
        )
      ).then((res) => {
        this.collection.list = res.list;
        this.collection.total = res.total;
        this.collection.loading = false;
      });
    },
  },
};
</script>