<template>
  <div>
    <a-form-model ref="form" class="form" :model="form">
      <a-row :gutter="16">
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="论文题目" required>
            <a-input v-model="form.subject" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="论文级别" required>
            <a-select
              v-model="form.grade"
              allowClear
              :dropdownMatchSelectWidth="false"
              :options="levelOptions"
              placeholder="请选择"
            />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="所属专业">
            <a-input v-model="form.speciality" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="论文用途" required>
            <a-select
              v-model="form.use"
              allowClear
              :dropdownMatchSelectWidth="false"
              :options="useOpionts"
              placeholder="请选择"
            />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="论文语种" required>
            <a-select
              v-model="form.language"
              allowClear
              :dropdownMatchSelectWidth="false"
              :options="languageOptions"
              placeholder="请选择"
            />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="稿件字数">
            <a-input v-model="form.manuscript_word" allow-clear placeholder="请输入" />
            <div class="tip">提示:摘要+目录+正文+参考文献</div>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="论文重率">
            <a-input v-model="form.repeat" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="特殊要求" required>
            <a-checkbox-group v-model="form.special_ask" :options="requireOptions" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="文献个数">
            <a-input v-model="form.docu_number" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="QQ号码">
            <a-input v-model="form.qq" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="手机号码">
            <a-input v-model="form.phone" allow-clear />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="学校名称" required>
            <a-input v-model="form.school_name" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="导师姓名">
            <a-input v-model="form.tutor_name" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="交稿日期" required>
            <a-date-picker v-model="form.manuscript_time" value-format="YYYY-MM-DD" placeholder="请选择" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="旺旺/微信" required>
            <a-input v-model="form.contact_way" allow-clear placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6">
          <a-form-model-item label="格式范文" required>
            <a-radio-group v-model="form.model_essay" :options="egOptions" default-value="无" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="写作要求">
            <a-textarea v-model="form.writing_ask" :autoSize="{ minRows: 3, maxRows: 5 }" placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item>
            <a-button type="primary" class="btn" @click="submit">保存</a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <div v-if="visible" class="popup">
      <div class="tip">信息已提交</div>
    </div>
  </div>
</template>

<script>
import orderApi from "@/apis/order";
import { egMap, languageMap, levelMap, useMap, requireMap } from "./mapping";
import utils from "@/libs/utils";

export default {
  data() {
    return {
      visible: false,
      form: { model_essay: "-1" },
      levelOptions: utils.mapToArray(levelMap),
      requireOptions: utils.mapToArray(requireMap),
      useOpionts: utils.mapToArray(useMap),
      languageOptions: utils.mapToArray(languageMap),
      egOptions: utils.mapToArray(egMap),
    };
  },
  created() {
    const { id } = this.$route.params;
    orderApi.applyDetail(id).then((res) => {
      this.visible = !!res?.id;
    });
  },
  methods: {
    async submit() {
      const { id } = this.$route.params;
      const params = { order_id: id, ...this.form };
      params.special_ask = params.special_ask?.join(",");
      await orderApi.apply(params);
      this.visible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  padding: 16px;

  .tip {
    color: #999999;
  }

  .btn {
    margin-left: 100px;
  }
}

.popup {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .tip {
    background: #ffffff;
    padding: 16px;
    border-radius: 4px;
  }
}

/deep/ .ant-form-item {
  display: flex;

  &-label {
    flex: 0 0 100px;
    line-height: 39.9999px !important;
    text-align: right !important;

    > label::after {
      display: inline !important;
    }
  }

  &-control-wrapper {
    flex: 1;
  }
}
</style>
