const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },

  // Dodanie publicPath dla poprawnej obsługi ścieżek na GitHub Pages
  publicPath: '/copilot-metrics-viewer/', // Zastąp <repo_name> nazwą swojego repozytorium
});

