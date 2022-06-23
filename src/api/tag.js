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
            const {status, message, payload } = await service.AddTag({tagName, description, author})
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in POST tag: ${err}`)
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/', Authorize(), async (req, res) => {
        const { search, limit, page } = req.query

        try {
            const { status, message, payload } = await service.GetTags({ search, limit, page })
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET many tags: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/author/:id', Authorize(), async (req, res) => {
        const { id } = req.params

        try {
            const { status, message, payload } = await service.GetTagsByAuthor(id)
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET tags by author: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/:id', Authorize(), async (req, res) => {
        const { id } = req.params

        try {
            const { status, message, payload } = await service.GetTag(id)
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET one tag: ${err}`);
            return res.status(500).json({ err })
        }
    })

}

module.exports = TagAPI