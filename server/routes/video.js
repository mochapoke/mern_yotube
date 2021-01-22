const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');

const multer = require('multer');

// multer config option
let storage = multer.diskStorage({
  // destination : 파일 저장 경로 uploads/
  // 파일생성미리해줘야함
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
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

  // 인자 3개! req, res, cb
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ uploadSuccess: false, err });
    }

    return res.json({
      uploadSuccess: true,
      url: res.req.file.path, // uploads 파일 경로를 서버에 보내줌
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
