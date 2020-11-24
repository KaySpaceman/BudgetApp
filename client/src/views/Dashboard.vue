<template>
  <div id="page">
    <div id="content">
      <p>This project is still in development.</p>
      <p>The <a href='transactions'>Transactions</a> and <a href='savings'>Savings</a> pages
        contain some sample data. The data has been randomized so it might not all make sense.
      </p>
      <p><a href="statistics">Statistics</a> page generates charts out of the saved data.</p>
      <p>Repository: <a href="https://github.com/KaySpaceman/BudgetApp">GitHub</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
};
</script>

<style lang="scss" scoped>
#page {
  margin: 30px;

  a {
    text-decoration: none;
    color: $c-dodger-blue;
    font-weight: $fw-semi-bold;
  }
}
</style>
