import mongoose from 'mongoose';

const entradaSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    conversation_id: {
      type: Number,
    },
    referenced_tweets_replied_to_id: {
      type: Number,
    },
    referenced_tweets_retweeted_id: {
      type: Number,
    },
    referenced_tweets_quoted_id: {
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
    public_metrics_like_count: {
      type: Number,
    },
    public_metrics_quote_count: {
      type: Number,
    },
    public_metrics_reply_count: {
      type: Number,
    },
    public_metrics_retweet_count: {
      type: Number,
    },
    reply_settings: {
      type: String,
    },
    possibly_sensitive: {
      type: Boolean,
    },
    withheld_scope: {
      type: String,
    },
    withheld_copyright: {
      type: String,
    },
    withheld_country_codes: {
      type: String,
    },
    entities_annotations: {
      type: String,
    },
    entities_cashtags: {
      type: String,
    },
    entities_hashtags: {
      type: String,
    },
    entities_mentions: {
      type: String,
    },
    entities_urls: {
      type: String,
    },
    context_annotations: {
      type: String,
    },
    attachments_media: {
      type: String,
    },
    attachments_media_keys: {
      type: String,
    },
    attachments_poll_duration_minutes: {
      type: Number,
    },
    attachments_poll_end_datetime: {
      type: Date,
    },
    attachments_poll_id: {
      type: Number,
    },
    attachments_poll_options: {
      type: String,
    },
    attachments_poll_voting_status: {
      type: String,
    },
    attachments_poll_ids: {
      type: String,
    },
    author_id: {
      type: Number,
    },
    author_created_at: {
      type: Date,
    },
    author_username: {
      type: String,
    },
    author_name: {
      type: String,
    },
    author_description: {
      type: String,
    },
    author_entities_description_cashtags: {
      type: String,
    },
    author_entities_description_hashtags: {
      type: String,
    },
    author_entities_description_mentions: {
      type: String,
    },
    author_entities_description_urls: {
      type: String,
    },
    author_entities_url_urls: {
      type: String,
    },
    author_location: {
      type: String,
    },
    author_pinned_tweet_id: {
      type: Number,
    },
    author_profile_image_url: {
      type: String,
    },
    author_protected: {
      type: Boolean,
    },
    author_public_metrics_followers_count: {
      type: Number,
    },
    author_public_metrics_following_count: {
      type: Number,
    },
    author_public_metrics_listed_count: {
      type: Number,
    },
    author_public_metrics_tweet_count: {
      type: Number,
    },
    author_url: {
      type: String,
    },
    author_verified: {
      type: Boolean,
    },
    author_withheld_scope: {
      type: String,
    },
    author_withheld_copyright: {
      type: String,
    },
    author_withheld_country_codes: {
      type: String,
    },
    geo_coordinates_coordinates: {
      type: String,
    },
    geo_coordinates_type: {
      type: String,
    },
    geo_country: {
      type: String,
    },
    geo_country_code: {
      type: String,
    },
    geo_full_name: {
      type: String,
    },
    geo_geo_bbox: {
      type: String,
    },
    geo_geo_type: {
      type: String,
    },
    geo_id: {
      type: String,
    },
    geo_name: {
      type: String,
    },
    geo_place_id: {
      type: String,
    },
    geo_place_type: {
      type: String,
    },
  },
  { collection: 'tweets2' }
);

export default entradaSchema;
