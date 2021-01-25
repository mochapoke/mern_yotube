const mongoose = require('mongoose');

const dislikeSchema = mongoose.Schema(
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

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike };
