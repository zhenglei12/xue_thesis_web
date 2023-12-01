<template>
  <a-form-model layout="inline" :model="form">
    <a-form-model-item v-for="(item, index) in condition" :key="index" :label="item.label">
      <a-date-picker
        v-if="item.type === 'date'"
        v-model="form[item.key]"
        :placeholder="item.placeholder || item.label || '请选择日期'"
        :valueFormat="item.showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD'"
        @change="delaySubmit"
      />
      <a-select
        class="searchheader-select"
        v-else-if="item.type === 'select'"
        v-model="form[item.key]"
        :placeholder="item.placeholder || item.label || '请选择'"
        @change="delaySubmit"
        allowClear
        :showSearch="item.showSearch || false"
        optionFilterProp="children"
      >
        <a-select-option
          v-for="(o, i) in item.options"
          :key="'select-' + index + '-' + i"
          :value="o[item.valueKey || 'value']"
        >
          {{ o[item.labelKey || "label"] }}
        </a-select-option>
      </a-select>
      <a-range-picker
        v-else-if="item.type === 'date-in'"
        v-model="form[item.key]"
        :placeholder="[
          (item.placeholder && item.placeholder[0]) || item.label || '开始日期',
          (item.placeholder && item.placeholder[1]) || item.label || '结束日期',
        ]"
        :valueFormat="item.showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD'"
        @change="delaySubmit"
      />
      <a-cascader
        v-else-if="item.type === 'cascader'"
        v-model="form[item.key]"
        :options="item.options"
        :placeholder="item.placeholder || item.label || '请选择'"
        :change-on-select="item.changeOnSelect"
        :fieldNames="{
          label: item.labelKey || 'label',
          value: item.valueKey || 'value',
          children: item.childrenKey || 'children',
        }"
        @change="delaySubmit"
      />
      <a-input
        v-else
        v-model="form[item.key]"
        allowClear
        :placeholder="item.placeholder || item.label"
        @change="delaySubmit"
      />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="submit">搜索</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  model: {
    prop: "input",
    event: "change",
  },
  props: {
    input: Object,
    condition: {
      type: Array,
      required: true,
    },
    collection: Object,
  },
  data() {
    return {
      form: this.input || {},
    };
  },
  watch: {
    form: {
      deep: true,
      handler() {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(this.form, key)) {
            if (this.form[key] == null || this.form[key] == "") {
              delete this.form[key];
            }
            const element = this.condition.find((_) => _.key === key);
            if (!element) {
              return;
            }
          }
        }
      },
    },
  },
  methods: {
    delaySubmit() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.submit(), 500);
    },
    submit() {
      this.$emit("change", this.form);
      if (this.collection) {
        this.collection.refresh();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.searchheader {
  &-select {
    min-width: 150px;
  }
}
</style>
