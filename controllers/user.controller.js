const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const saltRouns = 10
const handleAllUsers = async(req, res) => {
    try {
        const allUser = await User.find().select('-__v')
        res.status(200).json({
            success: true,
            allUser
        })
    } catch (error) {
        res.status(404).json({
            success: false,
        })
    }
}

const handleDeleteUser = async (req, res) => {
    try {
        const findUser = await User.findByIdAndDelete({_id: req.params.id})
        if(!findUser) {
            return res.status(400).json({
                success: false,
                message: "User Not Deleted"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "User Deleted"
            })
        }
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "User not found to be deleted"
        })
    }
}

const handleRegister = async (req, res) => {
    try {
        const findUser = await User.findOne({ username: req.body.username })
        if (findUser) {
            return res.status(400).json({
                sucess: false,
                message: "User name already exists, Try Another name"
            })
        }

        bcrypt.hash(req.body.password, saltRouns, async (err, hash) => {
            const body = req.body
            const newUser = new User({
                first_name: body.first_name,
                last_name: body.last_name,
                username: body.username,
                email: body.email,
                password: req.body.password === "" ? req.body.password : hash
            })

            await newUser.save()
                .then((user) => {
                    res.status(201).json({
                        success: true,
                        message: 'user is created successfully',
                        user
                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        message: 'user is not created!!',
                        error : err
                    })
                })
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
}

const handleLogin = async (req, res) => {
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
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '2d'
    })

    return res.status(200).send({
        success: true,
        message: "User is logged in successfully",
        token: "Bearer " + token
    })
}

const handleProfile = (req, res) => {
    try {
        return res.status(200).send({
            success: true,
            message: "Authorized",
            userDetails: req.user
        })
    } catch (error) {
        return res.send({
            success: true,
            message: "Authorized",
        })
    }
}

module.exports = { handleAllUsers, handleDeleteUser, handleRegister, handleLogin, handleProfile }