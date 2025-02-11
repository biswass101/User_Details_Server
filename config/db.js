require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)
 .then(() => console.log("db is connected"))
 .catch(err => console.log(err.message))