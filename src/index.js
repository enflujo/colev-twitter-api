import { io } from 'socket.io-client';

const tweetStream = document.getElementById('tweetStream');
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server...');
});

socket.on('tweet', (tweet) => {
  console.log(tweet);
  const tweetData = {
    id: tweet.data.id,
    text: tweet.data.text,
    username: `@${tweet.includes.users[0].username}`,
    image: tweet.includes.media ? tweet.includes.media[0].url : null,
    likes: tweet.data.public_metrics.like_count,
    retweet: tweet.data.public_metrics.retweet_count,
    reply: tweet.data.public_metrics.reply_count,
    quote: tweet.data.public_metrics.quote_count,
  };

  tweetStream.className = 'card my-4';

  if (tweetData.image) {
    tweetStream.innerHTML = `
        <div class='card-body'>
          <img src=${tweetData.image}>
        </div>`;
  }
});
