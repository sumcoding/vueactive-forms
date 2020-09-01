const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/validators/index.js',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'validators',
    path: path.resolve(__dirname, 'validators')
  },
};