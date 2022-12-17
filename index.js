<<<<<<< HEAD
// Rama de PRODUCCIÓN

const { request, response } = require('express')
=======
// Rama de DESARROLLO

require('dotenv').config()
// const { request, response } = require('express')
>>>>>>> dev
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
// Importamos el Modelo
const Note = require('./models/note')


// MIDDLEWARES
// app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('bodyRequest', (request, response)=>{
  return JSON.stringify(request.body)
})
// Y llamamos al middleware Morgan con un mensaje formateado con los tokkens que queremos
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyRequest'))
// app.use(morgan('combined'))

// Funcion para generar nueva ID
const getNewId = ()=>{
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n=>n.id))
    : 0
  return maxId+1
}

// GETS
app.get('/', (request, response)=>{
  response.send(
    '<h1>API para la app de notas</h1><p>empezamos aquí...</p>'
    )
})

app.get('/api/notes', (request, response)=>{
  Note.find({}).then(result=>{
    console.log(result)
    response.json(result)
  })
})

app.get('/api/notes/:id', (request, response)=>{
  const id = request.params.id
  Note.findById(id)
    .then(result=>{
      response.json(result)
    })
    .catch(error=>{
      console.log('No se encuentra la nota', error.message)
      response.status(404).end()
    })
})

// AÑADIR
app.post('/api/notes/', (request, response)=>{
  const body = request.body
  if(!body.content){
    return response.status(400).json({error: "Falta contenido de la nota"})
  }

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
})

// BORRADO
app.delete('/api/notes/:id', (request, response)=>{
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result=>{
      response.status(204).end()
    })
})

// PUTS
app.put('/api/notes/:id', (request, response)=>{
  const id = request.params.id
  const noteChanged = request.body
  Note.findByIdAndUpdate(id, noteChanged)
    .then(result=>{
      response.json(noteChanged)
    })
})


// const PORT = 3001
const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server running on port:${PORT}`)
})