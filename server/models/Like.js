const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    commentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    videoID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
  },
  { timestamps: true }
);

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };
