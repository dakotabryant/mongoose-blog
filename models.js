const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};