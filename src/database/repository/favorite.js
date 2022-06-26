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
}

module.exports = FavoriteRepository