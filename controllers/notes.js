const notesRouter = require('express').Router()
const Note = require('../models/note')


// GETS
notesRouter.get('/', (request, response)=>{
  Note.find({}).then(result=>{
    // console.log(result)
    response.json(result)
  })
})

notesRouter.get('/:id', (request, response, next)=>{
  const id = request.params.id
  Note.findById(id)
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
notesRouter.post('/', (request, response, next)=>{
  const body = request.body
  // Nueva nota con el MODELO Note
  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
  })

  note.save()
    .then(result=>{
      response.json(result)
    })
    .catch(error=>next(error))
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