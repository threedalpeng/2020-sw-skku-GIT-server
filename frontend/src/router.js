import Vue from "vue";
import VueRouter from "vue-router";
import ErrorPage from "./views/ErrorPage";
import Login from "./views/Login";
import SignUp from "./views/SignUp"
import Video from "./views/UI_01";
import Graph from "./views/UI_02";
Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: Login},
        { path: "/signup", component: SignUp},
        { path: "*", component: ErrorPage},
        { path: "/video", component: Video},
        { path: "/graph", component: Graph},
]
});

export default router;