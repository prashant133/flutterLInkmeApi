const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SignIn = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            bcrypt.compare(req.body.password, user.password, (error, success) => {
                if (error) return res.status(500).json({ error: error.message })
                if (!success) return res.status(400).json({ error: 'Password doesnot match' })
                const payload = {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,



                    role: user.role
                }
                jwt.sign(
                    payload, process.env.SECRET,
                    { expiresIn: '1D' },
                    (error, token) => {
                        if (error) return res.status(500).json({ error: error.message })
                        res.json({ status: 'success', token: token, user: user })
                    }
                )
            })
        }).catch(next)
}

const SignUp = (req, res, next) => {
    const { fullName, email, password } = req.body
    User.findOne({ email: email })
        .then((user) => {
            if (user) return res.status(400).json({ error: 'Duplicate Email' })
            bcrypt.hash(password, 10, (error, hash) => {
                if (error) return res.status(500).json({ error: error.message })
                User.create({ email, password: hash, fullName })
                    .then((user) => {
                        res.status(201).json(user)
                    }).catch(next)

            })
        }).catch(next)
}




module.exports = {
    SignIn,
    SignUp,

}