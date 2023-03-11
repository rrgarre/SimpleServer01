const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response)=>{
    let result = await User.find({})
    // return response.send('Hola desde UserController')
    return response.json(result)
})

usersRouter.post('/', (request, response)=>{
    const body = request.body
    
    // bcrypt.hash(body.passwordHash, 10).then((currentHash)=>{
    //     const user = new User({
    //         username: body.username,
    //         name: body.name,
    //         passwordHash: currentHash
    //     })
    //     user.save()
    //         .then(result => response.json(result))
    // })

    const hash = bcrypt.hashSync(body.passwordHash, 10)
    
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: hash
    })

    user.save()
        .then(result => response.json(result))
    
})

module.exports = usersRouter