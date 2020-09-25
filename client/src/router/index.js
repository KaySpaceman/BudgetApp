import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Charts from '../views/Charts.vue';
import Accounts from '../views/Accounts.vue';
import Categories from '../views/Categories.vue';
import StatementUpload from '../views/StatementUpload.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/upload',
    name: 'Upload',
    component: StatementUpload,
  },
  {
    path: '/account',
    name: 'Transactions',
    component: Accounts,
  },
  {
    path: '/category',
    name: 'Categories',
    component: Categories,
  },
  {
    path: '/transaction',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/chart',
    name: 'Charts',
    component: Charts,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
