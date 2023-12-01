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
    key: "_date",
    type: "date-in",
  },
  {
    key: "submission_time",
    type: "date",
    placeholder: "截止日期",
  },
];

const columns = [
  {
    title: "",
    dataIndex: "id",
  },
  {
    title: "编辑名称",
    dataIndex: "edit_name",
  },
  {
    title: "待提交数量",
    dataIndex: "all_waiting_commit",
  },
  {
    title: "已提交数量",
    dataIndex: "all_commit",
  },
  {
    title: "待修改数量",
    dataIndex: "all_waiting_alter",
  },
  {
    title: "已完成数量",
    dataIndex: "all_finish",
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
      let _search = JSON.parse(JSON.stringify(this.search));
      if (_search && _search._date) {
        _search.created_at = _search._date[0];
        _search.end_time = _search._date[1];
        delete _search._date;
      }
      StatisticApi.all(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          _search
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
