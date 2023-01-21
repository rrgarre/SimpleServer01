// Rama de DESARROLLO

require('dotenv').config()
// const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
// Importamos los Middlewares
const cleanerConsole = require('./middlewares/cleanerConsole')
const unknowEndpoint = require('./middlewares/unknowEndpoint')
const errorHandler = require('./middlewares/errorHandler')
// Importamos el Modelo
const Note = require('./models/note')

// Arranca servidor
const app = express()

// MIDDLEWARES
// app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('bodyRequest', (request, response)=>{
  return JSON.stringify(request.body)
})
// Y llamamos al middleware Morgan con un mensaje formateado con los tokkens que queremos
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyRequest'))


app.use(cleanerConsole)

// GETS
app.get('/', (request, response)=>{
  response.send(
    // '<h1>API para la app de notas</h1><p><a href="api.garredev.online:3001/api/notes">/api/notes</a></p>'
    `<h1>API para la app de notas</h1><p><a href="/api/notes">/api/notes</a></p>`
    )
})

app.get('/api/notes', (request, response)=>{
  Note.find({}).then(result=>{
    console.log(result)
    response.json(result)
  })
})

app.get('/api/notes/:id', (request, response, next)=>{
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
app.post('/api/notes/', (request, response, next)=>{
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
app.delete('/api/notes/:id', (request, response, next)=>{
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

// PUTS
app.put('/api/notes/:id', (request, response, next)=>{
  const id = request.params.id
  const noteChanged = request.body
  Note.findByIdAndUpdate(id, noteChanged, {new: true})
    .then(result=>{
      response.json(result)
    })
    .catch(error=>next(error))
})

// const PORT = 3001
const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server running on port:${PORT}`)
})


// MIDDLEWARES

app.use(unknowEndpoint)
app.use(errorHandler)