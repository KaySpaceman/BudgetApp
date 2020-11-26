<template>
  <div id="page">
    <p><span class="highlight"> Repository: </span>
      <a href="https://github.com/KaySpaceman/BudgetApp">GitHub</a>
    </p>
    <div id="content">
      <div class="section">
        <h3>
          <router-link to="/transactions"><span>Transactions</span></router-link>
        </h3>
        <div class="description">
          <p>All the users transactions are managed here</p>
          <p><span class="highlight">List - </span>Contains existing transaction info and delete,
            transfer and edit buttons</p>
          <p><span class="highlight">Form - </span>For transaction creation or editing. Allows
            assignment of transactions to spending, income or savings. Investments not yet
            available</p>
          <p><span class="highlight">Upload form - </span>Allows the user to import transaction from
            a bank CSV export file. CSV files are parsed using the selected banks configuration. New
            bank creation currently ony possible through the <a href="/graphql">GraphQL</a>
            endpoint</p>
          <p><span class="highlight">Category form - </span>Creates or edits categories. Click the
            blue button to see the entire tree.</p>
          <p>All existing data has been <span class="highlight">purposely randomized</span> and
            might not make sense</p>
        </div>
      </div>
      <div class="section">
        <h3>
          <router-link to="/savings"><span>Savings</span></router-link>
        </h3>
        <div class="description">
          <p>This section allows managing funds that have been assigned to savings</p>
          <p><span class="highlight">Grid - </span>Shows current savings goals, called vaults.
            Vaults can be funded, withdrawn from, closed or edited</p>
          <p><span class="highlight">Savings info - </span>Shows current savings progress, available
            funds, stored funds and total savings goal</p>
          <p><span class="highlight">Vault form - </span>Used for vault creation and editing. Vaults
            can have sub-goals and their own color. Vaults with sub-goals get their goal and balance
            values from their sub-goals</p>
          <p><span class="highlight">Funding form - </span>Allows creating new savings deposit and
            withdrawal transactions</p>
        </div>
      </div>
      <div class="section">
        <h3>
          <router-link to="/statistics"><span>Statistics</span></router-link>
        </h3>
        <div class="description">
          <p>Contains chart to visualize total and spending per category. The chart components are
            from a earlier version of the app, so don't look to good and will be replaced later</p>
          <p><span class="highlight">Total - </span>Shows total spending for each month</p>
          <p><span class="highlight">Categorized - </span>Shows spending in each category. Use the
            interval drop down to change the time period used to generate the data. Last month,
            quarter, 6 months or year</p>
        </div>
      </div>
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

  #content {
    display: flex;
    flex-wrap: wrap;

    .section {
      margin: 15px;
      width: 400px;

      .description {
        margin: 10px 15px;

        .highlight {
          font-weight: $fw-semi-bold;
        }

        a {
          text-decoration: none;
          color: $c-dodger-blue;
          font-weight: $fw-semi-bold;
        }
      }
    }
  }
}
</style>
