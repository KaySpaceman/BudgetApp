<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="statement-upload-page">
            <div class="page-header">
                <h1 class="page-title">Statement Upload</h1>
            </div>
            <form class="statement-form" action="upload-action" method="POST" encType="multipart/form-data">
                <BankSelect :items="availableBanks"/>
                <input id="statement-file" class="file-upload-input" type="file" name="statement-file">
                <button class="button button-submit" type="submit">Send</button>
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
