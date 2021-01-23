const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscribe');

// multer config option
let storage = multer.diskStorage({
  // destination : 파일 저장 경로 uploads/
  // 파일생성미리해줘야함
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  fileName: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single('file');

// index.js를 거쳐서 오기때문에 api/video 를 추가로 작성 안해도 된다
// api/video 에 추가로 /uploadfiles 가 붙는 것임!
router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장한다!
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ uploadSuccess: false, err });
    }

    return res.json({
      uploadSuccess: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/thumbnail', (req, res) => {
  // 썸네일 생성하고 비디오 러닝타임도 가져오기
  let filePath = '';
  let fileDuration = '';

  // 비디오 정보 가져오기 .. ffmpeg 고유 method
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function (err) {
      // console.log(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // 스크린샷 at 20%, 40%, 60%, 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b : input basename 파일 원래 이름 (filename w/o-without extension)
      filename: 'thumbnail-%b.png',
    });
});

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보들을 mongoDB에 저장
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ DBsuccess: false, err });
    res.status(200).json({ DBsuccess: true });
  });
});

router.get('/getVideos', (req, res) => {
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post('/getVideoDetail', (req, res) => {
  Video.findOne({ _id: req.body.videoID })
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

router.post('/getSubscriptionVideos', (req, res) => {
  // 자신의 아이디로 구독하는 사람을 찾는다
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      let subscribedUser = [];
      subscriberInfo.map((subscriber, idx) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 찾은 사람들의 비디오를 가져온다
      Video.find({ writer: { $in: subscribedUser } })
        .populate('writer')
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

module.exports = router;
