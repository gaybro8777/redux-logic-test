/**
 * Adapted from redux
 * Runs an ordered set of commands within each of the build directories.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

var exampleDirs = fs.readdirSync(__dirname).filter(file =>
  fs.statSync(path.join(__dirname, file)).isDirectory());

// Ordering is important here
var cmdArgs = [
  { cmd: 'npm', args: ['run', 'setupAndRun'] }
];

for (const dir of exampleDirs) {
  for (const cmdArg of cmdArgs) {
    // declare opts in this scope to avoid https://github.com/joyent/node/issues/9158
    const opts = {
      cwd: path.join(__dirname, dir),
      stdio: 'inherit'
    };
    process.stdout.write(`${opts.cwd}: ${cmdArg.cmd} ${cmdArg.args.join(' ')}\n`);
    let result = {};
    if (process.platform === 'win32') {
      result = spawnSync(`${cmdArg.cmd}.cmd`, cmdArg.args, opts);
    } else {
      result = spawnSync(cmdArg.cmd, cmdArg.args, opts);
    }
    if (result.status !== 0) {
      throw new Error('Building examples exited with non-zero');
    }
  }
}
