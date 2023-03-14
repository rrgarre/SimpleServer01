const User = require('../models/user')
const Note = require('../models/note')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const initialNotes = [
    {
      content: 'Primera nota',
      date: new Date(),
      important: false,
    },
    {
      content: 'Contenido de la segunda nota',
      date: new Date(),
      important: true,

    }
]
const initialUsers = [
    {
        username: 'RRGarre',
        name: 'Rafa',
        passwordHash: 'asdasdasdasdasdasd'
    },
    {
        username: 'EliteDanza',
        name: 'Tami',
        passwordHash: 'asdasdasdasdasdasd'
    }
]


const users = async () => {
    
    await User.deleteMany({})
    console.log('*** Se Limpia Coleccion: USERS')
    
    for(let user of initialUsers){
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10)
        currentUser = new User(user)
        await currentUser.save()
        console.log('UUU: Usuario creado')
    }   
    
}

const notes = async () => {
    
    await Note.deleteMany({})
    console.log('***: Se Limpia Coleccion: NOTES')
    

    for(let note of initialNotes){
        currentNote = new Note(note)
        await currentNote.save()
        console.log('NNN: Nota añadida')
    }  
}

module.exports = {
    users,
    notes
}