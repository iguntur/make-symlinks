import fs from 'fs';
import path from 'path';
import pify from 'pify';
import del from 'del';
import globby from 'globby';

export interface CreateSymlinkInterface {
	cwd?: string;
	force?: boolean;
	dryRun?: boolean;
}

export interface SymlinkInterface {
	target: string;
	path: string;
}

const fsP = {
	symlink: pify(fs.symlink)
};

const defaultOptions = (opts?: CreateSymlinkInterface) => Object.assign({
	cwd: process.cwd(),
	force: false,
	dryRun: false
}, opts);

function abortIfFileExists(fp: fs.PathLike) {
	if (fs.existsSync(fp)) {
		throw new Error(`${fp} has already exists. Can be with 'force' options`);
	}
}

async function makeSymlink(patterns: string | string[], outputPath: string, options?: CreateSymlinkInterface): Promise<SymlinkInterface[]> {
	const opts = defaultOptions(options);
	const destPath = path.resolve('.', outputPath);

	if (!fs.existsSync(destPath)) {
		throw new Error(`Path ${destPath} doesn't exists`);
	}

	const delOptions = {
		force: opts.force,
		dryRun: opts.dryRun
	};

	delete opts.force;
	delete opts.dryRun;

	return Promise.all(((await globby(patterns, opts)) as string[]).map(async targetPath => {
		const target = path.resolve(opts.cwd, targetPath);
		const dest = path.join(destPath, path.basename(targetPath));

		if (!delOptions.force) {
			abortIfFileExists(dest);
		}

		if (!delOptions.dryRun) {
			if (fs.existsSync(dest)) {
				await del(dest, delOptions);
			}

			await fsP.symlink(target, dest);
		}

		return {
			target,
			path: dest
		};
	}));
}

makeSymlink.sync = function (patterns: string | string[], destPath: string, options?: CreateSymlinkInterface): SymlinkInterface[] {
	const opts = defaultOptions(options);
	destPath = path.resolve('', destPath);

	if (!fs.existsSync(destPath)) {
		throw new Error(`Path ${destPath} doesn't exists`);
	}

	const delOptions = {
		force: opts.force,
		dryRun: opts.dryRun
	};

	delete opts.force;
	delete opts.dryRun;

	return (globby.sync(patterns, opts) as string[]).map(targetPath => {
		const target = path.resolve(opts.cwd, targetPath);
		const dest = path.join(destPath, path.basename(targetPath));

		if (!delOptions.force) {
			abortIfFileExists(dest);
		}

		if (!delOptions.dryRun) {
			if (fs.existsSync(dest)) {
				del.sync(dest, delOptions);
			}

			fs.symlinkSync(target, dest);
		}

		return {
			target,
			path: dest
		};
	});
};

export default makeSymlink;

module.exports = makeSymlink;
module.exports.default = makeSymlink;
