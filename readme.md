# make-symlinks

[![Travis CI](https://img.shields.io/travis/iguntur/make-symlinks.svg?style=flat-square)](https://travis-ci.org/iguntur/make-symlinks)
[![node](https://img.shields.io/node/v/make-symlinks.svg?style=flat-square)](#)
[![npm](https://img.shields.io/npm/v/make-symlinks.svg?style=flat-square)](https://www.npmjs.org/package/make-symlinks)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-1e9eff.svg?style=flat-square)](http://makeapullrequest.com)

> Create symbolic link (file symlink) using glob

---

## Install

```console
$ npm install make-symlinks
```


## Usage

```js
const makeSymlinks = require('make-symlinks');

const patterns = ['/home/guntur/dotfiles/*', '!/home/guntur/dotfiles/.git'];
const path = '/home/guntur/';

makeSymlinks(patterns, path).then(symlinks => {
    symlinks.forEach(symlink => {
        console.log(symlink.path, '→', symlink.target);
    });
});

const symlinks = makeSymlinks.sync(patterns, path);
symlinks.forEach(symlink => {
    console.log(symlink.path, '→', symlink.target);
});
```


## API

### makeSymlinks(`patterns`, `path`, `[options]`)

- Params:
    - `patterns`: `<string | string[]>` _(required)_ - The source files. See [`globby`](https://github.com/sindresorhus/globby#patterns) supported patterns.
    - `path`: `<string>` _(required)_ - The directory an output of symlink(s).
    - `options`: [`<Options>`](#options)
- Returns: `<Promise<object>>` - Returns a promise for an array object of symlinks patterns and path.

### makeSymlinks.sync(`patterns`, `path`, `[options]`)

- Params:
    - `patterns`: `<string | string[]>` _(required)_ - The source files. See [`globby`](https://github.com/sindresorhus/globby#patterns) supported patterns.
    - `path`: `<string>` _(required)_ - The directory an output of symlink(s).
    - `options`: [`<Options>`](#options)
- Returns: `<Promise<object>>` - Returns an array object of symlinks patterns and path.


#### Options

See all supported [`globby`](https://github.com/sindresorhus/globby#options) options.

- `cwd`: `<string>` _(optional)_ - The source files to resolve from.
    - Default: `process.cwd()`
- `force`: `<boolean>` _(optional)_ - Delete symlink if exists.
    - Default: `false`
- `dryRun`: `<boolean>` _(optional)_ - See what would be created symlinks.
    - Default: `false`

**Example**
```js
const options = {
    cwd: process.env.HOME,
    dryRun: true
};

makeSymlinks('**/*', '/path/symlinks/dest', options).then(symlinks => {
    symlinks.forEach(symlink => {
        console.log(symlink.path, '→', symlink.target);
    });
});
```



## Related

- [ln-cli](https://github.com/iguntur/ln-cli) - Create or delete symbolic link using glob on CLI.
- [del-symlinks](https://github.com/iguntur/del-symlinks) - Delete symlinks using glob.
- [get-symlinks](https://github.com/iguntur/get-symlinks) - Get all symbolic link (file symlinks) using glob.


## License

MIT © [Guntur Poetra](https://github.com/iguntur)
