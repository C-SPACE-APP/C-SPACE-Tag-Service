const { Favorite } = require('../models')

class FavoriteRepository {
    /** */
    async CreateFavorite(favoriteData) {
        try {
            const newFavorite = await new Favorite(favoriteData)
            const favorite = await newFavorite.save()
            return(favorite)
        } catch (err) {
            console.log(`Error in FavoriteRepository: CreateFavorite: ${err}`)
            throw err
        }
    }

    /** */
    async DeleteFavorite(favoriteData) {
        try {
            const favorite = await Favorite.deleteOne(favoriteData)
            return favorite
        } catch(err) {
            console.log(`Error in UserRepository: DeleteUser: ${err}`)
            throw err
        }
    }

    /** */
    async FindFavorite({tagName, user}) {
        try {
            const favorite = await Favorite.findOne({ tagName, user })
            return favorite
        } catch(err) {
            console.log(`Error in FavoriteRepository: FindFavorite: ${err}`)
            throw err
        }
    }

    /** */
    async FindFavorites({ user, count, page }) {
        const limit = count || 10
        const skip = page ? (page-1)*limit : 0

        try {
            const favorites = await Favorite.find({ user })
            .sort({ tagName: 1 })
            .skip(skip)
            .limit(limit)
            .lean()

            const resultCount = await Favorite.countDocuments({ user })

            const lastPage = Math.floor(resultCount/limit) + (resultCount%limit ? 1 : 0) || 1

            return { tags:favorites, resultCount, lastPage }
        } catch(err) {
            console.log(`Error in FavoriteRepository: FindFavorites: ${err}`)
            throw err
        }
    }
}

module.exports = FavoriteRepository