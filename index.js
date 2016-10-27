'use strict';
var fs = require('fs');
var path = require('path');
var del = require('del');
var pify = require('pify');
var globby = require('globby');
var Promise = require('pinkie-promise');
var pathExists = require('path-exists');
var parsePath = require('parse-filepath');

var fssymlink = pify(fs.symlink, Promise);

function safeRun(fp) {
	if (pathExists.sync(fp)) {
		throw new Error(fp + ' is already exists. Can be with `force` options');
	}
}

module.exports = function (patterns, destPath, opts) {
	opts = opts || {};
	destPath = path.resolve('', destPath);

	var symlinks = {};

	var force = opts.force;
	delete opts.force;

	var dryRun = opts.dryRun;
	delete opts.dryRun;

	if (!pathExists.sync(destPath)) {
		throw new Error('Path ' + destPath + ' doesn\'t exists');
	}

	return globby(patterns, opts).then(function (paths) {
		return Promise.all(paths.map(function (targetPath) {
			symlinks.target = path.resolve(opts.cwd || '', targetPath);
			symlinks.dest = path.join(destPath, parsePath(targetPath).basename);

			if (!force) {
				safeRun(symlinks.dest);
			}

			if (dryRun) {
				return Promise.resolve(symlinks);
			}

			if (pathExists.sync(symlinks.dest)) {
				del.sync(symlinks.dest);
			}

			return fssymlink(symlinks.target, symlinks.dest).then(function () {
				return symlinks;
			});
		}));
	});
};

module.exports.sync = function (patterns, destPath, opts) {
	opts = opts || {};
	destPath = path.resolve('', destPath);

	var symlinks = {};

	var force = opts.force;
	delete opts.force;

	var dryRun = opts.dryRun;
	delete opts.dryRun;

	if (!pathExists.sync(destPath)) {
		throw new Error('Path ' + destPath + ' doesn\'t exist');
	}

	return globby.sync(patterns, opts).map(function (targetPath) {
		symlinks.target = path.resolve(opts.cwd || '', targetPath);
		symlinks.dest = path.join(destPath, parsePath(targetPath).basename);

		if (!force) {
			safeRun(symlinks.dest);
		}

		if (!dryRun) {
			if (pathExists.sync(symlinks.dest)) {
				del.sync(symlinks.dest);
			}

			fs.symlinkSync(symlinks.target, symlinks.dest);
		}

		return symlinks;
	});
};
