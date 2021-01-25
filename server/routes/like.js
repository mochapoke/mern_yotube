const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

router.post('/getLikes', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

router.post('/getDislikes', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

/////////////////////////////////////////

router.post('/upLike', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  const like = new Like(variable);

  // 좋아요가 false일 때 : 좋아요 + 1, 싫어요 -1
  // 좋아요 +1 : 유저정보를 DB의 Like에 저장
  like.save((err, likeResult) => {
    if (err) return res.json({ success: false, err });

    // 싫어요 -1 : 유저정보를 DB의 Dislike에서 삭제
    Dislike.findOneAndDelete(variable).exec((err, dislikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  // 좋아요 -1
  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

//////////////////////////////////////////////
router.post('/upDislike', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  const dislike = new Dislike(variable);

  // 싫어요 false일 때 : 좋아요 + 1, 싫어요 -1
  // 싫어요 +1 : 유저정보를 DB 저장
  dislike.save((err, result) => {
    if (err) return res.status(400).send(err);

    // 좋아요 -1 : 유저정보를 DB 삭제
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/unDislike', (req, res) => {
  let variable = {};
  if (req.body.videoID) {
    variable = { videoID: req.body.videoID, userID: req.body.userID };
  } else {
    variable = { commentID: req.body.commentID, userID: req.body.userID };
  }

  // 싫어요 -1
  Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
