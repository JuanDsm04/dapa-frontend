import QuotesView from "@/views/QuotesView.vue";
import LandingPageView from "@/views/LandingPageView.vue";
import LoginView from "@/views/LoginView.vue";
import UsersView from "@/views/UsersView.vue";
import ProfileView from "@/views/ProfileView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { getUserRole, isTokenExpired } from '@/utils/auth';
import VehiclesView from "@/views/VehiclesView.vue";
import AssignmentsView from "@/views/AssignmentsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AssignmentTrackingView from "@/views/AssignmentTrackingView.vue";
import FormsView from "@/views/FormsView.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: LandingPageView,
      meta: { hideNavbar: true }
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { hideNavbar: true }
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
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true, roles: ['admin', 'driver']}
    },
    {
      path: "/vehicles",
      name: "Vehicles",
      component: VehiclesView,
      meta: { requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/assignments",
      name: "Assignments",
      component: AssignmentsView,
      meta: { requiresAuth: true, roles: ['admin', 'driver']}
    },
    {
      path: "/assignments/tracking",
      name: "TempClientAssignments",
      component: AssignmentTrackingView
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { hideNavbar: true }
    },
    {
      path: "/forms",
      name: "Forms",
      component: FormsView,
      meta: {requiresAuth: true, roles: ['admin']}
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
      next('/');
    }
  } else {
    next();
  }
});

export default router;
