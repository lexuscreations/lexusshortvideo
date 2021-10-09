const multer = require('multer')
const fs = require('fs')

const fileFilter = (req, file, callback) => {
    let errorMessage = ''
    if (!file || file.mimetype !== 'video/mp4') {
        errorMessage = 'Wrong File Type \"' + file.originalname.split('.').pop() + '\" Found. Only mp4 Video Files Are Allowed!'
    }
    if (errorMessage) {
        return callback({ errorMessage: errorMessage, code: 'LIMIT_FILE_TYPE' }, false)
    }
    callback(null, true)
}

const destinationPath = (req, file, callback) => {
    let stat = null
    try {
        stat = fs.statSync(process.env.FILE_UPLOAD_PATH)
    } catch (err) { fs.mkdirSync(process.env.FILE_UPLOAD_PATH) }

    callback(null, process.env.FILE_UPLOAD_PATH)
}

const fileNameConvention = (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'))
}

const limits = {
    fileSize: parseInt(process.env.FILE_SIZE) * 1024 * 1024 // 200MB
}


const storage = multer.diskStorage({
    destination: destinationPath,
    filename: fileNameConvention
})

const fileUploadConfig = {
    fileFilter: fileFilter,
    storage: storage,
    limits: limits
}

module.exports.fileUploadConfig = fileUploadConfig