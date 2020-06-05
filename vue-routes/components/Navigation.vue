<template>
    <div class="navigation">
        <div class="menu">
            <span class="menu-item">
                <i class="material-icons md-36 menu-icon">cloud_upload</i>
                <a href="/upload" class="menu-link">Upload</a>
            </span>
            <span class="menu-item">
                <i class="material-icons md-36 menu-icon">payment</i>
                <a href="/transactions" class="menu-link">Transactions</a>
            </span>
            <span class="menu-item">
                <i class="material-icons md-36 menu-icon">category</i>
                <a href="/categories" class="menu-link">Categories</a>
            </span>
            <span class="menu-item">
                <i class="material-icons md-36 menu-icon">show_chart</i>
                <a href="/charts" class="menu-link">Charts</a>
            </span>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Navigation',
    data: () => {
      return {
      };
    },
  };
</script>
