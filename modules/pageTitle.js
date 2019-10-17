const http = require('http');
const https = require('https');

function getPageTitle(url) {
  const protocol = url.substr(0, 5).toLowerCase() === 'https' ? https : http;
  const titleRegEx = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

  return new Promise((resolve, reject) => {
    protocol.get(url, response => {
      response.on('data', chunk => {
          var str = chunk.toString();
          var match = titleRegEx.exec(str);
          if (match && match[2]) {
            return resolve(match[2]);
          }
      });

      response.on('error', reject)
    });
  });
}

module.exports = getPageTitle;
