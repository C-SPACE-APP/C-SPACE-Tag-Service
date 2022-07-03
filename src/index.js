const express = require('express')
const { databaseConnection } = require('./database')
const mongoose = require('mongoose')
const server = require('./server')

const start = async () => {
    const app = express()

    try {
        await databaseConnection(mongoose)
    } catch(err) {
        return
    }

    await server(app)

    const PORT = process.env.PORT || 3004

    app.listen(PORT, (err) => {
        if(err) console.log(`Error starting app: ${err}`)
        else console.log(`Tag Service started listening on port ${PORT}`)
    })
}

start()