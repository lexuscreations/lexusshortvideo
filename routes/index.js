const express = require('express')
const router = express.Router()
const videoUpload = require('./video-upload-route')
const videoStream = require('./video-stream-route')
const AllVideoStreamController = require('../controllers/all-video-stream-controller')

router.use('/', videoUpload)
router.get('/video/all', AllVideoStreamController.renderVideoAll)
router.use('/video', videoStream)

module.exports = router