const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()
const multer = require('multer')
const includeMulter = multer().any()
require('./util/readenv')()

const shouldParseRequest = req => {
    const currentMethod = req.method
    const currentRoute = req.originalUrl

    const restrictedRoutes = [{ method: 'POST', originalUrl: '/' }]

    for (let i = 0; i < restrictedRoutes.length; i++) {
        if (restrictedRoutes[i].method == currentMethod && restrictedRoutes[i].originalUrl == currentRoute) {
            return false
        }
    }
    return true
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => shouldParseRequest(req) ? includeMulter(req, res, next) : next())

app.use('/', require('./routes'))

app.get('*', (req, res) => res.status(404).render('errors/404', { data: { code: 404, url: req.originalUrl } }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server Is Listening At Port Number ${PORT}`))