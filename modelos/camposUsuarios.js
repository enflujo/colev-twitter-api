import mongoose from 'mongoose';

const camposUsuariosEsquema = new mongoose.Schema(
  {
    authors: [
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
  },
  { collection: 'camposUsuarios' }
);

export default camposUsuariosEsquema;
