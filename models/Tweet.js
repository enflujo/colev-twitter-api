const { Schema } = require('mongoose');

const entradaSchema = new Schema(
  {
    id: {
      type: Number,
    },
    text: {
      type: String,
    },
    username: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: {
      type: Number,
    },
    retweet: {
      type: Number,
    },
    reply: {
      type: Number,
    },
    quote: {
      type: Number,
    },
  },
  { collection: 'tweets' }
);

module.exports = entradaSchema;
