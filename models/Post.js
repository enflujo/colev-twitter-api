const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
  date_time: {
    type: Date,
    default: Date.now
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
})

module.exports = mongoose.model('Posts', PostSchema)