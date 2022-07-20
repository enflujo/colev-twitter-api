import { TwitterApi } from 'twitter-api-v2';

const twitter = new TwitterApi(TOKEN);

async function activarFlujo() {
  const flujo = await twitter.v2.searchStream(camposBusqueda);
  flujo.autoReconnect = true;
  flujo.on(ETwitterStreamEvent.Data, async (tweet) => {
    const tweetsIncludes = tweet.includes.tweets;
    // const elPrimero = tweetsIncludes[0].public_metrics;
    // tweetsIncludes.forEach(t => {
    // console.log(t.public_metrics)
    // })
    try {
      io.emit('tweet', tweet);

      // const datosAGuardar = {
      //   id: tweet.data.id,
      //   conversation_id: tweet.data.conversation_id,
      // };

      // datosAGuardar.referenced_tweets = tweet.data.referenced_tweets;

      // coleccionTweets.insertMany(
      //   {
      //     id: tweet.data.id,
      //     conversation_id: tweet.data.conversation_id,
      //     referenced_tweets: tweet.data.referenced_tweets,
      //     author_id: tweet.data.author_id,
      //     in_reply_to_user_id: tweet.data.in_reply_to_user_id,
      //     retweeted_user_id: tweet.data.retweeted_user_id,
      //     quoted_user_id: tweet.data.quoted_user_id,
      //     created_at: tweet.data.created_at,
      //     text: tweet.data.text,
      //     lang: tweet.data.lang,
      //     source: tweet.data.source,
      //     public_metrics: tweet.data.public_metrics,
      //     reply_settings: tweet.data.reply_settings,
      //     withheld: tweet.data.withheld,
      //     possibly_sensitive: tweet.data.possibly_sensitive,
      //     entities: tweet.data.entities,
      //     context_annotations: tweet.data.context_annotations,
      //     attachments: tweet.includes,
      //     pool: tweet.includes.polls,
      //     author: tweet.includes.users,
      //     geo: tweet.includes.places,
      //     /**
      //      * if (tweet.includes.media) {
      //      *   image = tweet.includes.media[0].url
      //      * } else {
      //      *   image = null
      //      * }
      //      */
      //   },
      //   (err, resultado) => {
      //     if (err) console.log(err);
      //     if (resultado) {
      //       console.log('datos insertados');
      //     }
      //   }
      // );
    } catch (error) {
      throw new Error(error);
    }
    // console.log(`los tweets de socket=`, tweet);
    // TODO: Revisar esta parte del ejemplo, se puede filtrar los que son retweets:

    // Ignore RTs or self-sent tweets
    // const isARt = tweet.data.referenced_tweets?.some((tweet) => tweet.type === 'retweeted') ?? false;
    // if (isARt || tweet.data.author_id === meAsUser.id_str) {
    //   return;
    // }
    // });
    // });
  });
}

io.on('connection', async () => {
  console.log('Client connected...');
});
