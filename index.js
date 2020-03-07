const fs = require('fs');
const { join } = require('path');

const ytdl = require('ytdl-core');
const { getVideoDurationInSeconds} = require('get-video-duration');

const validateUrl = require('./modules/validateUrl');
const uniquePath = require('./modules/uniquePath');
const openPathInFileManager = require('./modules/openPathInFileManager');
const ConcurrentProgressBar = require('./modules/ConcurrentProgressBar');
const concurrentProgressBar = new ConcurrentProgressBar;

const args = process.argv.slice(2);

const AUDIO_FLAGS = '--audio|-audio|--a|-a|--mp3|-mp3'.split('|');
const audioOnly = args.filter(param => AUDIO_FLAGS.includes(param)).length > 0;

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
  let pathClean, id, title, progressHandlerId, abort = false;

  try {
    const download = ytdl(validateUrl(url), {
      filter: audioOnly ? 'audioonly' : format => format.container === 'mp4',
      quality: 'highest',
    })
    .on('info', info => {
      title = info.title.replace(/[/\\?%*:|"<>]/g, '');
      id = info.video_id;

      pathClean = join(saveDir, `${title} - ${id}.mp${audioOnly ? '3' : '4'}`);

      if (fs.existsSync(pathClean)) {
        getVideoDurationInSeconds(pathClean)
        .then(duration => {
          if (Math.abs(info.length_seconds - duration) < 1){
            console.log(`Files appear to be the same length, aborting download!`);
            abort = true;
            download.end();
          }
        });
      }
    })
    .on('end', _ => {
      if (fs.existsSync(pathClean)) {
        console.log(`File already exists:  ${pathClean}`);

        // Check signature
        const stats1 = fs.statSync(pathClean);
        const stats2 = fs.statSync(pathTemp);

        if (stats1.size === stats2.size) {
          console.log(`Files appear to be the same..  Deleting temp file.`);

          return fs.unlinkSync(pathTemp);
        }

        console.log(`Files appear to be different..  Keeping both files.`)

        pathClean = uniquePath(pathClean);
      }

      fs.renameSync(pathTemp, pathClean);
      openPathInFileManager(saveDir);
    })
    .on('error', error => {
      throw error;
    })
    .on('progress', (chunk, partial, total) => {
      if (progressHandlerId) {
        concurrentProgressBar.update(progressHandlerId, partial/total);
      } else {
        setTimeout(_ => {
          if (!abort) {
            progressHandlerId = concurrentProgressBar.add(total);
          }
        }, 0);
      }
    })
    .pipe(fs.createWriteStream(pathTemp));
  } catch(error) {
    if (fs.existsSync(pathTemp)) {
      fs.unlinkSync(pathTemp);
    }
    
    console.log(`Failed to download "${url}":  ${error.message}`);
  }
});
