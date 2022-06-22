const TagService = require('../services')

const { Authorize } = require('../middlewares')

const TagAPI = (app) => {

    const service = new TagService()

    /** */
    // app.post('/', Authorize(), async (req, res) => {     // to be implemented after connecting to FE
    app.post('/', async (req, res) => {
        // const { _id:author } = req.session.User      // to be implemented after connecting to FE
        const author = '6294a121c6308c7bb323dd00'   // hard coded user id
        const { tagName, description } = req.body

        try {
            const {status, message, tag } = await service.AddTag({tagName, description, author})
            return res.status(status).json({ message, tag })
        } catch(err) {
            console.log(`Error in POST tag: ${err}`)
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/', Authorize(), async (req, res) => {
        const { search } = req.query

        try {
            const { status, message, tags } = await service.GetTags(search)
            return res.status(status).json({ message, tags })
        } catch(err) {
            console.log(`Error in GET many tags: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/:id', Authorize(), async (req, res) => {
        const { id } = req.params

        try {
            const { status, message, tag } = await service.GetTag(id)
            return res.status(status).json({ message, tag })
        } catch(err) {
            console.log(`Error in GET one tag: ${err}`);
            return res.status(500).json({ err })
        }
    })

}

module.exports = TagAPI