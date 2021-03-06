import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Savings from '../views/Savings.vue';
import Statistics from '../views/depreciated/Statistics.vue';
import Investments from '../views/Investments.vue';

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
  {
    path: '/investments',
    name: 'Investments',
    component: Investments,
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
