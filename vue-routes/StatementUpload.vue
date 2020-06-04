<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="upload-section">
            <form action="upload-action" method="POST" encType="multipart/form-data">
                <input type="file" name="statement-file">
                <BankSelect :items="availableBanks"/>
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import BankSelect from './components/transaction/BankSelect.vue';

  export default {
    name: 'StatementUpload',
    data: () => {
      return {
        availableBanks: [],
      };
    },
    components: {
      BankSelect,
      Navigation,
    },
  };
</script>
