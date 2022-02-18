const tweetStream = document.getElementById('tweetStream');
const socket = io();
const tweets = [];

socket.on('connect', () => {
  console.log('Connected to server...');
});

const res = fetch('http://localhost:3000/prueba')
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  });

socket.on('tweet', (tweet) => {
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

  // const tweetEl = document.createElement('div')
  tweetStream.className = 'card my-4';

  if (tweetData.image) {
    tweetStream.innerHTML = `
        <div class='card-body'>
          <img src=${tweetData.image}>
        </div>  
        

      `;
  }

  // tweetStream.appendChild(tweetEl)
});
