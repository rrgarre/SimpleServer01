const notesRouter = require('express').Router()
const Note = require('../models/note')
const User =require('../models/user')
const usersRouter = require('./users')
const jwt = require('jsonwebtoken')
const util = require('../utils/config')


// GETS
// notesRouter.get('/', (request, response)=>{
//   Note.find({}).then(result=>{
//     // console.log(result)
//     response.json(result)
//   })
// })
notesRouter.get('/', async (request, response)=>{
  let result = await Note.find({}).populate('user', {username: 1, name: 1})
  return response.json(result)
})

notesRouter.get('/:id', (request, response, next)=>{
  const id = request.params.id
  Note.findById(id).populate('user', {username: 1, name: 1})
    .then(result=>{
      if(result){
        response.json(result)
      }else{
        response.status(404).send({error: "No existe la nota"})
      }
    })
    .catch(error=>next(error))
})

// FUNCION PARA RECUPERAR EL TOKEN DE LA REQUEST
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}
// AÑADIR
notesRouter.post('/', async (request, response, next)=>{
  const body = request.body
  
  const token = getTokenFrom(request)
  
  let decodedToken
  try {
    decodedToken = jwt.verify(token, util.SECRET_FOR_JWT)
    console.log(decodedToken)
    
  } catch (error) {
    next(error)
    // return response.status(401).json({error:'Error de token'})
    return response.status(402)
  }
  
  const user = await User.findById(decodedToken.id)

  if(!token || !decodedToken.id || !user)
    return response.status(401).json({error: 'token missing or invalid'})

  // Nueva nota con el MODELO Note
  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
    user: user._id
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote)
    await user.save() 
    response.json(savedNote)
  } catch (error) {
    console.log('ERROR')
    // next(error)
    return response.status(401).json({error:'Error al añadir la nota'})
  }

})

// BORRADO
notesRouter.delete('/:id', (request, response, next)=>{
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

// PUTS
notesRouter.put('/:id', async (request, response, next)=>{
  const id = request.params.id
  const noteChanged = request.body
  
  console.log('XXXXXXXX NOTA MODIFICADA', noteChanged)
  const notaPescada = await Note.findById(id)
    .populate('user', {username: 1, name: 1})
    
  console.log('XXXXXXX NOTA PESCADA', notaPescada)
  const newNoteChanged = {...notaPescada._doc, important: !notaPescada.important}
  console.log('XXXXXXX NEW NOTA PESCADA', newNoteChanged)

  try {
    const result = await Note.findByIdAndUpdate(id, newNoteChanged, {new: true})
    console.log('XXXXXXX NOTA ALMACENADA EN DDBB', result)
    return response.json(result)
  } catch (error) {
    next(error)
  }

  // Note.findByIdAndUpdate(id, noteChanged, {new: true})
  //   .then(result=>{
  //     console.log('XXXXXXXXXXXXXXXXXXXXX')
  //     response.json(result)
  //   })
  //   .catch(error=>next(error))
})


module.exports = notesRouter