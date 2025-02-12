const passport = require('passport')

const runJWTauthenticator = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        console.log(user)
        req.user = user
        
    })
    next()
}

module.exports = {runJWTauthenticator}