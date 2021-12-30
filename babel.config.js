module.exports = {
  presets: [
    // "@babel/preset-env",
    "@vue/cli-plugin-babel/preset",
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry',
        'corejs': 3
      }
    ]
  ],
};
