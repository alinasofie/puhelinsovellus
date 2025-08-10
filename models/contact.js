require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

mongoose.connect(url)


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nimi puuttuu'],
        minlength: [3, 'Nimen on oltava väh. 3 merkkiä pitkä']
    },
    number: {
        type: String,
        required: [true, 'Numero puuttuu']
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Contact', contactSchema)