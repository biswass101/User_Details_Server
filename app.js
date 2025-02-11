require('./config/db')

const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/user.route')
const passport = require('passport')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(passport.initialize())
require('./config/passport')

app.use('/user', userRouter)


module.exports = app