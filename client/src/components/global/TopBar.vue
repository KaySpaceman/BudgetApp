<template>
  <div class="top-bar">
    <div class="user-info">
      <span class="username" v-text="username"/>
      <v-avatar color="#FAFBFD">
        <span class="user-initials" v-text="userInitials"/>
      </v-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  data: () => ({
    username: 'Kristers Lielups', // TODO: Populate from store
    userInitials: 'KL',
  }),
};
</script>

<style lang="scss" scoped>
.top-bar {
  display: flex;
  flex-direction: row;
  height: 47px;
  background: $c-white;

  .user-info {
    margin: auto 5px auto auto;

    .username {
      font-size: 18px;
      text-align: center;
    }
  }
}

</style>
