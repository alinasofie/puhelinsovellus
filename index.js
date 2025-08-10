require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path');
const Note = require('./models/note')
const Contact = require('./models/contact')

const app = express()

app.use('/api', express.json())
app.use(cors())


const PORT = process.env.PORT || 3001



console.log('__dirname is:', __dirname);
morgan.token('post-contact', (request) => {
    if (request.method === 'POST' && request.body && request.body.name && request.body.number) {
        return `name=${request.body.name}, number=${request.body.number}`
    }
    return ''

})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-contact'))
// toimii paremmin npm start-serverin käynnistyksellä kuin npm run devillä, koska jälkimmäinen päivittää komentokehotteen niin nopeesti että syöte häviää näkyvistä

let contacts = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
let notes = [
    {
      "id": "1",
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": "2",
      "content": "Browser can execute only Javascript",
      "important": false
    },
    {
      "id": "3",
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    },
    {
      "id": "c592",
      "content": "HTML is the most boring language",
      "important": true
    },
    {
      "id": "8dde",
      "content": "Hello",
      "important": true
    },
    {
      "id": "ae58",
      "content": "Hello again",
      "important": false
    }
]



app.get('/', (request, response) => { // random
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes.map(note => note.toJSON()))
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note.toJSON())
        } else {
            response.status(404).end()
        }
    })
})

app.get('/api/contacts', (request, response) => { //get all
  Contact.find({}).then(contacts => {
    response.json(contacts.map(contact => contact.toJSON()))
  })
})

app.get('/api/info', (request, response) => { // count number and date
    const count = contacts.length
    const date = new Date()
    response.send(`<p>Kontakteja on ${count} kappaletta</p><p>${date}</p>`)
}) 

app.get('/api/contacts/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
        if (contact) {
            response.json(contact.toJSON())
        } else {
            response.status(404).send({ error: 'Kontaktia ei ole' })
        }
    })
})

app.delete('/api/contacts/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(404).send({ error: 'Kontakti poistettu'})
        })
})
app.post('/api/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save().then(savedNote => {
        response.json(savedNote.toJSON())
    })
})

app.post('/api/contacts', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Nimi tai numero puuttuu'})

    }
    const contact = new Contact({
        name: body.name,
        number: body.number,
    })
    contact.save().then(savedContact => {
        response.status(201).json(savedContact.toJSON())
    })

})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)
app.use(express.static(path.join(__dirname, 'dist')));


