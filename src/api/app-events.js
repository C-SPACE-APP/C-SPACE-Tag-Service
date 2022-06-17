const TagService = require('../services')

module.exports = (app) => {
    const service = new TagService()

    app.use('/app-events', async (req, res) => {
        try {
            const { event, data } = req.body

            if(!event || !data) return res.status(400).json({ message: `Missing even or data` })

            const response = await service.SubscribeEvents({event, data})

            return res.json(response)
        } catch(err) {
            console.log(`User app event error: ${err}`);
            return res.status(500).json({ message: `User app event error: ${err}` })
        }
    })
}