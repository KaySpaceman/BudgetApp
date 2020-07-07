<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="statement-upload-page">
            <div class="page-header">
                <h1 class="page-title">Statement Upload</h1>
            </div>
            <form class="statement-form" action="upload-action" method="POST" encType="multipart/form-data">
                <BankSelect :banks="availableBanks"/>
                <input id="statement-file" class="file-upload-input" type="file" name="statement-file">
                <button class="button button-submit" type="submit">Send</button>
            </form>
            <BankForm :date-formats="dateFormats"/>
        </div>
    </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import BankSelect from './components/bank/BankSelect.vue';
  import BankForm from './components/bank/BankForm.vue';

  export default {
    name: 'StatementUpload',
    data: () => {
      return {
        availableBanks: [],
        dateFormats: [],
      };
    },
    components: {
      Navigation,
      BankSelect,
      BankForm,
    },
  };
</script>
