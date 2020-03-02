const fs = require('fs');

const btoa = data => new Buffer.from(data.toString(), 'binary').toString('base64').replace(/=/g, '');

/**
 * Takes a given path as a string and generates a new path
 * that doesn't exist.
 *
 * @param {String} path Existing path
 * @param {Function} suffix Function to generate a string to append to the path
 * @returns {String} Unique path
 */
function uniquePath(path, suffix = _ => `.${btoa(+new Date)}`) {
  let _path = path;
  const ext = path.slice(path.length - path.split('').reverse().indexOf('.'));

  while (fs.existsSync(_path)){
    _path = `${path.slice(0, path.length - ext.length - 1)}${suffix()}.${ext}`;
  }

  return _path;
}

module.exports = uniquePath;
