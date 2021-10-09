const handleDb = require('../db/handle-db')

module.exports.renderVideoAll = (req, res) => {
    let fileDetails = handleDb.getall()
    if (!fileDetails) return res.render('errors/404', { data: { code: 0, err: 'No Data Found' } })

    // const storedFileName = fileDetails.path.split('/')[1]
    // const videoDetails = fileDetails.details || 'NA'
    // const videoName = fileDetails.name
    res.status(200).render('allvideopage', { fileDetails })
}