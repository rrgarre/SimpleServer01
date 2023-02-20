require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
if(process.env.NODE_ENV === "test"){
  console.log('estamos en modo test:..............')
  const MONGODB_URI = process.env.MONGODB_URI_TEST
}

module.exports = {
  PORT,
  MONGODB_URI
}