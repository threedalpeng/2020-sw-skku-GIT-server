import Vue from "vue";
import VueRouter from "vue-router";
// import ErrorPage from "./views/ErrorPage";
import Login from "./views/Login";
// import SignUp from "./views/SignUp"
// const Video= () => import("./views/UI_01");
import Video from "./views/UI_01.vue"
// import Graph from "./views/UI_02";
// import Settings from "./views/Settings";
const Settings= () => import('./views/Settings')
const Graph= () => import('./views/UI_02')
const SignUp= () => import('./views/SignUp')
const ErrorPage= () => import("./views/ErrorPage")

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
      {
				path: "/",
				component : Video,
					//nav : MainNav,
					// nav : null,
			},	
      {
				path: "/signup",
        component: SignUp
      },
        {
					path: "*",
					component: ErrorPage,
				},
				{
					path: "/video",
					component: Video,
				},
        {
					path: "/graph",
					component: Graph,
				},
        { 
					path: "/settings",
					component: Settings
				},
]
});

export default router;