// 订单状态
export const orderStatusMap = {
  "-1": "待分配",
  1: "跟进中",
  2: "跟踪日志",
  3: "订单完成",
  // 4: "提交客户",
  // 5: "已交稿",
  6: "售后中",
  // 7: "售后完成",
};

export const nameType = {
  1: "维权",
  2: "债务",
  3: "婚姻",
  4: "全委托",
  5: "其他",
};

// 任务类型
export const taskTypeMap = {
  1: "论文写作",
  2: "期刊发表",
  3: "PPT",
  4: "翻译",
  6: "论文辅导",
  5: "其他",
};

// 支付方式
export const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "银行转账",
  4: "对公账户",
  5: "线上支付",
};

// 收款户
export const accountTypeMap = {
  1: "维权",
  2: "债务",
  3: "婚姻",
  4: "全委托",
  5: "其他",
};

// 财务审核
export const financeCheckMap = {
  "-1": "没有",
  0: "初审",
  2: "中审",
  1: "终审",
};
