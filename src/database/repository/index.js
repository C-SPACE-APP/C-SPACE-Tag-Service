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
            }).lean()
            return tag
        } catch(err) {
            console.log(`Error in TagRepository: FindTag: ${err}`)
            throw err
        }
    }

    /** */
    async FindTags({ pattern, count, page }) {
        const limit = count || 10
        const skip = page ? (page-1)*limit : 0

        try {
            const tags = await Tag.find({
                tagName: {$regex: new RegExp(pattern), $options: 'i'}
            })
            .sort({ tagName: 1 })
            .skip(skip)
            .limit(limit)
            .lean()
            
            const resultCount = await Tag.countDocuments({
                tagName: {$regex: new RegExp(pattern), $options: 'i'}
            })

            const lastPage = Math.floor(resultCount/limit) || 1

            return { tags, resultCount, lastPage }
        } catch(err) {
            console.log(`Error in TagRepository: FindTags: ${err}`)
            throw err
        }
    }

    /** */
    async FindTagsByAuthor(author) {
        try {
            const tags = await Tag.find({
                author
            })
            return tags
        } catch(err) {
            console.log(`Error in TagRepository: FindTagsByAuthor: ${err}`)
            throw err
        }
    }
}

module.exports = TagRepository