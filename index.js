const fs = require('fs');
const { join } = require('path');

const validUrl = require('valid-url');
const ytdl = require('ytdl-core');
const urls = process.argv.slice(2);

const getPageTitle = require('./modules/pageTitle');

if (!urls) {
  return console.log(`Missing arguments`);
}

urls.forEach(async url => {
  try {
    if (!validUrl.isHttpsUri(url)) {
      throw new Error(`Bad url:  ${url}`);
    }

    const key = url.split('?')[1].split('=')[1];
    const pageTitle = await getPageTitle(url)
    .then(title => title.replace(/[/\\?%*:|"<>]/g, ''));
    const path = join(__dirname,'downloads', `${pageTitle} - ${key}.mp4`);

    if (fs.existsSync(path)) {
      console.log(`File already exists:  ${path}`);
    } else {
      ytdl(url, {
        filter: format => format.container === 'mp4',
        quality: 'highest',
      })
      .pipe(fs.createWriteStream(path));
    }
  } catch(error) {
    console.log(`Failed to download ${pageTitle}:  ${error.message}`);
  }
});
