const { Tag } = require('../models')

class TagRepository {
    /** */
    async CreateTag(tagData) {

        try {
            const newTag = await new Tag(tagData)
            const tag = await newTag.save()
            return(tag)
        } catch (err) {
            console.log(`Error in TagRepository: CreateTag: ${err}`)
            throw err
        }
    }
}

module.exports = TagRepository