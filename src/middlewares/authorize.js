module.exports = () => {
    return (async (req, res, next) => {
       if(!req.session.User) {
        return res.status(401).json({
            message: `Not logged in`
        })
       }

       next()
    })
}