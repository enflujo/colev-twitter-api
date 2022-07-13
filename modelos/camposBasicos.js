import mongoose from 'mongoose';

const camposBasicosEsquema = new mongoose.Schema(
  {
    _id: String,
    text: String,
    attachments: {
      poll_ids: [String],
      media_keys: [String],
    },
    author_id: String,
    context_annotations: [
      {
        domain: {
          id: String,
          name: String,
          description: String,
        },
        entity: {
          id: String,
          name: String,
          description: String,
        },
      },
    ],
    conversation_id: String,
    created_at: Date,
    entities: {
      annotations: [
        {
          start: Number,
          end: Number,
          probability: Number,
          normalized_text: String,
          type: { type: String },
        },
      ],
      cashtags: [
        {
          start: Number,
          end: Number,
          tag: String,
        },
      ],
      hashtags: [
        {
          start: Number,
          end: Number,
          tag: String,
        },
      ],
      mentions: [
        {
          start: Number,
          end: Number,
          tag: String,
        },
      ],
      urls: [
        {
          start: Number,
          end: Number,
          url: String,
          expanded_url: String,
          display_url: String,
          status: Number,
          title: String,
          description: String,
          unwound_url: String,
        },
      ],
    },
    geo: {
      coordinates: {
        type: { type: String },
        coordinates: [Number, Number],
      },
      place_id: String,
    },
    in_reply_to_user_id: String,
    lang: String,
    non_public_metrics: {
      impression_count: Number,
      url_link_clicks: Number,
      user_profile_clicks: Number,
    },
    organic_metrics: {
      impression_count: Number,
      like_count: Number,
      reply_count: Number,
      retweet_count: Number,
      url_link_clicks: Number,
      user_profile_clicks: Number,
    },
    possibly_sensitive: Boolean,
    promoted_metrics: {
      impression_count: Number,
      like_count: Number,
      reply_count: Number,
      retweet_count: Number,
      url_link_clicks: Number,
      user_profile_clicks: Number,
    },

    public_metrics: {
      like_count: Number,
      quote_count: Number,
      reply_count: Number,
      retweet_count: Number,
    },

    referenced_tweets: [
      {
        type: { type: String },
        id: String,
      },
    ],
    reply_settings: String,
    source: String,
    withheld: {
      copyright: Boolean,
      country_codes: [String],
    },
  },

  { collection: 'camposBasicos' }
);

export default camposBasicosEsquema;
