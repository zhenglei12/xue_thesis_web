<template>
  <a-modal
    :visible="visible"
    :title="title"
    destroyOnClose
    :confirmLoading="loading"
    width="800px"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
      <a-row>
        <a-col span="12">
          <a-form-model-item label="客户名称" required>
            <a-input v-model="form.name" allow-clear />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="合同比例" required>
            <a-input-number v-model="form.phone" :min="0" :precision="0" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-model-item label="客户类型">
            <a-select v-model="form.name_type" allowClear :dropdownMatchSelectWidth="false">
              <a-select-option v-for="(option, index) in accountList" :key="index" :value="option.value | string">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="客户等级">
            <a-select v-model="form.wr_where" allowClear :dropdownMatchSelectWidth="false" :disabled="$auth.isService">
              <a-select-option v-for="(option, index) in options" :key="index" :value="option">
                {{ option }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-model-item label="标的金额">
            <a-input-number v-model="form.amount" :min="0" />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="订金金额">
            <a-input-number v-model="form.received_amount" :min="0" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-model-item label="回款金额">
            <a-input-number v-model="form.twice_received_amount" :min="0" />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="尾款金额">
            <a-input-number v-model="form.end_received_amount" :min="0" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-model-item label="订金截图">
            <a-upload
              list-type="picture-card"
              :file-list="imgList_1"
              :customRequest="(e) => cusImgUpload('imgList_1', e)"
              :remove="
                () => {
                  imgList_1 = [];
                }
              "
              @preview="toPreview"
            >
              <div v-if="!imgList_1.length">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="增收截图">
            <a-upload
              list-type="picture-card"
              :file-list="imgList_2"
              :customRequest="(e) => cusImgUpload('imgList_2', e)"
              :remove="
                () => {
                  imgList_2 = [];
                }
              "
              @preview="toPreview"
            >
              <div v-if="!imgList_2.length">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-model-item label="尾款截图">
            <a-upload
              list-type="picture-card"
              :file-list="imgList_3"
              :customRequest="(e) => cusImgUpload('imgList_3', e)"
              :remove="
                () => {
                  imgList_3 = [];
                }
              "
              @preview="toPreview"
            >
              <div v-if="!imgList_3.length">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" label="备注">
        <a-textarea v-model="form.remark" :autoSize="{ minRows: 3, maxRows: 5 }" placeholder="备注" />
      </a-form-model-item>
    </a-form-model>

    <!-- 图片预览 -->
    <img-preview v-model="previewVisible" :urls="previewUrl"></img-preview>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import utils from "../../libs/utils";
import { taskTypeMap, payTypeMap, accountTypeMap } from "./mapping";
import upload from "../../libs/upload";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      typeList: utils.mapToArray(taskTypeMap),
      payList: utils.mapToArray(payTypeMap),
      accountList: utils.mapToArray(accountTypeMap),
      imgList_1: [],
      imgList_2: [],
      imgList_3: [],
      askList: [],
      form: {},
      options: ["A", "B", "C", "D", "E", "F"],
      previewVisible: false,
      previewUrl: "",
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
          subject: this.R.subject,
          word_number: this.R.word_number,
          task_type: this.R.task_type && this.R.task_type.toString(),
          task_ask: this.R.task_ask,
          submission_time: this.R.submission_time,
          name: this.R.name,
          wr_where: this.R.wr_where,
          phone: this.R.phone,
          want_name: this.R.want_name,
          amount: this.R.amount,
          received_amount: this.R.received_amount,
          twice_received_amount: this.R.twice_received_amount,
          end_received_amount: this.R.end_received_amount,
          pay_type: this.R.pay_type,
          remark: this.R.remark,
          receipt_time: this.R.receipt_time,
          twice_time: this.R.twice_time,
          end_time: this.R.end_time,
          name_type: this.R.name_type && this.R.name_type.toString(),
          receipt_account_type: this.R.receipt_account_type && this.R.receipt_account_type.toString(),
        };
        this.askList = this.R.detail_re
          ? [
              {
                uid: utils.uuid(),
                status: "done",
                name: this.R.detail_re.split("/").pop(),
                url: this.R.detail_re,
              },
            ]
          : [];
        this.imgList_1 = this.R.pay_img
          ? [
              {
                uid: utils.uuid(),
                status: "done",
                name: this.R.pay_img.split("/").pop(),
                url: this.R.pay_img,
              },
            ]
          : [];
        this.imgList_2 = this.R.twice_img
          ? [
              {
                uid: utils.uuid(),
                status: "done",
                name: this.R.twice_img.split("/").pop(),
                url: this.R.twice_img,
              },
            ]
          : [];
        this.imgList_3 = this.R.receipt_account
          ? [
              {
                uid: utils.uuid(),
                status: "done",
                name: this.R.receipt_account.split("/").pop(),
                url: this.R.receipt_account,
              },
            ]
          : [];
      }
    },
  },
  computed: {
    title() {
      return this.isEdit ? "编辑订单" : "新增订单";
    },
  },
  methods: {
    async cusImgUpload(fileList, { file }) {
      file.url = await utils.getBase64(file);
      this[fileList] = [file];
    },
    toPreview(e) {
      this.previewUrl = e.url;
      this.previewVisible = true;
    },
    submit() {
      this.loading = true;
      Promise.all([
        upload.uploadList(this.askList, ["lywang"]),
        upload.uploadList(this.imgList_1, ["lywang"]),
        upload.uploadList(this.imgList_2, ["lywang"]),
        upload.uploadList(this.imgList_3, ["lywang"]),
      ])
        .then(() => {
          this.form.detail_re = upload.getRources(this.askList)[0];
          this.form.pay_img = upload.getRources(this.imgList_1)[0];
          this.form.twice_img = upload.getRources(this.imgList_2)[0];
          this.form.receipt_account = upload.getRources(this.imgList_3)[0];
          if (this.isEdit) {
            return OrderApi.update({ ...this.form }).then((res) => {
              this.$message.success("保存成功");
              this.$emit("refresh", res);
              this.close();
            });
          } else {
            return OrderApi.create({ ...this.form }).then((res) => {
              this.$message.success("保存成功");
              this.$emit("refresh", res);
              this.close();
            });
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list-text {
  width: 200px;
}
</style>
