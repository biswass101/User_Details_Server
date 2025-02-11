const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const userRouter = require('express').Router()
const saltRouns = 10

//get all users
userRouter.get('/', (req, res) => {
    res.status(200).send("All Users here")
})


//register Route
let findUser;
userRouter.post('/register', async (req, res) => {
    try {
        findUser = await User.findOne({ username: req.body.username })
        if (findUser) {
            return res.status(400).send("User name already exists, Try Another name")
        }

        bcrypt.hash(req.body.password, saltRouns, async (err, hash) => {
            const body = req.body
            const newUser = new User({
                first_name: body.first_name,
                last_name: body.last_name,
                username: body.username,
                email: body.email,
                password: hash
            })

            await newUser.save()
                .then((user) => {
                    res.status(201).json({
                        success: true,
                        message: 'user is created successfully',
                        user: {
                            findUser
                        }

                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        message: 'user is not created!!',
                        err: err
                    })
                })
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

//login route
userRouter.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })

    if (!user) {
        return res.status(401).send({
            success: false,
            message: "User is not found"
        })
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({
            success: false,
            message: "Incorrect password"
        })
    }

    const payload = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '2d'
    })

    return res.status(200).send({
        success: true,
        message: "User is logged in successfully",
        token: "Bearer " + token
    })
})


// profile route
userRouter.get('/profile', passport.authenticate('jwt', { session: false }),
    async (req, res, user) => {
        try {
            const findUser = await User.findOne({ username: req.body.username }).select('-password')
            return res.status(200).send({
                success: true,
                userDetails: findUser
            })
        } catch (error) {
            
            return res.status(401).send({
                success: false,
                error: info.message
            })
        }
    }
)

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

