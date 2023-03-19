const app = require('./app')                                // linea basica
const http = require('http')                                // linea basica
const config = require('./utils/config')
const logger = require('./utils/logger')

require('dotenv').config()
// const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
// Importamos el Modelo
const Note = require('./models/note')

server.listen(config.PORT, ()=>{                            // linea basica
  logger.info(`Server running on port: ${config.PORT}`)
})