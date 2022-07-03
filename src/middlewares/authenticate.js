const axios = require('axios')

require('dotenv').config()

const {
    AUTH_SERVICE
} = process.env

module.exports = () => {
    return (async (req, res, next) => {
        let { cookie } = req.headers

        if(!cookie) {
            cookie = null
        }
        
        try {
            const { data } = await axios({
                method: 'get',
                headers: {
                    cookie: cookie
                },
                url: `http://${AUTH_SERVICE}/getUser/`
            })

            req.session = data
        } catch (err) {
            console.log(`Error authenticating: ${err}`)
        }
        
        next()
    })
}