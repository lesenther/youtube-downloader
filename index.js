const fs = require('fs');
const { join } = require('path');

const ytdl = require('ytdl-core');

const validateUrl = require('./modules/validateUrl');
const uniquePath = require('./modules/uniquePath');
const openFolder = require('./modules/openFolder');

const args = process.argv.slice(2);

const AUDIO_FLAGS = '--audio|-audio|--a|-a|--mp3|-mp3'.split('|');
const FORCE_FLAGS = '--force|-force|--f|-f'.split('|');
const audioOnly = args.filter(param => AUDIO_FLAGS.includes(param)).length > 0;
const forceSave = args.filter(param => FORCE_FLAGS.includes(param)).length > 0;

const saveDir = join(__dirname, 'downloads');

if (!args) {
  return console.log(`Missing args`);
}

if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir);
}

args
.filter(param => !AUDIO_FLAGS.includes(param))
.forEach(async url => {
  const pathTemp = join(saveDir, `${+new Date}.tmp`);
  let pathClean, id, title;

  try {
    url = validateUrl(url);

    ytdl(url, {
      filter: audioOnly ? 'audioonly' : format => format.container === 'mp4',
      quality: 'highest',
    })
    .on('info', info => {
      title = info.title.replace(/[/\\?%*:|"<>]/g, '');
      id = info.video_id;

      pathClean = join(saveDir, `${title} - ${id}.mp${audioOnly ? '3' : '4'}`);
    })
    .on('end', _ => {
      openFolder(saveDir);

      if (fs.existsSync(pathClean)) {
        if (!forceSave) {
          return console.log(`File already exists:  ${pathClean}`);
        }

        pathClean = uniquePath(pathClean);
      }

      fs.renameSync(pathTemp, pathClean);
    })
    .on('error', error => {
      throw error;
    })
    .pipe(fs.createWriteStream(pathTemp));
  } catch(error) {
    console.log(`Failed to download ${url}:  ${error.message}`);
  }
});
