<template>
  <div>
    <div class="cus-table-header">
      <list-search
        v-model="search"
        :condition="condition"
        :collection="collection"
      ></list-search>
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
    </a-table>
  </div>
</template>

<script>
const condition = [
  {
    key: "name",
    type: "select",
    placeholder: "编辑名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "created_at",
    type: "date",
    placeholder: "统计时间",
  },
];

const columns = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "编辑名称",
    dataIndex: "edit_name",
  },
  {
    title: "完成日统计",
    children: [
      {
        title: "提交数量",
        dataIndex: "commit",
      },
      {
        title: "提交字数",
        dataIndex: "commit_word_number",
      },
      {
        title: "修改数量",
        dataIndex: "alter_number",
      },
      {
        title: "修改字数",
        dataIndex: "alter_word_number",
      },
    ],
  },
  {
    title: "分派日统计",
    children: [
      {
        title: "数量",
        dataIndex: "num",
      },
      {
        title: "金额",
        dataIndex: "amount",
      },
      {
        title: "字数",
        dataIndex: "word_number",
      },
    ],
  },
];

import listMixin from "@/mixins/list";
import StatisticApi from "@/apis/statistic";
import PublicApi from "@/apis/public";

export default {
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
    };
  },
  created() {
    PublicApi.roleUserList("edit").then((res) => {
      let temp = this.condition.find((_) => _.key == "name");
      this.editorList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
  },
  methods: {
    _getList() {
      this.collection.loading = true;
      StatisticApi.day(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          this.search
        )
      ).then((res) => {
        res.list.forEach(
          (_, i) =>
            (_.id =
              (this.collection.page - 1) * this.collection.pageSize + i + 1)
        );
        this.collection.list = res.list;
        this.collection.total = res.total;
        this.collection.loading = false;
      });
    },
  },
};
</script>
