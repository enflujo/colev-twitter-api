import mongoose from 'mongoose';

const camposBasicosEsquema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    text: {
      type: String,
    },
    attachments: [
      {
        media_keys: {
          type: [String],
        },
        poll_ids: {
          type: Array,
        },
      },
    ],
    author_id: {
      type: Number,
    },
    context_annotations: [
      {
        domain: [
          {
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
        ],
        entity: [
          {
            id: {
              type: String,
            },
            name: {
              type: String,
            },
          },
        ],
      },
    ],
    conversation_id: {
      type: Number,
    },
    created_at: {
      type: Date,
    },
    entities: [
      {
        annotations: [
          {
            start: {
              type: Number,
            },
            end: {
              type: Number,
            },
            probability: {
              type: Number,
            },
            normalized_text: {
              type: String,
            },
            type: {
              type: String,
            },
          },
        ],
        cashtags: [
          {
            start: {
              type: Number,
            },
            end: {
              type: Number,
            },
            tag: {
              type: String,
            },
          },
        ],
        hashtags: [
          {
            start: {
              type: Number,
            },
            end: {
              type: Number,
            },
            tag: {
              type: String,
            },
          },
        ],
        mentions: [
          {
            start: {
              type: Number,
            },
            end: {
              type: Number,
            },
            tag: {
              type: String,
            },
            id: {
              type: Number,
            },
            username: {
              type: String,
            },
          },
        ],
        urls: [
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
            status: {
              type: Number,
            },
            media_key: {
              type: String,
            },
            unwound_url: {
              type: String,
            },
            description: {
              type: String,
            },
          },
        ],
      },
    ],
    geo: [
      {
        type: {
          type: String,
        },
        bbox: [
          {
            type: String,
          },
        ],
        properties: {},
      },
    ],
    in_reply_to_user_id: {
      type: Number,
    },
    lang: {
      type: String,
    },
    non_public_metrics: [
      {
        impression_count: {
          type: Number,
        },
        url_link_clicks: {
          type: Number,
        },
        user_profile_clicks: {
          type: Number,
        },
      },
    ],
    organic_metrics: [
      {
        impression_count: {
          type: Number,
        },
        like_count: {
          type: Number,
        },
        reply_count: {
          type: Number,
        },
        retweet_count: {
          type: Number,
        },
        url_link_clicks: {
          type: Number,
        },
        user_profile_clicks: {
          type: Number,
        },
      },
    ],
    possibly_sensitive: {
      type: Boolean,
    },
    promoted_metrics: [
      {
        impression_count: {
          type: Number,
        },
        like_count: {
          type: Number,
        },
        reply_count: {
          type: Number,
        },
        retweet_count: {
          type: Number,
        },
        url_link_clicks: {
          type: Number,
        },
        user_profile_clicks: {
          type: Number,
        },
      },
    ],
    public_metrics: [
      {
        like_count: {
          type: Number,
        },
        quote_count: {
          type: Number,
        },
        reply_count: {
          type: Number,
        },
        retweet_count: {
          type: Number,
        },
      },
    ],
    referenced_tweets: [
      {
        type: {
          type: String,
        },
        id: {
          type: Number,
        },
      },
    ],
    reply_settings: {
      type: String,
    },
    source: {
      type: String,
    },
    withheld: [
      {
        scope: {
          type: String,
        },
        copyright: {
          type: String,
        },
        country_codes: {
          type: String,
        },
      },
    ],
  },

  { collection: 'camposBasicos' }
);

export default camposBasicosEsquema;
