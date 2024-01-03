const {google} = require('googleapis');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = class YoutubeDownloader {
  
    static async audioDownload(url, dir) {
      return new Promise(async (resolve, reject) => {
        try{
          if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  
          const video = ytdl(url, { filter: 'audioonly' });
          const info = await ytdl.getInfo(url);
          video.pipe(fs.createWriteStream(path.join(dir, `${info.videoDetails.title}.mp3`)));
  
          console.log(`\n🎶 ${info.videoDetails.title} 🎶\n`);
  
          let starttime;
          video.once('response', () => {
            starttime = Date.now();
          });

          video.on('progress', (chunkLength, downloaded, total) => {
            process.stdout.write('\x1b[?25l');
            const percent = downloaded / total;
            const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
            const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${(percent * 100).toFixed(0)}% downloaded `);
            process.stdout.write(` (${(downloaded / 1024 / 1024).toFixed(2)} MB of ${(total / 1024 / 1024).toFixed(2)} MB)\n`);
            process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)} minutes`);
            process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)} minutes `);
            readline.moveCursor(process.stdout, 0, -1);
          });
  
          video.on('end', () => {
            process.stdout.write('\x1b[?25h]');
            console.log('\n\n\nDownload concluído ✔️');
            process.stdout.write('\n');
            resolve();
          });
        } catch(err) {
          reject('\nOcorreu um erro: ', err);
        }
      });
    }
    
    download({ type = 'audio', url, dir, apiKey = null }) {
        if(type === 'audio') YoutubeDownloader.audioDownload(url, dir);
    }
};