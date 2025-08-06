const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

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

app.get('/', (request, response) => { // random
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/contacts', (request, response) => { //get all
  response.json(contacts)
})
app.get('/api/info', (request, response) => { // count number and date
    const count = contacts.length
    const date = new Date()
    response.send(`<p>Kontakteja on ${count} kappaletta</p><p>${date}</p>`)
}) 

app.get('/api/contacts/:id', (request, response) => { // search
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).send({ error: 'Kontaktia ei ole'})
    }
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const allLength = contacts.length
    contacts = contacts.filter(contact => contact.id !== id)
    if (contacts.length < allLength) {
        response.status(204).end()
    } else {
        response.status(404).send({ error: 'Kontaktia ei löytynyt'})
    }
})
app.post('/api/contacts', (request, response) => {
    const contact = request.body
    if (!contact.name || !contact.number) {
        return response.status(400).json({ error: 'Nimi tai numero puuttuu'})

    }
    if (contacts.find(c => c.name === contact.name)) {
        return response.status(409),json({ error: 'Sama nimi on jo luettelossa'})
    }
    let newId
    do {
        newId = Math.floor(Math.random() * 900000) + 100000
    } while (contacts.find(c => c.id === String(newId)))
    const newContact = {
        id: String(newId),
        name: contact.name,
        number: contact.number
    }
    contacts.push(newContact)
    response.status(201).json(newContact)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})