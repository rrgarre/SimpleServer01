const User = require('../models/user')
const mongoose = require('mongoose')




const users = () => {
    
    User.deleteMany({}, ()=>{
        console.log('*** Se Limpia Coleccion: USERS')
    })
    
}

module.exports = {
    users
}