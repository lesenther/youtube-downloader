const URL = require('url').URL;

const VALID_HOSTS = ['www.youtube.com', 'youtube.com', 'youtu.be'];

/**
 * Validate YouTube urls
 *
 * @param {String} str Url to validate
 * @returns {String} Validated url
 */
function validateUrl(str) {
  try {
    const url = new URL(str);

    if (!VALID_HOSTS.includes(url.hostname)) {
      throw new Error(`Invalid host:  ${url.hostname}`);
    }

    const id = url.hostname === VALID_HOSTS[2] ? url.pathname.slice(1) : url.searchParams.get('v');

    if (!id || id.length !== 11) {
      throw new Error(`Invalid id:  ${id}`);
    }

    return `https://www.youtube.com/watch?v=${id}`;
  } catch (error) {
    return error;
  }
}

module.exports = validateUrl;
