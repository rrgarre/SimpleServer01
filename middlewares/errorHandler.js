// Manejador de Errores MIDDLEWARE definición
module.exports = (error, request, response, next) => {
  console.log('XXX mensaje: ', error.message)
  console.log('XXX nombre: ', error.name)
  if(error.name === 'CastError'){
    return response.status(400).json({error: "malformatted id"})
  }
  if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  console.log('XXXXX Pasamos el Error a los manejadores de Express XXXX')
  next(error)
}