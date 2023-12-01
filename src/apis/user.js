import http from "../libs/http";

export default {
    create: (data) => http.post('api/user/add', data),
    update: (data) => http.post('api/user/update', data),
    remove: (id) => http.post('api/user/delete', {
        id
    }),
    detail: (id) => http.get('api/user/detail', {
        id
    }),
    list: (data) => http.post('api/user/list', data),
    roles: (id) => http.post('api/user/role/list', {
        id
    }),
    allot: (data) => http.post('api/user/add/role', data),
}