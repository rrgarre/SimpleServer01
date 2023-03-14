const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')



usersRouter.get('/', async (request, response)=>{
    let result = await User.find({})
    return response.json(result)
})

usersRouter.post('/', async (request, response, next)=>{
    const body = request.body
    const saltRounds = 10
    
    const hash = await bcrypt.hash(body.passwordHash, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: hash
    })
    try {
        savedUser = await user.save()
        response.json(savedUser)
    } catch (error) {
        next(error)
        // response.status(404).end()
    }
})

module.exports = usersRouter