module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.17',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV !== 'production',
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    'babel-plugin-styled-components',
  ],
}
