import http from "../libs/http";

export default {
  list: (data) => http.post("api/order/list", data),
  statistic: () =>
    http.post("api/order/statistics", null, {
      acl: "order-statistics",
    }),
  numbers: () =>
    http.post("api/order/count_num", null, {
      acl: "order-count.num",
    }),
  create: (data) => http.post("api/order/add", data),
  update: (data) => http.post("api/order/update", data),
  allot: (data) => http.post("api/order/edit_name", data),
  status: (data) => http.post("api/order/status", data),
  upload: (data) => http.post("api/order/manuscript", data),
  remove: (id) =>
    http.post("api/order/delete", {
      id,
    }),
  logs: (data) => http.post("api/order/logs", data),
  export: (data) =>
    http.post("api/order/export", data, {
      format: false,
      responseType: "blob",
    }),
  after: (data) => http.post("api/order/after", data),
  grade: (data) => http.post("api/order/hard_grade", data),
};
