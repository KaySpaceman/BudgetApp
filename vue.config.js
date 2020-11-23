module.exports = {
  pages: {
    index: {
      entry: 'client/src/main.js',
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/variables.scss";',
      },
    },
  },
  pluginOptions: {
    apollo: {
      lintGQL: false,
    },
  },
  devServer: {
    progress: false,
  },
  transpileDependencies: [
    'vuetify',
  ],
};
