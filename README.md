# ⚠️ WARNING ⚠️
This is an unstable release

Rollup node externals
==============================
> Automatically list package.json dependencies as external

[![Version](https://img.shields.io/npm/v/rollup-node-externals.svg)](https://www.npmjs.org/package/rollup-node-externals)
[![Downloads](https://img.shields.io/npm/dm/rollup-node-externals.svg)](https://www.npmjs.org/package/rollup-node-externals)
[![Build Status](https://travis-ci.org/jnields/rollup-node-externals.svg?branch=master)](https://travis-ci.org/jnields/rollup-node-externals)

## Quick usage
```sh
npm i -D rollup-node-externals
```

In `rollup.config.js`:
```js
var rollupNodeExternals = require('rollup-node-externals');
...
module.exports = {
  // ...
  external: rollupNodeExternals(),
  // ...
};
```
Now all `dependencies`, `peerDependencies`, and `optionalDependencies` will be listed as external.

## Detailed overview
### Description
[Rollup only will include relative imports by default](https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency), but almost always you want your `package.json`’s dependencies to be configured as external in your rollup config. Without this configuration, rollup will give you a warning that you’re referencing an undeclared dependency.

### Configuration
This library accepts an `options` object.

#### `options.whitelist (=[])`
An array for the `externals` to whitelist, so they **will** be included in the bundle. Can accept exact strings (`'module_name'`), regex patterns (`/^module_name/`), or a function that accepts the id and returns whether it should be included (`id => id.startsWith('foo')`).

#### Example
```js
const rollupNodeExternals = require('rollup-node-externals');
const rollupPluginCommonjs = require('rollup-plugin-commonjs');

module.exports = {
    // ...
    external: rollupNodeExternals({
        // this will not mark  `jquery` and `lodash/*` as external
        whitelist: ['jquery', /^lodash\//],
    }),
    plugins: [
      rollupPluginCommonjs(),
    ],
    onwarn(warning) {
      // if there is an unresolved import, you forgot to list it in your package.json
      if (warning.code === 'UNRESOLVED_IMPORT') throw new Error(warning.message);
      console.warn(warning.message);
    },
    // ...
};
```

## Q&A
#### How can I bundle required assets (i.e css files) from node_modules?
Using the `whitelist` option, this is possible. You may bundle all files with extensions that are not js/jsx/json, using this [regex](https://regexper.com/#%5C.%28%3F!js%28x%3F%7Con%29%24%29%5B%5E.%5D%2B%24):
```js
rollupNodeExternals({
  // load non-javascript files with extensions, presumably via loaders
  whitelist: [/\.(?!js(x?|on))[^.]*$/i],
})
```

## Contributing
Contributions and pull requests welcome. Please make sure your code is covered and passes tests.

## License
MIT
