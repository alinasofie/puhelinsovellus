const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const uri = `mongodb+srv://alinalaaksonen:${password}@cluster0.lkwmyef.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);
mongoose.connect(uri)
    .then(() => {
        console.log('Yhdistetty MongoDB-tietokantaan');

    })
    .catch((err) => console.error('Virhe yhdistettäessä:', err));


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Contact = mongoose.model('Contact', contactSchema)
if (process.argv.length === 3) {
    Contact.find({}).then(contacts => {
        console.log('Puhelinluettelo')
        contacts.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    Contact.findOne({ name }).then(existing => {
        if (existing) {
            console.log(`Kontakti on jo olemassa nimellä ${name}`)
            mongoose.connection.close()
        } else {
            const contact = new Contact({ name, number })
            contact.save().then(() => {
                console.log(`Lisätty ${name} ja ${number}`)
                mongoose.connection.close()
            })
        }
    })
} else {
    console.log('Virhe. Väärä määrä argumentteja')
    mongoose.connection.close()
}


