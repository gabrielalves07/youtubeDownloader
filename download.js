const YoutubeDownloader = require('./index');

const ytmp3 = new YoutubeDownloader();

const config = {
  // model link = https://www.youtube.com/watch?v=xxxxxxxx
  url: 'https://www.youtube.com/watch?v=oKJ2EZnnZRE',
  dir: 'C:\\Users\\User\\Downloads',
  type: 'audio', // this parameter is "audio" by default
};

ytmp3.download(config);

// run this command in your terminal: node download.js
