const {google} = require('googleapis');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

module.exports = class YoutubeDownloader {
  
    static async audioDownload(url, dir) {
      try{
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);

        const video = ytdl(url, { filter: 'audioonly' });
        const info = await ytdl.getInfo(url);
        video.pipe(fs.createWriteStream(path.join(dir, `${info.videoDetails.title}.mp3`)));

        console.log(`\n🎶 ${info.videoDetails.title} 🎶\n`);

        let canCreate = true, progressBar;
        video.on('progress', (chunkLength, downloaded, total) => {

          function createBar(totalCreate) {
            return new ProgressBar('downloading [:bar] :percent || estimated time left: :etas', {
              complete: '=',
              incomplete: ' ',
              width: 20,
              total: totalCreate
            });
          }
          
          if(canCreate === true) {
            progressBar = createBar(total);
            canCreate = false;
          }
          
          process.stdout.write('\x1b[?25l');
          const percent = downloaded / total;
          progressBar.update(percent);
        });

        video.on('end', () => {
          process.stdout.write('\x1b[?25h');
          console.log('\nDownload complete ✔️');
          process.stdout.write('\n');
        });
      } catch(err) {
        console.log('\n', err);
      }
    }
    
    download({ type = 'audio', url, dir, apiKey = null }) {
        if(type === 'audio') YoutubeDownloader.audioDownload(url, dir);
    }
};