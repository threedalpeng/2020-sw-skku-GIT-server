import Vue from "vue";
import VueRouter from "vue-router";

// file which enalbles dynamic routing 
// import Login from "./views/Login";
const Login = () => import("./views/Login");

// import Video from "./views/UI_01.vue"
const Video = () => import("./views/UI_01");

// import Graph from "./views/UI_02";
const Graph = () => import('./views/UI_02');

const Layout = () => import('./components/Layout');

import Settings from "./views/Settings";
// const Settings= () => import('./views/Settings')

// import SignUp from "./views/SignUp";
const SignUp = () => import('./views/SignUp')

// import ErrorPage from "./views/ErrorPage";
// const ErrorPage= () => import("./views/ErrorPage")

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: 'default',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: "video",
        name: "Video",
        component: Video
      },
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "graph",
        name: "Data Import",
        component: Graph
      },
      {
        path: "signup",
        name: "SignUp",
        component: SignUp
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

export default router;