const TagService = require('../services')

const { Authorize } = require('../middlewares')

const TagAPI = (app) => {

    const service = new TagService()

    app.post('/favorite', Authorize(), async (req, res) => {     // to be implemented after connecting to FE
    // app.post('/favorite', async (req, res) => {
        const { _id:user } = req.session.User      // to be implemented after connecting to FE
        // const user = '6294a118c6308c7bb323dcff'   // hard coded user id
        const { tagName } = req.body

        try {
            const { status, message, payload } = await service.UpdateFavorite({ tagName, user })
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in POST favorite: ${err}`)
            return res.status(500).json({ err })
        }
    })
    
    /** */
    app.post('/', Authorize(), async (req, res) => {     // to be implemented after connecting to FE
    // app.post('/', async (req, res) => {
        const { _id:author } = req.session.User      // to be implemented after connecting to FE
        // const author = '6294a121c6308c7bb323dd00'   // hard coded user id
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
    // app.get('/', Authorize(), async (req, res) => {
    app.get('/', async (req, res) => {
        const { search, limit, page, omit } = req.query
        const { id } = req.body
        const { _id:author } = req.session.User      // to be implemented after connecting to FE
        // const author = '6294a121c6308c7bb323dd00'   // hard coded user id

        try {
            if(id) {
                const { status, message, payload } = await service.GetTagsOfArrayTagName(id)
                return res.status(status).json({ message, payload })
            }
            else {
                const { status, message, payload } = await service.GetTags({ search, limit, page, author, omit })
                return res.status(status).json({ message, payload })
            }
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
    app.get('/favorite/:id', Authorize(), async (req, res) => {
    // app.get('/favorite/:id', async (req, res) => {
        const { limit, page } = req.query
        const { id } = req.params

        try {
            const { status, message, payload } = await service.GetFavorites({ user:id, limit, page })
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET favorite tags: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/popular', async (req, res) => {
        const { limit, page } = req.query
        try {
            const { status, message, payload } = await service.GetPopular({ limit, page })
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET popular tags: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/verify', async (req, res) => {
        const { tags } = req.body
        try {
            const { status, message, payload } = await service.GetTagsOfArrayTagName(tags)
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET verify tag: ${err}`);
            return res.status(500).json({ err })
        }
    })

    /** */
    app.get('/:id', Authorize(), async (req, res) => {
        const { id } = req.params
        const { _id:user } = req.session.User      // to be implemented after connecting to FE
        // const user = '6294a121c6308c7bb323dd00'   // hard coded user id

        try {
            const { status, message, payload } = await service.GetTag(id, user)
            return res.status(status).json({ message, payload })
        } catch(err) {
            console.log(`Error in GET one tag: ${err}`);
            return res.status(500).json({ err })
        }
    })

}

module.exports = TagAPI