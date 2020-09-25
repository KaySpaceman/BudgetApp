<template>
  <div class="sidebar">
    <div class="logo-container">
      <router-link to="/">
        <img class="logo" src="../../assets/logo.svg" alt="logo"/>
      </router-link>
    </div>
    <div class="menu">
      <span class="menu-item">
        <i class="material-icons md-36 menu-icon">cloud_upload</i>
        <router-link to="/upload" class="menu-link">Upload</router-link>
      </span>
      <span class="menu-item">
        <i class="material-icons md-36 menu-icon">account_balance</i>
        <router-link to="/account" class="menu-link">Accounts</router-link>
      </span>
      <span class="menu-item">
        <i class="material-icons md-36 menu-icon">payment</i>
        <router-link to="/transaction" class="menu-link">Transactions</router-link>
      </span>
      <span class="menu-item">
        <i class="material-icons md-36 menu-icon">category</i>
        <router-link to="/category" class="menu-link">Categories</router-link>
      </span>
      <span class="menu-item">
        <i class="material-icons md-36 menu-icon">show_chart</i>
        <router-link to="/chart" class="menu-link">Charts</router-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
};
</script>
