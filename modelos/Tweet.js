import mongoose from 'mongoose';

const entradaSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    conversation_id: {
      type: Number,
    },
    'referenced_tweets.replied_to.id': {
      type: Number,
    },
    'referenced_tweets.retweeted.id': {
      type: Number,
    },
    'referenced_tweets.quoted.id': {
      type: Number,
    },
    author_id: {
      type: Number,
    },
    in_reply_to_user_id: {
      type: Number,
    },
    retweeted_user_id: {
      type: Number,
    },
    quoted_user_id: {
      type: Number,
    },
    created_at: {
      type: Date,
    },
    text: {
      type: String,
    },
    lang: {
      type: String,
    },
    source: {
      type: String,
    },
    'public_metrics.like_count': {
      type: Number,
    },
    'public_metrics.quote_count': {
      type: Number,
    },
    'public_metrics.reply_count': {
      type: Number,
    },
    'public_metrics.retweet_count': {
      type: Number,
    },
    reply_settings: {
      type: String,
    },
    // possibly_sensitive: {
    //   type: Boolean,
    // },
    'withheld.scope': {
      type: String,
    },
    'withheld.copyright': {
      type: String,
    },
    'withheld.country_codes': {
      type: String,
    },
    'entities.annotations': {
      type: String,
    },
    'entities.cashtags': {
      type: String,
    },
    'entities.hashtags': {
      type: String,
    },
    'entities.mentions': {
      type: String,
    },
    'entities.urls': [
      {
        start: {
          type: Number,
        },
        end: {
          type: Number,
        },
        url: {
          type: String,
        },
        expanded_url: {
          type: String,
        },
        display_url: {
          type: String,
        },
      },
    ],
    context_annotations: [
      {
        domain: {
          id: {
            type: String,
          },
          name: {
            type: String,
          },
          description: {
            type: String,
          },
        },
        entity: {
          id: {
            type: String,
          },
          name: {
            type: String,
          },
        },
      },
    ],

    'attachments.media': [
      {
        duration_ms: {
          type: Number,
        },
        type: {
          type: String,
        },
        height: {
          type: Number,
        },
        media_key: {
          type: String,
        },
        public_metrics: {
          view_count: {
            type: Number,
          },
        },
        preview_image_url: {
          type: String,
        },
        width: {
          type: Number,
        },
      },
    ],

    'attachments.media_keys': {
      type: String,
    },
    'attachments.poll.duration_minutes': {
      type: Number,
    },
    'attachments.poll.end_datetime': {
      type: Date,
    },
    'attachments.poll.id': {
      type: Number,
    },
    'attachments.poll.options': {
      type: String,
    },
    'attachments.poll.voting_status': {
      type: String,
    },
    'attachments.poll.ids': {
      type: String,
    },
    'author.id': {
      type: Number,
    },
    'author.created_at': {
      type: Date,
    },
    'author.username': {
      type: String,
    },
    'author.name': {
      type: String,
    },
    'author.description': {
      type: String,
    },
    'author.entities.description.cashtags': {
      type: String,
    },
    'author.entities.description.hashtags': {
      type: String,
    },
    'author.entities.description.mentions': {
      type: String,
    },
    'author.entities.description.urls': {
      type: String,
    },
    'author.entities.url.urls': {
      type: String,
    },
    'author.location': {
      type: String,
    },
    'author.pinned_tweet_id': {
      type: Number,
    },
    'author.profile_image_url': {
      type: String,
    },
    'author.protected': {
      type: String,
    },
    'author.public_metrics.followers_count': {
      type: Number,
    },
    'author.public_metrics.following_count': {
      type: Number,
    },
    'author.public_metrics.listed_count': {
      type: Number,
    },
    'author.public_metrics.tweet_count': {
      type: Number,
    },
    'author.url': {
      type: String,
    },
    'author.verified': {
      type: String,
      // collation: { locale: 'en', strength: 2 },
    },
    'author.withheld_scope': {
      type: String,
    },
    'author.withheld_copyright': {
      type: String,
    },
    'author.withheld_country_codes': {
      type: String,
    },
    'geo.coordinates.coordinates': {
      type: String,
    },
    'geo.coordinates.type': {
      type: String,
    },
    'geo.country': {
      type: String,
    },
    'geo.country_code': {
      type: String,
    },
    'geo.full_name': {
      type: String,
    },
    'geo.geo.bbox': {
      type: String,
    },
    'geo.geo.type': {
      type: String,
    },
    'geo.id': {
      type: String,
    },
    'geo.name': {
      type: String,
    },
    'geo.place_id': {
      type: String,
    },
    'geo.place_type': {
      type: String,
    },
  },
  { collection: 'tweets2' }
);

export default entradaSchema;
