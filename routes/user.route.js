const passport = require('passport')
const { runJWTauthenticator } = require('../config/passportAuth')
const { handleAllUsers, handleRegister, handleLogin, handleProfile } = require('../controllers/user.controller')
const userRouter = require('express').Router()

//get all users
userRouter.get('/', handleAllUsers)

//register Route
userRouter.post('/register', handleRegister)

//login route
userRouter.post('/login', handleLogin)

// profile route
// passport.authenticate('jwt', { session: false })
userRouter.get('/profile', passport.authenticate('jwt', { session: false }),  handleProfile)

// userRouter.get('/profile', (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, async (err, user, info) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Internal Server Error",
//                 error: err.message
//             });
//         }

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: info?.message || "Unauthorized access. Please provide a valid token."
//             });
//         }

//         try {
//             const findUser = await User.findOne({ username: user.username }).select('-password');
//             return res.status(200).json({
//                 success: true,
//                 message: "User profile retrieved successfully!",
//                 userDetails: findUser
//             });
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Error retrieving user profile.",
//                 error: error.message
//             });
//         }
//     })(req, res, next);
// });


module.exports = userRouter

