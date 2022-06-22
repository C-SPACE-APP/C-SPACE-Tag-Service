const { TagRepository, DBUtils } = require('../database')
const mongoose = require('mongoose')

class TagService {

    constructor() {
        this.repository = new TagRepository()
        this.utils = new DBUtils()
    }

    /** */
    async AddTag(tagData) {
        const {
            tagName,
            description,
            author
        } = tagData

        const objID = await this.utils.validID(author)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${id}`
        })

        try {
            const tag = await this.repository.CreateTag({
                tagName,
                description,
                author
            })

            if(!tag) return({
                status: 400,
                message: `Unable to create Tag`
            })

            return({
                status: 200,
                tag
            })
        } catch(err) {
            console.log(`Error in TagService: AddTag: ${err}`)
            throw err
        }
    }

}

module.exports = TagService