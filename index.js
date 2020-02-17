const fs = require('fs');
const { join } = require('path');

const ytdl = require('ytdl-core');
const urls = process.argv.slice(2);

const getPageTitle = require('./modules/pageTitle');

if (!urls) {
  return console.log(`Missing args (urls)`);
}

urls.forEach(async url => {
  try {
    const shortPattern = new RegExp(/^https?\:\/\/youtu\.be\/(\w{11})&?/);
    const fullPattern = new RegExp(/^https?\:\/\/www\.youtube\.com\/watch\?v=(\w{11})&?/);

    // Match urls like https://youtu.be/9Rah1F1zq1k
    if (shortPattern.test(url)) {
      url = `https://www.youtube.com/watch?v=${shortPattern.exec(url)[1]}`;
    }

    // Match urls like https://www.youtube.com/watch?v=9Rah1F1zq1k
    if (!fullPattern.test(url)) {
      throw new Error(`Bad url!`);
    }

    const key = url.split('?')[1].split('=')[1];
    const pageTitle = await getPageTitle(url)
    .then(title => title.replace(/[/\\?%*:|"<>]/g, ''));
    const path = join(__dirname, 'downloads', `${pageTitle} - ${key}.mp4`);

    if (fs.existsSync(path)) {
      console.log(`File already exists:  ${path}`);
    } else {
      ytdl(url, {
        filter: format => format.container === 'mp4',
        quality: 'highest',
      })
      .pipe(fs.createWriteStream(path));
      
      require('child_process')
      .exec(`start "" "${join(__dirname, 'downloads')}"`);
    }
  } catch(error) {
    console.log(`Failed to download ${url}:  ${error.message}`);
  }
});
