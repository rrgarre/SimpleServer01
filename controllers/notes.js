const notesRouter = require('express').Router()
const Note = require('../models/note')
const User =require('../models/user')
const usersRouter = require('./users')


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

// AÑADIR
notesRouter.post('/', async (request, response, next)=>{
  const body = request.body
  const user = await User.findById(body.userId)

  // Nueva nota con el MODELO Note
  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
    user: user._id
  })

  // note.save()
  //   .then(result=>{
  //     response.json(result)
  //   })
  //   .catch(error=>next(error))
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote)
  await user.save() 

  response.json(savedNote)
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
notesRouter.put('/:id', (request, response, next)=>{
  const id = request.params.id
  const noteChanged = request.body
  Note.findByIdAndUpdate(id, noteChanged, {new: true})
    .then(result=>{
      response.json(result)
    })
    .catch(error=>next(error))
})


module.exports = notesRouter