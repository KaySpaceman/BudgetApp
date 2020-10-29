import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Savings from '../views/Savings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/savings',
    name: 'Savings',
    component: Savings,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
