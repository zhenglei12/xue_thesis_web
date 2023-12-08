<template>
  <a-drawer :visible="visible" title="约稿单" width="800px" @close="close">
    <a-descriptions v-if="R.id" :column="2">
      <a-descriptions-item label="论文题目">{{ R.subject }}</a-descriptions-item>
      <a-descriptions-item label="论文级别">{{ R._grade }}</a-descriptions-item>
      <a-descriptions-item label="所属专业">{{ R.speciality }}</a-descriptions-item>
      <a-descriptions-item label="论文用途">{{ R._use }}</a-descriptions-item>
      <a-descriptions-item label="论文语种">{{ R._language }}</a-descriptions-item>
      <a-descriptions-item label="稿件字数">{{ R.manuscript_word }}</a-descriptions-item>
      <a-descriptions-item label="论文重率">{{ R.repeat }}</a-descriptions-item>
      <a-descriptions-item label="特殊要求">{{ R._special_ask }}</a-descriptions-item>
      <a-descriptions-item label="文献个数">{{ R.docu_number }}</a-descriptions-item>
      <a-descriptions-item label="QQ号码">{{ R.qq }}</a-descriptions-item>
      <a-descriptions-item label="手机号码">{{ R.phone }}</a-descriptions-item>
      <a-descriptions-item label="学校名称">{{ R.school_name }}</a-descriptions-item>
      <a-descriptions-item label="导师姓名">{{ R.tutor_name }}</a-descriptions-item>
      <a-descriptions-item label="交稿日期">{{ R.manuscript_time }}</a-descriptions-item>
      <a-descriptions-item label="旺旺/微信">{{ R.contact_way }}</a-descriptions-item>
      <a-descriptions-item label="格式范文">{{ R._model_essay }}</a-descriptions-item>
      <a-descriptions-item label="写作要求">{{ R.writing_ask }}</a-descriptions-item>
    </a-descriptions>
    <template v-else>
      <span>{{ url }}</span>
      <a-button type="link" @click="toCopy">复制链接</a-button>
    </template>
  </a-drawer>
</template>

<script>
import detailMinxin from "../../mixins/detail";
import orderApi from "@/apis/order";
import utils from "@/libs/utils";
import { egMap, languageMap, levelMap, useMap, requireMap } from "./mapping";

export default {
  mixins: [detailMinxin],
  computed: {
    url() {
      return `${location.origin}/apply/${this.data}`;
    },
  },
  methods: {
    _getDetail(id) {
      return orderApi.applyDetail(id).then((res) => {
        res._grade = levelMap[res.grade] ?? "-";
        res._use = useMap[res.use] ?? "-";
        res._language = languageMap[res.language] ?? "-";
        res._model_essay = egMap[res.model_essay] ?? "-";
        res._special_ask = res.special_ask
          ?.split(",")
          .map((_) => requireMap[_] ?? "-")
          .join(",");
        return res;
      });
    },
    async toCopy() {
      await utils.copy(this.url);
      this.$message.success("复制成功");
    },
  },
};
</script>
