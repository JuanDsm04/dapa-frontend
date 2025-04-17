import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomepageView from "@/views/HomepageView.vue";
import RegisterView from "@/views/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/homepage",
      name: "Homepage",
      component: HomepageView
    },
    {
      path: "/users",
      name: "Users",
      component: RegisterView
    }
  ],
});

export default router;
