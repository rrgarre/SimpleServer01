const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET_FOR_JWT } = require('../utils/config')

loginRouter.get('/', (request, response) => {
  response.send('Desde controlador de Login')
})

loginRouter.get('/:token', (request, response) => {
  const token = request.params.token
  // return response.status(201).end()
  try {
    const validToken = jwt.verify(token, SECRET_FOR_JWT)
    return response.status(202).send('Correcto')
  } catch (error) {
    return response.status(401).send('Caducado')
  }
  // validToken
  //   ? response.status(200).end()
  //   : response.status(402).end()
})

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
  
  if(!(passwordCorrect && user)){
    return response.status(401).json({error: 'Contraseña o usuario incorrectos'})
  }
  
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(
    userForToken, 
    SECRET_FOR_JWT,
    {expiresIn: 600}
  )
  console.log(token)
  
  
  response
    .status(200)
    .send({
      token: token, 
      username: user.username, 
      name: user.name
    })
})

module.exports = loginRouter