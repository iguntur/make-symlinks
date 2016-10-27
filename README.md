# make-symlinks [![Build Status](https://travis-ci.org/iguntur/make-symlinks.svg?branch=master)](https://travis-ci.org/iguntur/make-symlinks) [![npm](https://img.shields.io/npm/v/make-symlinks.svg?style=flat-square)](https://npmjs.com/package/make-symlinks)

> Create symbolic link (symlinks) using glob


## Install

```
$ npm install --save make-symlinks
```


## Usage

__async__

``` js
const makeSymlinks = require('make-symlinks');

const patterns = ['/home/guntur/dotfiles/*', '!/home/guntur/dotfiles/.git'];
const path = '/home/guntur/';

makeSymlinks(patterns, path).then(symlinks => {
    console.log(JSON.stringify(symlinks, null, '\t'));
});
```

__sync__

``` js
const makeSymlinks = require('make-symlinks');

const patterns = ['/home/guntur/dotfiles/*', '!/home/guntur/dotfiles/.git'];
const path = '/home/guntur/';

const symlinks = makeSymlinks.sync(patterns, path);

console.log(JSON.stringify(symlinks, null, '\t'));
```


## API

### makeSymlinks(target, path, [options])

Returns a promise for an array object of symlinks target and path.

### makeSymlinks.sync(target, path, [options])

- #### target
    Type: `string`, `array`<br>
    See supported minimatch [patterns](https://github.com/isaacs/minimatch#usage).

    - [Pattern examples with expected matches](https://github.com/sindresorhus/multimatch/blob/master/test.js)
    - [Quick globbing pattern overview](https://github.com/sindresorhus/multimatch#globbing-patterns)

- #### path
    Type: `string`

- #### options
    Type: `object` <br>
    See the `node-glob` [options](https://github.com/isaacs/node-glob#options).

    **&middot; force** <br>
    Type: `boolean`<br>
    Default: `false` <br>

    **&middot; dryRun** <br>
    Type: `boolean`<br>
    Default: `false` <br>

    See what would be created symlinks
    ```js
    makeSymlinks(patterns, path, { dryRun: true }).then(symlinks => {
        symlinks.filter(symlink => {
            console.log(symlink.path, '→', symlink.target);
        });
    });
    ```


## License

MIT © [Guntur Poetra](http://guntur.starmediateknik.com)
