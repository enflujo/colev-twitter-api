const { Schema } = require('mongoose');

const entradaSchema = new Schema(
  {
    id: {
      type: Number,
    },
    created_at: {
      type: Date,
    },
    text: {
      type: String,
    },
    attachments_media: {
      type: String,
    },
    attachments_media_keys: {
      type: Number,
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
      type: Number,
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
    author__id: {
      type: Number,
    },
    context_annotations: {
      type: String,
    },
    conversation_id: {
      type: Number,
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
      type: Number,
    },
    geo_geo_type: {
      type: String,
    },
    geo_id: {
      type: Number,
    },
    geo_name: {
      type: String,
    },
    geo_place_id: {
      type: Number,
    },
    geo_place_type: {
      type: String,
    },
    in_reply_to_user_id: {
      type: String,
    },
    in_reply_to_user_created_at: {
      type: Date,
    },
    in_reply_to_user_username: {
      type: String,
    },
    in_reply_to_user_name: {
      type: String,
    },
    in_reply_to_user_description: {
      type: String,
    },
    in_reply_to_user_entities_description_cashtags: {
      type: String,
    },
    in_reply_to_user_entities_description_hashtags: {
      type: String,
    },
    in_reply_to_user_entities_description_mentions: {
      type: String,
    },
    in_reply_to_user_entities_description_urls: {
      type: String,
    },
    in_reply_to_user_entities_url_urls: {
      type: String,
    },
    in_reply_to_user_location: {
      type: String,
    },
    in_reply_to_user_pinned_tweet_id: {
      type: String,
    },
    in_reply_to_user_profile_image_url: {
      type: String,
    },
    in_reply_to_user_protected: {
      type: String,
    },
    in_reply_to_user_public_metrics_followers_count: {
      type: String,
    },
    in_reply_to_user_public_metrics_following_count: {
      type: String,
    },
    in_reply_to_user_public_metrics_listed_count: {
      type: String,
    },
    in_reply_to_user_public_metrics_tweet_count: {
      type: String,
    },
    in_reply_to_user_url: {
      type: String,
    },
    in_reply_to_user_verified: {
      type: String,
    },
    in_reply_to_user_withheld_scope: {
      type: String,
    },
    in_reply_to_user_withheld_copyright: {
      type: String,
    },
    in_reply_to_user_withheld_country_codes: {
      type: String,
    },
    in_reply_to_user_id: {
      type: String,
    },
    lang: {
      type: String,
    },
    possibly_sensitive: {
      type: Boolean,
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
    referenced_tweets: {
      type: String,
    },
    reply_settings: {
      type: String,
    },
    source: {
      type: String,
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
    type: {
      type: String,
    },
  },
  { collection: 'tweets' }
);

module.exports = entradaSchema;
