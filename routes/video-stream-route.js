const express = require('express')
const router = express.Router()
const videoStreamController = require('../controllers/video-stream-controller')

router.get('/:id', videoStreamController.renderVideo)
router.get('/:file_name/play', videoStreamController.streamVideo)

module.exports = router