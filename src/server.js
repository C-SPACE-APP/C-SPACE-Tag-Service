const cors  = require('cors')
const express = require('express')

const { tag, appEvents } = require('./api')
const { Authenticate } = require('./middlewares')

module.exports = async (app) => {
    app.use(cors())
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())

    app.use(Authenticate())

    appEvents(app)
    
    tag(app)
}