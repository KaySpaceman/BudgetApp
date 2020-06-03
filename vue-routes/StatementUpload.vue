<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="upload-section">
            <form action="upload-action" method="POST" encType="multipart/form-data">
                <input type="file" name="statement-file">
                <select id="statement-bank-select" name="bank">
                    <BankOption v-for="bank in availableBanks" :item="bank"/>
                </select>
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import BankOption from './components/transaction/BankOption.vue';

  export default {
    name: 'StatementUpload',
    data: () => {
      return {
        availableBanks: [],
      };
    },
    components: {
      BankOption,
      Navigation,
    },
    mounted: function () {
      $('#statement-bank-select')
        .select2();
    },
  };
</script>
