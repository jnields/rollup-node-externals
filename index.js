const path = require('path');
const fs = require('fs');

function containsPattern(arr, val) {
  return arr.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(val);
    } else if (typeof pattern === 'function') {
      return pattern(val);
    } else {
      return pattern == val;
    }
  });
}

module.exports = ({
  whitelist = [],
  modulesDir = 'node_modules'
} = {}) => {
  const nodeModules = path.resolve(process.cwd(), modulesDir);
  const {
    dependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  } = JSON.parse(fs.readFileSync(
    path.resolve(process.cwd(), './package.json'),
    'utf8'
  ));

  const externals = [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
    ...Object.keys(optionalDependencies),
  ];

  return (id) => {
    return !containsPattern(whitelist, id) && externals.some(dependency => (
      id === dependency
      || id.startsWith(`${dependency}/`)
    ));
  };
};
