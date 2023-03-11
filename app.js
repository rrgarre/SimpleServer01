// Rama de DESARROLLO

const config = require('./utils/config')
const cleannerCollections = require('./utils/cleannerCollections')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')

// Importamos los Middlewares personales
const cleanerConsole = require('./middlewares/cleanerConsole')
const unknowEndpoint = require('./middlewares/unknowEndpoint')
const errorHandler = require('./middlewares/errorHandler')

// Conectamos la base de datos
logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
  .then(result=>{
    console.log('Conexión establecida')
  })
  .catch((error)=>{
    console.log('No se ha podido conectar con la base de datos', error.message)
  })

// Limpiamos Colecciones ???
cleannerCollections.users()


// MIDDLEWARES
// app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(cleanerConsole)
morgan.token('bodyRequest', (request, response)=>{
  return JSON.stringify(request.body)
})
// Y llamamos al middleware Morgan con un mensaje formateado con los tokkens que queremos
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyRequest'))

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(unknowEndpoint)
app.use(errorHandler)

module.exports = app