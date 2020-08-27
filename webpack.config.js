module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'vue-forms.js',
    libraryTarget: 'umd',
    library: 'vueForms',
  },
  externals: [
    {
      vue: {
        amd: 'vue',
        commonjs: 'vue',
        commonjs2: 'vue'
      }
    }
  ]
};