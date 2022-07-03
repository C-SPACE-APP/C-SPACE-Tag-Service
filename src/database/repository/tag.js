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
    async FindTags({ pattern, count, page, omit }) {
        const limit = count || 10
        const skip = page ? (page-1)*limit : 0

        try {
            const tags = await Tag.find({
                // tagName: {$regex: new RegExp(pattern), $options: 'i'}
                // tagName: {$and: [
                //     { $regex: new RegExp(pattern), $options: 'i' },
                //     { $nin: omit }
                // ]}
                $and: [
                    { tagName: {$regex: new RegExp(pattern), $options: 'i'} }, 
                    { tagName: { $nin: omit } }
                ]
            })
            .sort({ tagName: 1 })
            .skip(skip)
            .limit(limit)
            .lean()
            
            const resultCount = await Tag.countDocuments({
                tagName: {$regex: new RegExp(pattern), $options: 'i'}
            })

            const lastPage = Math.floor(resultCount/limit) + (resultCount%limit ? 1 : 0) || 1

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

    /** */
    async FindTagsOfArray(ids) {
        try {
            const tags = await Tag.find()
            .where('_id')
            .in(ids)

            return tags
        } catch(err) {
            console.log(`Error in TagRepository: FindTagsOfArray: ${err}`)
            throw err
        }
    }
    
    /** */
    async FindTagsOfArrayTagName(tagNames) {
        try {
            const tags = await Tag.find()
            .where('tagName')
            .in(tagNames)

            return tags
        } catch(err) {
            console.log(`Error in TagRepository: FindTagsOfArrayTagName: ${err}`)
            throw err
        }
    }
}

module.exports = TagRepository