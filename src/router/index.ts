import AdminView from "@/views/AdminView.vue";
import HomepageView from "@/views/HomepageView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { createRouter, createWebHistory } from "vue-router";


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
    },
    {
      path: "/admin",
      name: "Admin",
      component: AdminView
    }    
  ],
});

export default router;
