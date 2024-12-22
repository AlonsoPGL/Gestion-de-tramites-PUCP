const env = process.env.BABEL_ENV || process.env.NODE_ENV;

if (env === 'test') {
  module.exports = {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react"
    ]
  };
} else {
  module.exports = {
    presets: ['next/babel'],
  };
}