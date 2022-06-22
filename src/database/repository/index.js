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

    /** */
    async FindTag({id, tagName}) {
        try {
            const tag = await Tag.findOne({
                $or: [
                    { _id: id },
                    { tagName }
                ]
            })
            return tag
        } catch(err) {
            console.log(`Error in TagRepository: FindTag: ${err}`)
            throw err
        }
    }

    /** */
    async FindTags(pattern) {
        try {
            const tags = await Tag.find({
                tagName: {$regex: new RegExp(pattern), $options: 'i'}
            })
            return tags
        } catch(err) {
            console.log(`Error in TagRepository: FindTags: ${err}`)
            throw err
        }
    }
}

module.exports = TagRepository