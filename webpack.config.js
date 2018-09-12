const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'node-avro-consumer.js'),
  output: {
    filename: 'kafka-avro-bundled.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
}
