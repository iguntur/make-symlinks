import path from 'path';
import del from 'del';
import test from 'ava';
import fs from 'fs-extra';
import isArray from 'is-arr';
import tempfile from 'tempfile';
import pathExists from 'path-exists';
import isSymbolicLink from 'is-symbolic-link';
import fn from './';

const fixture = {path: '.tmp', files: ['a.tmp', 'b.tmp', 'c.tmp', '.dot.tmp']};

function exists(t, files) {
	[].concat(files).forEach(file => {
		file = path.join(t.context.path, file);
		t.true(pathExists.sync(file));
		t.true(isSymbolicLink.sync(file));
	});
}

function notExists(t, files) {
	[].concat(files).forEach(file => t.false(pathExists.sync(path.join(t.context.path, file))));
}

test.beforeEach(t => {
	t.context.target = tempfile();
	t.context.path = fixture.path;
	fixture.files.forEach(file => fs.ensureFileSync(path.join(t.context.target, file)));
	fs.ensureDirSync(path.resolve('', t.context.path));
});

/**
 * async
 */
test.serial('async: throws - path doesn\'t exist', async t => {
	await del([path.join(t.context.path, '*')]);
	t.throws(() => fn(['*'], 'unknown-path', {cwd: t.context.target}));
});

test.serial('async: dryRun options', async t => {
	await del([path.join(t.context.path, '*')]);
	const res = await fn(['*'], t.context.path, {
		cwd: t.context.target,
		dryRun: true
	});

	t.true(await isArray(res));
	t.true(res.length > 0);
	res.forEach(async v => {
		t.false(await isArray(v));
		t.true(typeof v === 'object');
	});

	notExists(t, ['a.tmp', 'b.tmp', 'c.tmp', '.dot.tmp']);
});

test.serial('async: create symlinks and except `.dot.tmp`', async t => {
	await fn(['*'], t.context.path, {cwd: t.context.target});
	exists(t, ['a.tmp', 'b.tmp', 'c.tmp']);
	notExists(t, ['.dot.tmp']);
});

test.serial('async: throws - symlinks exist', async t => {
	await t.throws(fn(['*'], t.context.path, {cwd: t.context.target}), /(Can be with `force` options)$/g);
});

test.serial('async: force options', async t => {
	await fn(['*'], t.context.path, {
		cwd: t.context.target,
		force: true
	});

	exists(t, ['a.tmp', 'b.tmp', 'c.tmp']);
	notExists(t, ['.dot']);
});

/**
 * sync
 */
test.serial('sync: throws - path doesn\'t exist', t => {
	del.sync([path.join(t.context.path, '*')]);
	t.throws(() => fn(['*'], 'unknown-path', {cwd: t.context.target}));
});

test.serial('sync: dryRun options', t => {
	del.sync([path.join(t.context.path, '*')]);
	const res = fn.sync(['*'], t.context.path, {
		cwd: t.context.target,
		dryRun: true
	});

	t.true(isArray.sync(res));
	t.true(res.length > 0);
	res.forEach(v => {
		t.false(isArray.sync(v));
		t.true(typeof v === 'object');
	});

	notExists(t, ['a.tmp', 'b.tmp', 'c.tmp', '.dot.tmp']);
});

test.serial('sync: create symlinks and except `.dot.tmp`', t => {
	fn.sync(['*'], t.context.path, {cwd: t.context.target});
	exists(t, ['a.tmp', 'b.tmp', 'c.tmp']);
	notExists(t, ['.dot.tmp']);
});

test.serial('sync: throws - symlinks exist', t => {
	t.throws(fn(['*'], t.context.path, {cwd: t.context.target}), /(Can be with `force` options)$/g);
});

test.serial('sync: force options', t => {
	fn.sync(['*'], t.context.path, {
		cwd: t.context.target,
		force: true
	});

	exists(t, ['a.tmp', 'b.tmp', 'c.tmp']);
	notExists(t, ['.dot']);
});
