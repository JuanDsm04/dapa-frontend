import QuotesView from "@/views/QuotesView.vue";
import HomepageView from "@/views/HomepageView.vue";
import LoginView from "@/views/LoginView.vue";
import UsersView from "@/views/UsersView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { getUserRole, isTokenExpired } from '@/utils/auth';


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
      component: UsersView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: "/quotes",
      name: "Quotes",
      component: QuotesView,
      meta: { requiresAuth: true, roles: ['admin'] }
    }    
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    return next('/login');
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.roles) {
    const userRole = getUserRole();
    if (userRole && (to.meta.roles as string[]).includes(userRole)) {
      next();
    } else {
      next('/homepage');
    }
  } else {
    next();
  }
});

export default router;