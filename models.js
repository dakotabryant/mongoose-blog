const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

postSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.author,
    created: this.created
  };
};

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};