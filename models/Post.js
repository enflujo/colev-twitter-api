const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  date_time: {
    type: Date,
    default: null
  },
  confirmed: {
    type: Number,
    require: true
  },
  death: {
    type: Number,
    require: true
  },
  type: {
    type: String,
    require: true
  },
}, {collection: 'forecast_cases'})

module.exports = PostSchema