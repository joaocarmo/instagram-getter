module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.6',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: ['babel-plugin-styled-components'],
}
