import { getUserRole, isTokenExpired } from '@/utils/auth';
import AssignmentsView from "@/views/AssignmentsView.vue";
import AssignmentTrackingView from "@/views/AssignmentTrackingView.vue";
import DriverAssignmentsView from "@/views/DriverAssignments.vue";
import FormsView from "@/views/FormsView.vue";
import LandingPageView from "@/views/LandingPageView.vue";
import LoginView from "@/views/LoginView.vue";
import ForgotPasswordView from "@/views/ForgotPasswordView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ProfileView from "@/views/ProfileView.vue";
import QuotesView from "@/views/QuotesView.vue";
import FinancialControlView from "@/views/reports/FinancialControlView.vue";
import FinancialReportView from "@/views/reports/FinancialReportView.vue";
import PerformanceReportView from "@/views/reports/PerformanceReportView.vue";
import ReportsView from "@/views/reports/ReportsView.vue";
import UsersView from "@/views/UsersView.vue";
import VehiclesView from "@/views/VehiclesView.vue";
import ClientResponseFormView from "@/views/ClientResponseFormView.vue";
import { createRouter, createWebHistory } from "vue-router";

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
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPasswordView,
      meta: { hideNavbar: true }
    },
	{
      path: "/reset-password",
      name: "ResetPassword",
      component: ResetPasswordView,
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
      meta: { requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/assignments/tracking",
      name: "TempClientAssignments",
      component: AssignmentTrackingView
    },
    {
      path: "/my-assignments",
      name: "MyAssignments",
      component: DriverAssignmentsView,
      meta: { requiresAuth: true, roles: ['driver'] }
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
    },
    {
      path: "/reports",
      name: "Reports",
      component: ReportsView,
      meta: {requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/reports/financial",
      name: "FinancialReport",
      component: FinancialReportView,
      meta: {requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/reports/performance",
      name: "PerformanceReport",
      component: PerformanceReportView,
      meta: {requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/reports/financial_control",
      name: "FinancialControl",
      component: FinancialControlView,
      meta: {requiresAuth: true, roles: ['admin']}
    },
    {
      path: "/dapa-form",
      name: "ClientResponseForm",
      component: ClientResponseFormView,
      meta: { hideNavbar: true }
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
