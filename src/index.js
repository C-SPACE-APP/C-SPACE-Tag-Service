const express = require('express')
const { databaseConnection } = require('./database')
const server = require('./server')

const start = async () => {
    const app = express()

    try {
        await databaseConnection()
    } catch(err) {
        return
    }

    await server(app)

    const PORT = process.env.PORT || 3004

    app.listen(PORT, (err) => {
        if(err) console.log(`Error starting app: ${err}`)
        else console.log(`Started listening on port ${PORT}`)
    })
}

start()