const { FavoriteRepository, TagRepository, DBUtils } = require('../database')
const axios = require('axios')

require('dotenv').config()

const {
    USER_SERVICE
} = process.env

class TagService {

    constructor() {
        this.tagRepository = new TagRepository()
        this.faveRepository = new FavoriteRepository()
        this.utils = new DBUtils()
    }
    
    /** */
    async GetFavorites({ user, limit, page} ) {
        const objID = await this.utils.validID(user)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${user}`
        })

        try {
            const { tags, resultCount, lastPage } = await  this.faveRepository.FindFavorites({ user, count:parseInt(limit), page:parseInt(page) })
            return({
                status: 200,
                payload: { 
                    tags,
                    resultCount,
                    lastPage
                }
            })
        } catch(err) {
            console.log(`Error in TagService: GetFavorites: ${err}`)
            throw err
        }
    }

    /** */
    async UpdateFavorite(favoriteData) {
        const {
            tagName,
            user
        } = favoriteData

        const objID = await this.utils.validID(user)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${user}`
        })

        try {
            const existing = await this.faveRepository.FindFavorite({ tagName, user })
            if(existing) {
                const favorite = await this.faveRepository.DeleteFavorite({ tagName, user })
                
                if(!favorite) return({
                    status: 400,
                    message: `Unable to delete ${tagName} from favorites`
                })

                return({
                    status: 200,
                    message: `Successfully deleted ${tagName}`,
                    favorite
                })
            }
        } catch(err) {
            console.log(`Error in FavoriteRepository: FindFavorite: ${err}`)
            throw err
        }

        try {
            const favorite = await this.faveRepository.CreateFavorite({ tagName, user })

            if(!favorite) return({
                status: 400,
                message: `Unable to create Favorite`
            })

            return({
                status: 200,
                payload: { favorite }
            })
        } catch(err) {
            console.log(`Error in TagService: AddFavorite: ${err}`)
            throw err
        }
    }

    /** */
    async GetPopular({ limit, page } = {}) {
        try {
            const { tags, resultCount, lastPage } =  await this.faveRepository.FindPopular({ count:parseInt(limit), page:parseInt(page) })
            
            return({
                status: 200,
                payload: { 
                    tags,
                    resultCount,
                    lastPage
                }
            })
        } catch(err) {
            console.log(`Error in TagService: GetPopular: ${err}`)
            throw err
        }
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
            const existing = await this.tagRepository.FindTag({ tagName })
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
            const tag = await this.tagRepository.CreateTag({
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
    async GetTag(id, user) {
        const objID = await this.utils.validID(id)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${id}`
        })

        try {
            let tag = await this.tagRepository.FindTag({ id })

            if(!tag) return({
                status: 400,
                message: `Tag ${id} not found`
            })

            try {
                const { data } = await axios({
                    method: 'post',
                    url: `http://${USER_SERVICE}/app-events/`,
                    data: {
                        event: 'GET_USER',
                        data: {
                            userId: tag.author
                        }
                    }
                })
                if(data.payload.user) tag.author = data.payload.user
            } catch(err) {}

            const favorite = await this.faveRepository.FindFavorite({ tagName: tag.tagName, user })
            
            tag['favorite'] = (favorite ? true : false) 

            return({
                status: 200,
                payload: { tag }
            })
        } catch(err) {
            throw `Error searching for Tag. Error: ${err}`
        }
    }

    /** */
    async GetTags({ search, limit, page, author }) {
        const objID = await this.utils.validID(author)
        if(!objID) return({
            status: 400,
            message: `Invalid ID: ${author}`
        })

        let { search:pattern } = await this.utils.sanitize({ search })

        if(!pattern) pattern = ".*"

        try {
            const { tags, resultCount, lastPage } = await this.tagRepository.FindTags({ pattern, count:parseInt(limit), page:parseInt(page) })
            
            for(const tag of tags) {
                const { tagName } = tag

                const tagData = await this.faveRepository.FindFavorite({ tagName, user:author })

                tag['favorite'] = tagData ? true : false
            }
            
            return({
                status: 200,
                payload: { 
                    tags,
                    resultCount,
                    lastPage
                }
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
            const tags = await this.tagRepository.FindTagsByAuthor(authorID)

            for(const tag of tags) {
                const { tagName } = tag

                const tagData = await this.faveRepository.FindFavorite({ tagName, user:authorID })

                tag['favorite'] = tagData ? true : false
            }

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
     async GetTagsOfArray(ids) {
        for( const id of ids) {
            const objID = await this.utils.validID(id)
            if(!objID) return({
                status: 400,
                message: `Invalid ID: ${id}`
            })
        }
        
        try {
            const tags = await this.tagRepository.FindTagsOfArray(ids)
            return({
                status: 200,
                payload: { tags }
            })
        } catch(err) {
            console.log(`Error in TagService: GetTagsOfArray: ${err}`)
            throw err
        }
    }

    /** */
    async GetTagsOfArrayTagName(tagNames) {
        if(tagNames.length <= 0) return({
            status: 400,
            message: `No tagNames provided`
        })

        try {
            const tags = await this.tagRepository.FindTagsOfArrayTagName(tagNames)
            const resultLen = tags.length
            const inputLen = tagNames.length
            const message = (resultLen === inputLen ? null : `${resultLen} out of ${inputLen} tags found`)
            const valid = (resultLen === inputLen ? true : false)

            return({
                status: 200,
                message,
                payload: { tags, valid }
            })
        } catch(err) {
            console.log(`Error in TagService: GetTagsOfArrayTagName: ${err}`)
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
            case 'GET_TAGS_OF_ARRAY':
                return this.GetTagsOfArray(id)
            case 'GET_TAGS_OF_ARRAY_TAGNAMES':
                return this.GetTagsOfArrayTagName(id)
            default:
                return({
                    status: 400,
                    message: `No event ${event} available`
                })
        }
    }

}

module.exports = TagService