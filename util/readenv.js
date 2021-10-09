const fs = require('fs')

const setENV = str => {
    if (str) {
        const envArray = str.split('\n')
        envArray.forEach((item, i) => {
            if (item) process.env[item.split('=')[0].trim()] = item.split('=')[1].trim()
        })
    }
}

const config = () => {
    const fileName = '.env'
    try {
        result = fs.readFileSync(fileName, { encoding: 'utf8' })
        setENV(result)
    } catch (error) { console.log('error : ', error) }
}

module.exports = config