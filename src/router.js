import Vue from "vue";
import Router from "vue-router";

import Auth from "./libs/auth";
import Acl from "./libs/acl";

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    component: () => import("./pages/Layout"),
    children: [
      {
        path: "",
        redirect: "home",
      },
      {
        path: "home",
        name: "home",
        component: () => import("./pages/Home"),
      },
      {
        path: "person",
        name: "person",
        component: () => import("./pages/person/List"),
        meta: {
          group: "user",
          acl: "user-list",
        },
      },
      {
        path: "role",
        name: "role",
        component: () => import("./pages/role/List"),
        meta: {
          group: "user",
          acl: "role-list",
        },
      },
      {
        path: "user/department",
        name: "user-department",
        component: () => import("./pages/department/List"),
        meta: {
          group: "user",
          acl: "department-list",
        },
      },
      {
        path: "order",
        name: "task-order",
        component: () => import("./pages/order/List"),
      },
      {
        path: "classify",
        name: "classify",
        component: () => import("./pages/classify/List"),
      },
      {
        path: "statistic/all",
        name: "statistic-all",
        component: () => import("./pages/statistic/All"),
      },
      {
        path: "statistic/day",
        name: "statistic-day",
        component: () => import("./pages/statistic/Day"),
      },
      {
        path: "statistic/user",
        name: "statistic-user",
        component: () => import("./pages/statistic/User"),
      },
      {
        path: "editorder",
        name: "statistic-order",
        component: () => import("./pages/statistic/Order"),
      },
      {
        path: "manuscript",
        name: "manuscript",
        component: () => import("./pages/manuscript/List.vue"),
      },
      {
        path: "test",
        name: "test",
        component: () => import("./pages/Test"),
      },
      {
        path: "/403",
        name: "403",
        component: () => import("./pages/exception/403"),
      },
      {
        path: "/404",
        name: "404",
        component: () => import("./pages/exception/404"),
      },
      {
        path: "*",
        redirect: "/404",
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/Login"),
  },
];

const router = new Router({
  mode: "history",
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  },
  routes,
});

router.beforeEach((to, _from, next) => {
  document.title = (to.meta && to.meta.title) || "论文系统";
  if (to.name != "login") {
    Promise.all([Auth.check(), Acl.check()])
      .then(() => {
        if (to.meta && to.meta.acl && !Acl.verify(to.meta.acl)) {
          next({
            name: "403",
          });
        } else {
          next();
        }
      })
      .catch(() => {
        next({
          name: "login",
        });
      });
  } else {
    next();
  }
});

export default router;
