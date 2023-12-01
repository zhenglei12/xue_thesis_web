<template>
  <div>
    <div class="cus-table-header">
      <list-search v-model="search" :condition="condition" :collection="collection"></list-search>
    </div>
    <div class="cus-table-header">
      <div class="statistic">
        <span v-if="statistic" v-acl="'order-statistics'">
          <span>总金额：{{ statistic.amount_count }}</span>
          <span>已回收金额：{{ statistic.received_amount_count }}</span>
          <span>本月总金额：{{ statistic.month_amount_count }}</span>
          <span>已回收金额：{{ statistic.month_received_amount_count }}</span>
        </span>
        <span v-if="numbers" v-acl="'order-count.num'">文字统计：{{ numbers }}</span>
      </div>
      <a-button-group>
        <a-button v-acl="'order-export'" @click="toExport()">导出</a-button>
        <a-button v-acl="'order-add'" type="primary" @click="toEdit()">新增</a-button>
      </a-button-group>
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
      :rowClassName="getRowClass"
      bordered
      rowKey="id"
      @change="listChange"
    >
      <template slot="type" slot-scope="data">
        {{ taskTypeMap[data] }}
      </template>
      <template slot="money" slot-scope="data">
        {{ data.amount - data.received_amount > 0 ? data.amount - data.received_amount : "已结清" }}
      </template>
      <template slot="image" slot-scope="data">
        <img v-if="data" :src="data" alt="图片" class="image" @click="toPreview(data)" />
      </template>
      <template slot="wk_image" slot-scope="data">
        <img v-if="data" :src="data" alt="图片" class="image" @click="toPreview(data)" />
      </template>
      <template slot="ask" slot-scope="data">
        <a v-if="data.detail_re" @click="toDownload(data, data.detail_re)">下载附件</a>
        <span v-else>无附件</span>
      </template>
      <template slot="status" slot-scope="data">
        {{ orderStatusMap[data] }}
      </template>
      <template slot="file" slot-scope="data">
        <a v-if="data.manuscript" @click="toDownload(data, data.manuscript)">下载稿件</a>
        <span v-else>未提交</span>
      </template>
      <template slot="operate" slot-scope="data">
        <div class="cus-nowrap">
          <span v-acl="'order-update'">
            <a-icon type="edit" title="编辑" @click="toEdit(data)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-edit.name'">
            <a-icon type="api" title="分配编辑" @click="toAllot(data.id)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-manuscript'">
            <a-icon type="upload" title="上传稿件" @click="toUpload(data.id)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-logs'">
            <a-icon type="file" title="日志" @click="toLog(data.id)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-delete'" class="cus-pointer">
            <a-popconfirm title="确认删除？" @confirm="toDelete(data.id)">
              <a-icon type="delete" title="删除" />
            </a-popconfirm>
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-status'">
            <a-icon type="swap" title="修改状态" @click="toStatus(data)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-after'">
            <a-icon type="rocket" title="售后" @click="toAfter(data)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-hard.grade'">
            <a-icon type="stock" title="难度" @click="toGrade(data)" />
          </span>
        </div>
      </template>
    </a-table>

    <!-- 编辑 -->
    <cus-edit v-model="editVisible" :data="temp" @refresh="_getList"></cus-edit>

    <!-- 分配编辑 -->
    <cus-allot v-model="allotVisible" :data="temp" @refresh="_getList"></cus-allot>

    <!-- 修改状态 -->
    <cus-status v-model="statusVisible" :data="temp" @refresh="_getList"></cus-status>

    <!-- 上传稿件 -->
    <cus-upload v-model="uploadVisible" :data="temp" :classifyList="classifyList" @refresh="_getList"></cus-upload>

    <!-- 详情 -->
    <!-- <cus-detail
      v-model="detailVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-detail> -->

    <!-- 图片预览 -->
    <img-preview v-model="previewVisible" :urls="previewUrl"></img-preview>

    <cus-log v-model="logVisible" :data="temp"></cus-log>

    <!-- 售后 -->
    <cus-after v-model="afterVisible" :data="temp" @refresh="_getList" />

    <!-- 难度 -->
    <cus-grade v-model="gradeVisible" :data="temp" @refresh="_getList" />
  </div>
</template>

<script>
const condition = [
  {
    key: "id",
    placeholder: "ID",
  },
  {
    key: "subject",
    placeholder: "题目",
  },
  {
    key: "word_number",
    placeholder: "字数",
  },
  // {
  //   key: "name",
  //   placeholder: "客户姓名",
  // },
  {
    key: "task_type",
    type: "select",
    options: Utils.mapToArray(taskTypeMap),
    placeholder: "任务类型",
  },
  {
    key: "staff_name",
    type: "select",
    placeholder: "客服名称",
    showSearch: true,
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "edit_name",
    type: "select",
    placeholder: "编辑名称",
    showSearch: true,
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "classify_id",
    type: "cascader",
    placeholder: "文档分类",
    changeOnSelect: true,
    options: [],
    labelKey: "name",
    valueKey: "id",
  },
  {
    key: "status",
    type: "select",
    options: Utils.mapToArray(orderStatusMap),
    placeholder: "状态",
  },
  {
    key: "finance_check",
    type: "select",
    options: Utils.mapToArray(financeCheckMap),
    placeholder: "财务审核状态",
  },
  {
    key: "receipt_account_type",
    type: "select",
    options: Utils.mapToArray(accountTypeMap),
    placeholder: "收款户",
  },
  {
    key: "_date",
    type: "date-in",
  },
  {
    key: "_time",
    type: "date-in",
    placeholder: ["开始截止时间", "结束截止时间"],
  },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "任务类型",
    dataIndex: "task_type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "题目",
    dataIndex: "subject",
  },
  {
    title: "字数",
    dataIndex: "word_number",
  },
  {
    title: "任务要求",
    dataIndex: "task_ask",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
  },
  {
    title: "截止时间",
    dataIndex: "submission_time",
  },
  {
    title: "订单总额",
    hidden: ["edit", "edit_admin"],
    dataIndex: "amount",
  },
  {
    title: "已收金额",
    hidden: ["edit", "edit_admin"],
    dataIndex: "received_all",
  },
  {
    title: "未收尾款",
    hidden: ["edit", "edit_admin"],
    scopedSlots: { customRender: "money" },
  },
  {
    title: "付款截图",
    hidden: ["edit", "edit_admin"],
    dataIndex: "pay_img",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "尾款截图",
    hidden: ["edit", "edit_admin"],
    dataIndex: "receipt_account",
    scopedSlots: { customRender: "wk_image" },
  },
  {
    title: "财务审核",
    hidden: ["edit", "edit_admin"],
    dataIndex: "finance_check",
    customRender: (data) => financeCheckMap[data] ?? "-",
  },
  {
    title: "售后金额",
    hidden: ["edit", "edit_admin"],
    dataIndex: "after_banlace",
  },
  {
    title: "详细要求",
    // dataIndex: "detail_re",
    scopedSlots: { customRender: "ask" },
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "创建客服",
    dataIndex: "staff_name",
  },
  {
    title: "责任编辑",
    dataIndex: "edit_name",
  },
  {
    title: "售后人员",
    dataIndex: "after_name",
  },
  {
    title: "难度等级",
    dataIndex: "hard_grade",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "稿件下载",
    // dataIndex: "manuscript",
    scopedSlots: { customRender: "file" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "operate" },
  },
];

import listMixin from "../../mixins/list";
import OrderApi from "../../apis/order";
import PublicApi from "../../apis/public";
import Utils from "../../libs/utils";
import CusEdit from "./Edit";
import CusStatus from "./Status";
import CusAllot from "./Allot";
import CusUpload from "./Upload";
import CusLog from "./Log";
import CusAfter from "./After";
import CusGrade from "./Grade";
import { taskTypeMap, orderStatusMap, financeCheckMap, accountTypeMap } from "./mapping";

export default {
  components: {
    CusEdit,
    CusAllot,
    CusStatus,
    CusUpload,
    CusLog,
    CusAfter,
    CusGrade,
  },
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      taskTypeMap,
      orderStatusMap,
      statistic: null,
      numbers: null,
      editVisible: false,
      statusVisible: false,
      allotVisible: false,
      previewVisible: false,
      uploadVisible: false,
      logVisible: false,
      afterVisible: false,
      gradeVisible: false,
      previewUrl: "",
      editorList: [],
      classifyList: [],
      download: false,
    };
  },
  created() {
    PublicApi.roleUserList("staff").then((res) => {
      let temp = this.condition.find((_) => _.key == "staff_name");
      if (temp) {
        temp.options = res.list;
      }
    });
    PublicApi.roleUserList("edit").then((res) => {
      let temp = this.condition.find((_) => _.key == "edit_name");
      this.editorList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
    PublicApi.documentClassify({
      page: 1,
      pageSize: 200,
    }).then((res) => {
      function fmtList(list, level = 1) {
        return list.map((_) => {
          _.level = level;
          if (_.children && _.children.length) {
            _.children = fmtList(_.children, level + 1);
          } else {
            _.isLeaf = true;
            delete _.children;
          }
          return _;
        });
      }
      let temp = this.condition.find((_) => _.key == "classify_id");
      this.classifyList = fmtList(res.list);
      if (temp) {
        temp.options = res.list;
      }
    });
    if (this.$auth.isService) {
      this.condition = this.condition.filter((_) => _.key != "staff_name");
    }
    if (this.$auth.isEditor) {
      this.condition = this.condition.filter((_) => _.key != "edit_name");
      this.columns = this.columns.filter((_) => {
        if (_.hidden) {
          return !~_.hidden.indexOf("edit");
        }
        return true;
      });
    }
    if (this.$auth.isEditAdmin) {
      this.columns = this.columns.filter((_) => {
        if (_.hidden) {
          return !~_.hidden.indexOf("edit_admin");
        }
        return true;
      });
    }
  },
  methods: {
    getStatistic() {
      OrderApi.statistic().then((res) => {
        this.statistic = res;
      });
      OrderApi.numbers().then((res) => {
        this.numbers = res.count_num;
      });
    },
    getRowClass(data) {
      switch (data.status) {
        case "1":
          return "bg-yellow";
        case "2":
          return "bg-pink";
        case "3":
          return "bg-blue";
        case "4":
          return "bg-green";
        case "5":
          return "bg-purple";
        case "6":
          return "bg-6";
        case "7":
          return "bg-7";
        default:
          break;
      }
    },
    toStatus(e) {
      this.temp = e;
      this.statusVisible = true;
    },
    toAllot(e) {
      this.temp = {
        id: e,
        editorList: this.editorList,
      };
      this.allotVisible = true;
    },
    toEdit(e) {
      this.temp = e;
      this.editVisible = true;
    },
    toPreview(e) {
      this.previewUrl = e;
      this.previewVisible = true;
    },
    toDownload(item, url) {
      if (this.download) {
        return this.$message.warn("正在下载...");
      }
      this.download = true;
      Utils.download(url, `${item.id}-${url.split("/").pop()}`)
        .then(() => {
          this.$message.success("下载完成");
        })
        .finally(() => (this.download = false));
    },
    toUpload(e) {
      this.temp = e;
      this.uploadVisible = true;
    },
    toDelete(e) {
      OrderApi.remove(e).then(() => {
        this.$message.success("操作成功");
        this._getList();
      });
    },
    toAfter(e) {
      this.temp = e;
      this.afterVisible = true;
    },
    toGrade(e) {
      this.temp = e;
      this.gradeVisible = true;
    },
    toLog(e) {
      this.temp = e;
      this.logVisible = true;
    },
    _getList() {
      this.getStatistic();
      this.collection.loading = true;
      const _search = JSON.parse(JSON.stringify(this.search));
      if (_search && _search._date) {
        _search.created_at = _search._date[0];
        _search.end_time = _search._date[1];
      }
      if (_search && _search._time) {
        _search.submission_time = _search._time[0];
        _search.submission_end_time = _search._time[1];
      }
      if (_search && _search.classify_id) {
        _search.classify_id = _search.classify_id.push();
      }
      OrderApi.list(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
            staff_name: this.$auth.isService ? this.$auth.user().name : undefined,
            edit_name: this.$auth.isEditor ? this.$auth.user().name : undefined,
          },
          _search
        )
      ).then((res) => {
        this.collection.list = res.list;
        this.collection.total = res.total;
        this.collection.loading = false;
      });
    },
    toExport() {
      const _search = JSON.parse(JSON.stringify(this.search));
      if (_search && _search._date) {
        _search.created_at = _search._date[0];
        _search.end_time = _search._date[1];
      }
      if (_search && _search._time) {
        _search.submission_time = _search._date[0];
        _search.submission_end_time = _search._date[1];
      }
      if (_search && _search.classify_id) {
        _search.classify_id = _search.classify_id.push();
      }
      OrderApi.export(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
            staff_name: this.$auth.isService ? this.$auth.user().name : undefined,
            edit_name: this.$auth.isEditor ? this.$auth.user().name : undefined,
          },
          _search
        )
      ).then((res) => {
        if (res.type === "application/json") {
          try {
            const render = new FileReader();
            render.readAsText(res);
            render.onload = (e) => {
              const json = JSON.parse(e.target.result);
              this.$notification.error({
                message: "业务错误",
                description: json.message,
              });
            };
          } catch {
            // eslint-disable-next-line
          }
          return;
        }
        Utils.export(res, "订单列表").then(() => {
          this.$message.success("下载完成");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.statistic {
  font-size: 20px;
  color: red;

  span {
    margin-left: 20px;

    &:first-of-type {
      margin: 0;
    }
  }
}

.image {
  max-width: 90px;
  max-height: 90px;
  cursor: pointer;
}

/deep/ .bg {
  &-pink {
    background-color: #fbe5e2;
  }

  &-green {
    background-color: #75f98d;
  }

  &-yellow {
    background-color: #fbfd87;
  }

  &-blue {
    background-color: #a3ccfa;
  }

  &-purple {
    background-color: #c08dc0;
  }

  &-6 {
    background-color: #afdfe4;
  }

  &-7 {
    background-color: #fab27b;
  }
}

/deep/ tr:hover > td {
  background-color: inherit !important;
}
</style>
