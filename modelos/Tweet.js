import mongoose from 'mongoose';

const entradaSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    conversation_id: {
      type: Number,
    },
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
    reply_settings: {
      type: String,
    },
    possibly_sensitive: {
      type: Boolean,
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
    attachments: [
      {
        media_keys: {
          type: [String],
        },
        media: [
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
            public_metrics: [
              {
                view_count: {
                  type: Number,
                },
              },
            ],
            preview_image_url: {
              type: String,
            },
            width: {
              type: Number,
            },
          },
        ],
      },
    ],
    poll: [
      {
        duration_minutes: {
          type: Number,
        },
        end_datetime: {
          type: Date,
        },
        id: {
          type: Number,
        },
        options: {
          type: String,
        },
        voting_status: {
          type: String,
        },
      },
    ],
    author: [
      {
        id: {
          type: Number,
        },
        name: {
          type: String,
        },
        username: {
          type: String,
        },
        created_at: {
          type: Date,
        },
        description: {
          type: String,
        },
        entities: [
          {
            url: [
              {
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
                  },
                ],
              },
            ],
            description: [
              {
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
              },
            ],
          },
        ],
        location: {
          type: String,
        },
        pinned_tweet_id: {
          type: String,
        },
        profile_image_url: {
          type: String,
        },
        protected: {
          type: Boolean,
        },
        public_metrics: [
          {
            followers_count: {
              type: Number,
            },
            following_count: {
              type: Number,
            },
            tweet_count: {
              type: Number,
            },
            listed_count: {
              type: Number,
            },
          },
        ],
        url: {
          type: String,
        },
        verified: {
          type: Boolean,
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
    ],
    geo: [
      {
        place_id: {
          type: String,
        },
        full_name: {
          type: String,
        },
        country_code: {
          type: String,
        },
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
        country: {
          type: String,
        },
        id: {
          type: String,
        },
        place_type: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
  },
  { collection: 'tweets' }
);

export default entradaSchema;
