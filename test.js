import fs from 'fs';
import path from 'path';
import test from 'ava';
import pify from 'pify';
import tempfile from 'tempfile';
import isSymbolicLink from 'is-symbolic-link';
import fn from './';

function symlinkExists(t, paths) {
	[].concat(paths).forEach(pth => {
		pth = path.join(t.context.symlinkPath, pth);
		const fileExists = fs.existsSync(pth);
		t.true(fileExists);
		t.true(isSymbolicLink.sync(pth));
	});
}

function symlinkNotExists(t, paths) {
	[].concat(paths).forEach(pth => {
		pth = path.join(t.context.symlinkPath, pth);
		const fileExists = fs.existsSync(pth);
		t.false(fileExists);
	});
}

test.beforeEach(t => {
	t.context.symlinkPath = tempfile();
	t.context.fixturePath = path.resolve(__dirname, 'fixtures');
	fs.mkdirSync(t.context.symlinkPath);
});

test('async: throws an error when path doesn\'t exist', t => {
	t.throws(() => fn('./fixtures/*', 'unknown-path'), Error);
});

test('async: dryRun options', async t => {
	const results = await fn('**', t.context.symlinkPath, {
		cwd: t.context.fixturePath,
		dryRun: true
	});

	t.true(Array.isArray(results));
	t.true(results.length > 0);
	results.forEach(o => {
		t.true(typeof o === 'object');
		t.true('target' in o);
		t.true('path' in o);
		t.true(new RegExp(t.context.symlinkPath).test(o.path));
	});

	const x = await pify(fs.readdir, Promise)(t.context.symlinkPath);
	t.true(x.length === 0);
});

test('async: create symlinks recursive, except `.dot.txt`', async t => {
	const results = await fn('fixtures/**/*.txt', t.context.symlinkPath);
	const x = await pify(fs.readdir, Promise)(t.context.symlinkPath);
	t.true(results.length === 3);
	t.true(x.length === 3);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt']);
	symlinkNotExists(t, ['.dot.txt', 'a.js']);
});

test('async: create symlinks recursive, except `.dot.txt` - with options {cwd}', async t => {
	const results = await fn('**/*.{txt,js}', t.context.symlinkPath, {cwd: t.context.fixturePath});
	t.true(results.length === 4);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt', 'a.js']);
	symlinkNotExists(t, ['.dot.txt']);
});

test('async: create symlinks not recursive, except `.dot.txt`', async t => {
	const results = await fn(path.resolve(t.context.fixturePath, '*'), t.context.symlinkPath);
	t.true(results.length === 3);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'folders']);
	symlinkNotExists(t, ['.dot.txt', 'baz.txt', 'a.js']);
});

test('async: create symlinks recursive, include `.dot.txt`', async t => {
	const results = await fn(['./**/*.txt', './.*.txt'], t.context.symlinkPath, {cwd: t.context.fixturePath});
	t.true(results.length === 4);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt', '.dot.txt']);
	symlinkNotExists(t, ['folders', 'a.js']);
});

test('async: throws an error when symlinks exist', async t => {
	await fn('fixtures/*', t.context.symlinkPath);
	const err = await t.throws(fn(['fixtures/*'], t.context.symlinkPath), Error);
	t.true(/`force` options/.test(err.message));
});

test('async: force options', async t => {
	await fn('./fixtures/*.txt', t.context.symlinkPath);
	symlinkExists(t, ['foo.txt', 'bar.txt']);
	symlinkNotExists(t, ['.dot.txt', 'baz.txt']);

	await fn('./fixtures/**/*.txt', t.context.symlinkPath, {
		force: true
	});
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt']);
	symlinkNotExists(t, ['.dot.txt']);
});

test('sync: throws an error when path doesn\'t exist', t => {
	t.throws(() => {
		fn.sync('*', 'unknown-path', {cwd: t.context.fixturePath});
	}, Error);
});

test('sync: dryRun options', t => {
	const results = fn.sync('*', t.context.symlinkPath, {
		cwd: t.context.fixturePath,
		dryRun: true
	});

	t.true(Array.isArray(results));
	t.true(results.length > 0);
	results.forEach(o => {
		t.true(typeof o === 'object');
		t.true('target' in o);
		t.true('path' in o);
		t.true(new RegExp(t.context.symlinkPath).test(o.path));
	});

	const x = fs.readdirSync(t.context.symlinkPath);
	t.true(x.length === 0);
});

test('sync: create symlinks recursive, except `.dot.txt`', t => {
	const results = fn.sync('./fixtures/**/*.txt', t.context.symlinkPath);
	t.true(results.length === 3);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt']);
	symlinkNotExists(t, ['.dot.txt', 'folders', 'a.js']);
});

test('sync: create symlinks not recursive, except `.dot.txt`', t => {
	const results = fn.sync('*', t.context.symlinkPath, {cwd: t.context.fixturePath});
	t.true(results.length === 3);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'folders']);
	symlinkNotExists(t, ['.dot.txt', 'baz.txt', 'a.js']);
});

test('sync: create symlinks recursive, include `.dot.txt`', t => {
	const results = fn.sync(['./fixtures/**/*.txt', './fixtures/.*.txt'], t.context.symlinkPath);
	t.true(results.length === 4);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt', '.dot.txt']);
	symlinkNotExists(t, ['folders', 'a.js']);
});

test('sync: throws an error when symlinks exist', t => {
	fn.sync('./fixtures/*', t.context.symlinkPath);
	t.throws(() => fn.sync('./fixtures/*', t.context.symlinkPath), Error);
});

test('sync: force options', t => {
	fn.sync('./fixtures/*', t.context.symlinkPath);
	symlinkExists(t, ['foo.txt', 'bar.txt', 'folders']);
	symlinkNotExists(t, ['.dot.txt', 'baz.txt', 'a.js']);

	fn.sync('./fixtures/**/*.{txt,js}', t.context.symlinkPath, {
		force: true
	});
	symlinkExists(t, ['foo.txt', 'bar.txt', 'baz.txt', 'a.js', 'folders']);
	symlinkNotExists(t, ['.dot.txt']);
});
