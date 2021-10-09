const path = require('path')
const fileUploadConfig = require('../config/file-upload-config').fileUploadConfig
const handleDb = require('../db/handle-db')
const multer = require('multer')

module.exports.initUploadPage = (req, res) => {
    res.render("home")
}

module.exports.uploadFile = (req, res) => {
    const upload = multer(fileUploadConfig).single('user-file')
    upload(req, res, (uploadError) => {
        if (uploadError) {
            let errorMessage
            if (uploadError.code === 'LIMIT_FILE_TYPE') {
                errorMessage = uploadError.errorMessage
            } else if (uploadError.code === 'LIMIT_FILE_SIZE') {
                errorMessage = 'Maximum File Size Allowed Is ' + process.env.FILE_SIZE + 'MB'
            }
            return res.json({ error: errorMessage })
        }
        const fileId = req.file.filename.split('-')[0]
        const link = 'http://' + req.hostname + ':' + (process.env.PORT || 3000) + '/video/' + fileId

        res.json({ success: true, link: link })

        const attributesToBeSaved = {
            id: fileId,
            name: req.file.originalname,
            size: req.file.size,
            path: req.file.path,
            encoding: req.file.encoding,
            details: req.body.details ? req.body.details : ''
        }
        handleDb.saveToDB(attributesToBeSaved)
    })
}