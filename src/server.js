const cors  = require('cors')
const express = require('express')

const { tag, appEvents } = require('./api')
const { Authenticate } = require('./middlewares')

module.exports = async (app) => {
    app.use(cors({
        credentials: true,
        origin: [
            'http://localhost:3000', 
            'http://localhost:3001', 
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:3006',
            'http://localhost:3007',
            'http://localhost:3008'
        ]
    }))
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())

    app.use(Authenticate())

    appEvents(app)
    
    tag(app)
}