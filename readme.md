# make-symlinks
[![Build Status](https://travis-ci.org/iguntur/make-symlinks.svg?branch=master)](https://travis-ci.org/iguntur/make-symlinks)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-1e9eff.svg)](http://makeapullrequest.com)

> Create symbolic link (symlink) using glob


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

### makeSymlinks(patterns, path, [options])

Returns a promise for an array object of symlinks patterns and path.

### makeSymlinks.sync(patterns, path, [options])

Returns an array of symlinks patterns and path.

- __patterns__: `string | Array<string>`

    Source path or target of symlink(s).

    - See supported minimatch [patterns](https://github.com/isaacs/minimatch#usage).
    - [Quick globbing pattern overview](https://github.com/sindresorhus/multimatch#globbing-patterns).

- __path__: `string`

    The directory an output of symlink(s).

- __options__: `object`

    See the `node-glob` [options](https://github.com/isaacs/node-glob#options).

    | Property | Type       | Default  | Description |
    | -------- | ---------- | -------- | ----------- |
    | `force`  | `boolean`  | `false`  | Delete symlink if exists. |
    | `dryRun` | `boolean`  | `false`  | See what would be created symlinks. |

    __example__

    ```js
    makeSymlinks('/path/to/files/*', '/path/symlinks/dest', {dryRun: true}).then(symlinks => {
        symlinks.forEach(symlink => {
            console.log(symlink.path, '→', symlink.target);
        });
    });
    ```

## Related

- [ln-cli](https://github.com/iguntur/ln-cli) - Create or delete symbolic link using glob on CLI.
- [del-symlinks](https://github.com/iguntur/del-symlinks) - Delete symlinks using glob.
- [get-symlinks](https://github.com/iguntur/get-symlinks) - Get all symbolic link in directory.


## License

MIT © [Guntur Poetra](https://github.com/iguntur)
