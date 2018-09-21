const ngPackage = require('ng-packagr');
const path = require('path');

ngPackage
  .ngPackagr()
  .forProject(path.join(__dirname, '../src/accordion/package.json'))
  .withTsConfig(path.join(__dirname, 'tsconfig.ngc.json'))
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });