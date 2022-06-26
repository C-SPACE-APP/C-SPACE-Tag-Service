module.exports = {
    databaseConnection: require('./connect'),
    TagRepository: require('./repository').TagRepository,
    FavoriteRepository: require('./repository').FavoriteRepository,
    DBUtils: require('./utils'),
}