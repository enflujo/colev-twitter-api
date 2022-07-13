import mongoose from 'mongoose';

const camposUsuariosEsquema = new mongoose.Schema(
  {
    id: String,
    name: String,
    username: String,
    created_at: Date,
    description: String,
    entities: {
      url: {
        urls: [
          {
            start: Number,
            end: Number,
            url: String,
            expanded_url: String,
            display_url: String,
          },
        ],
      },
      description: {
        urls: [
          {
            start: Number,
            end: Number,
            url: String,
            expanded_url: String,
            display_url: String,
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
        cashtags: [
          {
            start: Number,
            end: Number,
            tag: String,
          },
        ],
      },
    },
    location: String,
    pinned_tweet_id: String,
    profile_image_url: String,
    protected: Boolean,
    public_metrics: {
      followers_count: Number,
      following_count: Number,
      tweet_count: Number,
      listed_count: Number,
    },
    url: String,
    verified: Boolean,
    withheld: Object,
  },
  { collection: 'camposUsuarios' }
);

export default camposUsuariosEsquema;
