<template>
  <div class="sidebar">
    <div class="logo-container">
      <router-link to="/">
        <img alt="logo" class="logo" src="@/assets/Logo.svg"/>
        <span class="app-name">BUDGET APP</span>
      </router-link>
    </div>
    <div class="menu">
      <router-link class="link" to="/">
        <img class="icon" src="@/assets/Dashboard.svg" alt=""/>
        <span class="name">Dashboard</span>
      </router-link>
      <router-link class="link" to="/transactions">
        <img class="icon" src="@/assets/Transactions.svg" alt=""/>
        <span class="name">Transactions</span>
      </router-link>
      <router-link class="link" to="/savings">
        <img class="icon" src="@/assets/Savings.svg" alt=""/>
        <span class="name">Savings</span>
      </router-link>
      <router-link class="link" to="/investments">
        <img class="icon" src="@/assets/Investments.svg" alt=""/>
        <span class="name">Investments</span>
      </router-link>
      <router-link class="link" to="/statistics">
        <img class="icon" src="@/assets/Statistics.svg" alt=""/>
        <span class="name">Statistics</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
};
</script>

<style lang="scss" scoped>
.sidebar {
  margin: 15px;
}

.logo-container {
  a {
    display: flex;
    flex-wrap: nowrap;
    text-decoration: none;
    align-items: center;
    justify-content: space-between;

    .logo {
      margin-left: 15px;
    }

    .app-name {
      font-weight: $fw-bold;
      font-size: 24px;
      text-align: center;
      margin-left: 15px;
    }
  }
}

.menu {
  align-items: center;
  display: flex;
  border-bottom: 2px solid $c-off-white;
  flex-direction: column;
  margin-top: 15px;
  padding-bottom: 15px;

  .link {
    display: flex;
    position: relative;
    flex-direction: row;
    flex-wrap: nowrap;
    text-decoration: none;
    margin: 10px 0;
    height: 32px;
    width: 100%;

    &.router-link-active,
    &:hover {
      .name {
        color: $c-dodger-blue;
      }

      .icon {
        filter: invert(40%) sepia(77%) saturate(2532%) hue-rotate(185deg) brightness(102%)
        contrast(107%);
      }

      &:before {
        border: 2px solid $c-dodger-blue;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        content: ' ';
        height: 100%;
        position: absolute;
        left: -15px;
      }
    }

    &:not(.router-link-active):hover:before {
      height: 10px;
      top: 11px;
    }

    .icon {
      margin-right: 20px;
      margin-left: 15px;
      width: 30px;
    }

    .name {
      color: $c-charcoal;
      font-size: 20px;
      font-weight: $fw-bold;
      text-align: left;
    }
  }
}
</style>
