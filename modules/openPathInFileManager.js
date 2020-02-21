const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(childProcess.exec);

/**
 * Uses the local file manager to spawn a new instance to a given directory.
 *
 * @param {String} dir Path to the directory
 */
function openPathInFileManager(dir) {
  if (!fs.existsSync(dir)) {
    return Promise.reject(new Error(`Invalid path:  ${dir}`));
  }

  // If we were given a path to a file, get it's directory instead
  if (!fs.statSync(dir).isDirectory()) {
    dir = path.dirname(dir);
  }

  let command;

  switch (process.platform) {
    case 'win32':
      command = `start "" "${dir}"`;
      break;

    case 'darwin':
      command = `open "${dir}"`;
      break;

    case 'linux':
    case 'aix':
    case 'freebsd':
    case 'sunos':
    case 'openbsd':
      command = `xdg-open "${dir}"`;
      break;

    default:
      return Promise.reject(new Error(`The platform ${process.platform} is not supported.`))
  }

  return exec(command);
}

module.exports = openPathInFileManager;
