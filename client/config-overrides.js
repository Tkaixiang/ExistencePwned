const { override, addLessLoader, fixBabelImports } = require('customize-cra');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = override(
  //customise-cra plugins
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true,
  }),
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: getThemeVariables({
      dark: true,
      compact: false,
    })
  })
  //Terser
);