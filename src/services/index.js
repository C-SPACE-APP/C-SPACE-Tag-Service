const { TagRepository, DBUtils } = require('../database')
const mongoose = require('mongoose')
const axios = require('axios')

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
            const existing = await this.repository.FindTag({ tagName })
            if(existing) return({
                status: 200,
                message: `Tag ${tagName} already exist`,
                payload: { tag: existing }
            })
        } catch(err) {
            console.log(`Error in TagRepository: AddTag: ${err}`)
            throw err
        }

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
                payload: { tag }
            })
        } catch(err) {
            console.log(`Error in TagService: AddTag: ${err}`)
            throw err
        }
    }

    /** */
    async GetTag(id) {
        const objID = await this.utils.validID(id)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${id}`
        })

        try {
            let tag = await this.repository.FindTag({ id })

            if(!tag) return({
                status: 400,
                message: `Tag ${id} not found`
            })

            const { data } = await axios({
                method: 'post',
                url: 'http://localhost:3002/app-events/',
                data: {
                    event: 'GET_USER',
                    data: {
                        userId: tag.author
                    }
                }
            })

            if(data.user) tag.author = data.user

            return({
                status: 200,
                payload: { tag }
            })
        } catch(err) {
            throw `Error searching for Tag. Error: ${err}`
        }
    }

    /** */
    async GetTags(filter) {
        let { filter:pattern } = await this.utils.sanitize({ filter })

        if(!pattern) pattern = ".*"

        try {
            const tags = await this.repository.FindTags(pattern)

            return({
                status: 200,
                payload: { tags }
            })
        } catch(err) {
            console.log(`Error in TagService: GetTags: ${err}`)
            throw err
        }
    }

    /** */
    async GetTagsByAuthor(authorID) {
        const objID = await this.utils.validID(authorID)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${authorID}`
        })

        try {
            const tags = await this.repository.FindTagsByAuthor(authorID)
            return({
                status: 200,
                payload: { tags }
            })
        } catch(err) {
            console.log(`Error in TagService: GetTagsByAuthor: ${err}`)
            throw err
        }
    }

    /** */
    async SubscribeEvents(payload) {
        const { event, data } = payload
        const { id } = data

        switch(event) {
            case 'GET_TAG':
                return this.GetTag(id)
            default:
                return({
                    status: 400,
                    message: `No event ${event} available`
                })
        }
    }

}

module.exports = TagService