module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
    validators: './src/validators/index.js',
  },
  output: {
    filename: '[name].js',
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